import { JSONRPCRequest, MethodName, ParamsType } from '../lib/types';
import { DEFAULT_ETHEREUM_ACCOUNTS, Turnkey } from '@turnkey/sdk-server';

const turnkey = new Turnkey({
  apiBaseUrl: process.env.EXPO_PUBLIC_TURNKEY_API_URL ?? '',
  defaultOrganizationId: process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? '',
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY ?? '',
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY ?? '',
}).apiClient();

export async function POST(request: Request) {
  console.log('request', request);
  const body: JSONRPCRequest<MethodName> = await request.json();
  const { method, params } = body;
  console.log('method', method, params);
  switch (method) {
    case 'getSubOrgId':
      return handleGetSubOrgId(params as ParamsType<'getSubOrgId'>);
    case 'initOTPAuth':
      return handleInitOtpAuth(params as ParamsType<'initOTPAuth'>);
    case 'createSubOrg':
      return handleCreateSubOrg(params as ParamsType<'createSubOrg'>);
    default:
      return Response.json({ error: 'Method not found' }, { status: 404 });
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

  if (otpType === 'OTP_TYPE_EMAIL') {
    const { organizationIds } = await turnkey.getSubOrgIds({
      filterType: 'EMAIL',
      filterValue: contact,
    });
    if (organizationIds.length > 0) {
      organizationId = organizationIds[0];
    }
  }

  const result = await turnkey.initOtpAuth({
    organizationId,
    otpType,
    contact,
  });

  return Response.json(result);
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
