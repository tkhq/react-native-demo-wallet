import { Email, JSONRPCRequest, MethodName, ParamsType } from "../lib/types";
import { DEFAULT_ETHEREUM_ACCOUNTS, Turnkey } from "@turnkey/sdk-server";
import { decode, JwtPayload } from "jsonwebtoken";

export const turnkeyConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_TURNKEY_API_URL ?? "",
  defaultOrganizationId: process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? "",
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY ?? "",
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY ?? "",
};

const turnkey = new Turnkey(turnkeyConfig).apiClient();

function decodeJwt(credential: string): JwtPayload | null {
  const decoded = decode(credential);

  if (decoded && typeof decoded === "object" && "email" in decoded) {
    return decoded as JwtPayload;
  }

  return null;
}

export async function POST(request: Request) {
  const body: JSONRPCRequest<MethodName> = await request.json();
  const { method, params } = body;

  try {
    switch (method) {
      case "getSubOrgId":
        return handleGetSubOrgId(params as ParamsType<"getSubOrgId">);
      case "initOTPAuth":
        return handleInitOtpAuth(params as ParamsType<"initOTPAuth">);
      case "createSubOrg":
        return handleCreateSubOrg(params as ParamsType<"createSubOrg">);
      case "otpAuth":
        return handleOtpAuth(params as ParamsType<"otpAuth">);
      case "oAuthLogin":
        return handleOAuthLogin(params as ParamsType<"oAuthLogin">);
      default:
        return Response.json({ error: "Method not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("server error", { ...error }, JSON.stringify(error));
    if (error) {
      return Response.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    } else {
      return Response.json(
        { error: "An unknown error occurred", code: 0 },
        { status: 500 }
      );
    }
  }
}

async function handleGetSubOrgId(params: ParamsType<"getSubOrgId">) {
  const { filterType, filterValue } = params;

  let organizationId: string = turnkeyConfig.defaultOrganizationId;
  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType,
    filterValue,
  });
  if (organizationIds.length > 0) {
    organizationId = organizationIds[0];
  }
  return Response.json({ organizationId });
}

async function handleInitOtpAuth(params: ParamsType<"initOTPAuth">) {
  const { otpType, contact } = params;
  let organizationId: string = turnkeyConfig.defaultOrganizationId;

  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType: otpType === "OTP_TYPE_EMAIL" ? "EMAIL" : "PHONE_NUMBER",
    filterValue: contact,
  });

  if (organizationIds.length > 0) {
    organizationId = organizationIds[0];
  } else {
    // User does not exist, create a new sub org before continuing

    const createSubOrgParams =
      otpType === "OTP_TYPE_EMAIL"
        ? { email: contact as Email }
        : { phone: contact };

    const result = await handleCreateSubOrg(createSubOrgParams);
    const { subOrganizationId } = await result.json();
    organizationId = subOrganizationId;
  }

  const result = await turnkey.initOtpAuth({
    organizationId,
    otpType,
    contact,
  });

  return Response.json({ ...result, organizationId });
}

async function handleOtpAuth(params: ParamsType<"otpAuth">) {
  const {
    otpId,
    otpCode,
    organizationId,
    targetPublicKey,
    expirationSeconds,
    invalidateExisting,
  } = params;

  try {
    const result = await turnkey.otpAuth({
      otpId,
      otpCode,
      organizationId,
      targetPublicKey,
      expirationSeconds,
      invalidateExisting,
    });

    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error }, { status: 500 });
  }
}

async function handleCreateSubOrg(params: ParamsType<"createSubOrg">) {
  const { email, phone, passkey, oauth } = params;

  const authenticators = passkey
    ? [
        {
          authenticatorName: "Passkey",
          challenge: passkey.challenge,
          attestation: passkey.attestation,
        },
      ]
    : [];

  const oauthProviders = oauth
    ? [
        {
          providerName: oauth.providerName,
          oidcToken: oauth.oidcToken,
        },
      ]
    : [];

  let userEmail = email;

  // If the user is logging in with a Google Auth credential, use the email from the decoded OIDC token (credential
  // Otherwise, use the email from the email parameter
  if (oauth) {
    const decoded = decodeJwt(oauth.oidcToken);
    if (decoded?.email) {
      userEmail = decoded.email;
    }
  }

  const userPhoneNumber = phone;


  const subOrganizationName = `Sub Org - ${email || phone}`;
  const userName = email ? email.split("@")?.[0] || email : "";

  const result = await turnkey.createSubOrganization({
    organizationId: turnkeyConfig.defaultOrganizationId,
    subOrganizationName: subOrganizationName,
    rootUsers: [
      {
        userName,
        userEmail,
        userPhoneNumber,
        oauthProviders,
        authenticators,
        apiKeys: [],
      },
    ],
    rootQuorumThreshold: 1,
    wallet: {
      walletName: "Default Wallet",
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
    },
  });
  return Response.json(result);
}

async function handleOAuthLogin(params: ParamsType<"oAuthLogin">) {
  const { oidcToken, providerName, targetPublicKey, expirationSeconds } =
    params;
  let organizationId: string = turnkeyConfig.defaultOrganizationId;

  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType: "OIDC_TOKEN",
    filterValue: oidcToken,
  });

  if (organizationIds.length > 0) {
    organizationId = organizationIds[0];
  } else {
    const createSubOrgParams = { oauth: { oidcToken, providerName } };
    const result = await handleCreateSubOrg(createSubOrgParams);
    const { subOrganizationId } = await result.json();
    organizationId = subOrganizationId;
  }

  const oauthResponse = await turnkey.oauth({
    organizationId,
    oidcToken,
    targetPublicKey,
    expirationSeconds,
  });

  return Response.json(oauthResponse);
}
