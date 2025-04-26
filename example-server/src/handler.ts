import { Request } from "express";
import dotenv from "dotenv";
import { DEFAULT_ETHEREUM_ACCOUNTS, Turnkey } from "@turnkey/sdk-server";
import { decodeJwt } from "./util.js";
import {
  GetSubOrgIdParams,
  GetSubOrgIdResponse,
  InitOtpAuthParams,
  InitOtpAuthResponse,
  CreateSubOrgParams,
  CreateSubOrgResponse,
  OtpAuthParams,
  OtpAuthResponse,
  OAuthLoginParams,
  OAuthLoginResponse,
} from "./types.js";

dotenv.config();

export const turnkeyConfig = {
  apiBaseUrl: process.env.TURNKEY_API_URL ?? "",
  defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID ?? "",
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY ?? "",
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY ?? "",
};

const turnkey = new Turnkey(turnkeyConfig).apiClient();

export async function getSubOrgId(
  req: Request<{}, {}, GetSubOrgIdParams>,
): Promise<GetSubOrgIdResponse> {
  const { filterType, filterValue } = req.body;
  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType,
    filterValue,
  });

  return {
    organizationId: organizationIds[0] || turnkeyConfig.defaultOrganizationId,
  };
}

export async function initOtpAuth(
  req: Request<{}, {}, InitOtpAuthParams>,
): Promise<InitOtpAuthResponse> {
  const { otpType, contact } = req.body;
  let organizationId = turnkeyConfig.defaultOrganizationId;

  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType: otpType === "OTP_TYPE_EMAIL" ? "EMAIL" : "PHONE_NUMBER",
    filterValue: contact,
  });

  if (organizationIds.length > 0) {
    organizationId = organizationIds[0];
  } else {
    const createSubOrgParams =
      otpType === "OTP_TYPE_EMAIL" ? { email: contact } : { phone: contact };

    const subOrgResponse = await createSubOrg({
      body: createSubOrgParams,
    } as Request);
    organizationId = subOrgResponse.subOrganizationId;
  }

  const result = await turnkey.initOtpAuth({
    organizationId,
    otpType,
    contact,
  });

  return {
    otpId: result.otpId,
    organizationId,
  };
}

export async function otpAuth(
  req: Request<{}, {}, OtpAuthParams>,
): Promise<OtpAuthResponse> {
  const {
    otpId,
    otpCode,
    organizationId,
    targetPublicKey,
    expirationSeconds,
    invalidateExisting,
  } = req.body;

  const result = await turnkey.otpAuth({
    otpId,
    otpCode,
    organizationId,
    targetPublicKey,
    expirationSeconds,
    invalidateExisting,
  });

  return { credentialBundle: result.credentialBundle };
}

export async function oauthLogin(
  req: Request<{}, {}, OAuthLoginParams>,
): Promise<OAuthLoginResponse> {
  const { oidcToken, providerName, targetPublicKey, expirationSeconds } =
    req.body;
  let organizationId = turnkeyConfig.defaultOrganizationId;

  const { organizationIds } = await turnkey.getSubOrgIds({
    filterType: "OIDC_TOKEN",
    filterValue: oidcToken,
  });

  if (organizationIds.length > 0) {
    organizationId = organizationIds[0];
  } else {
    const subOrgResponse = await createSubOrg({
      body: { oauth: { oidcToken, providerName } },
    } as Request);
    organizationId = subOrgResponse.subOrganizationId;
  }

  const oauthResponse = await turnkey.oauth({
    organizationId,
    oidcToken,
    targetPublicKey,
    expirationSeconds,
  });

  return { credentialBundle: oauthResponse.credentialBundle };
}

export async function createSubOrg(
  req: Request<{}, {}, CreateSubOrgParams>,
): Promise<CreateSubOrgResponse> {
  const { email, phone, passkey, oauth, apiKeys } = req.body;

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

  if (oauth) {
    const decoded = decodeJwt(oauth.oidcToken);
    if (decoded?.email) {
      userEmail = decoded.email;
    }
  }

  const userPhoneNumber = phone;
  const subOrganizationName = `Sub Org - ${email || phone}`;
  const userName = email ? email.split("@")[0] || email : "";

  const result = await turnkey.createSubOrganization({
    organizationId: turnkeyConfig.defaultOrganizationId,
    subOrganizationName,
    rootUsers: [
      {
        userName,
        userEmail,
        userPhoneNumber,
        oauthProviders,
        authenticators,
        apiKeys: apiKeys ?? [],
      },
    ],
    rootQuorumThreshold: 1,
    wallet: {
      walletName: "Default Wallet",
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
    },
  });

  return { subOrganizationId: result.subOrganizationId };
}
