import { JSONRPCRequest, MethodName, ParamsType } from '../lib/types';
import { DEFAULT_ETHEREUM_ACCOUNTS, Turnkey } from '@turnkey/sdk-server';

const turnkey = new Turnkey({
  apiBaseUrl: process.env.EXPO_PUBLIC_TURNKEY_API_URL ?? '',
  defaultOrganizationId: process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? '',
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY ?? '',
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY ?? '',
}).apiClient();

export async function POST(request: Request) {
  const body: JSONRPCRequest<MethodName> = await request.json();
  const { method, params } = body;

  try {
    switch (method) {
      case 'getSubOrgId':
        return handleGetSubOrgId(params as ParamsType<'getSubOrgId'>);
      case 'initOTPAuth':
        return handleInitOtpAuth(params as ParamsType<'initOTPAuth'>);
      case 'createSubOrg':
        return handleCreateSubOrg(params as ParamsType<'createSubOrg'>);
      case 'otpAuth':
        return handleOtpAuth(params as ParamsType<'otpAuth'>);
      default:
        return Response.json({ error: 'Method not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.log('server error', { ...error }, JSON.stringify(error));
    if (error) {
      return Response.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    } else {
      return Response.json(
        { error: 'An unknown error occurred', code: 0 },
        { status: 500 }
      );
    }
  }
}

async function handleGetSubOrgId(params: ParamsType<'getSubOrgId'>) {
  const { filterType, filterValue } = params;
  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType,
    filterValue,
  });
  return Response.json({ organizationIds });
}

async function handleInitOtpAuth(params: ParamsType<'initOTPAuth'>) {
  const { otpType, contact } = params;
  let organizationId: string =
    process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? '';

  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType: otpType === 'OTP_TYPE_EMAIL' ? 'EMAIL' : 'PHONE_NUMBER',
    filterValue: contact,
  });
  console.log('organizationIds', organizationIds);
  if (organizationIds.length > 0) {
    organizationId = organizationIds[0];
  }

  const result = await turnkey.initOtpAuth({
    organizationId,
    otpType,
    contact,
  });

  return Response.json({ ...result, organizationId });
}

async function handleOtpAuth(params: ParamsType<'otpAuth'>) {
  console.log('otpAuth', params);
  const { otpId, otpCode, targetPublicKey, organizationId } = params;

  try {
    const result = await turnkey.otpAuth({
      otpId,
      otpCode,
      targetPublicKey,
      invalidateExisting: false,
      organizationId,
    });

    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error }, { status: 500 });
  }
}

async function handleCreateSubOrg(params: ParamsType<'createSubOrg'>) {
  const { email, passkey } = params;
  const result = await turnkey.createSubOrganization({
    organizationId: process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? '',
    subOrganizationName: `Sub-organization at ${String(Date.now())}`,
    rootUsers: [
      {
        userName: 'Root User',
        userEmail: email,
        oauthProviders: [],
        authenticators: passkey
          ? [
              {
                authenticatorName: 'Passkey',
                ...passkey,
              },
            ]
          : [],
        apiKeys: [],
      },
    ],
    rootQuorumThreshold: 1,
    wallet: {
      walletName: 'Default Wallet',
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
    },
  });
  return Response.json(result);
}
