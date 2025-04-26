import { type TurnkeyApiTypes } from "@turnkey/sdk-server";

export type GetSubOrgIdParams = {
  filterType:
    | "NAME"
    | "USERNAME"
    | "EMAIL"
    | "PHONE_NUMBER"
    | "CREDENTIAL_ID"
    | "PUBLIC_KEY"
    | "OIDC_TOKEN";
  filterValue: string;
};

export type GetSubOrgIdResponse = {
  organizationId: string;
};

export type InitOtpAuthParams = {
  otpType: "OTP_TYPE_EMAIL" | "OTP_TYPE_SMS";
  contact: string;
};

export type InitOtpAuthResponse = {
  otpId: string;
  organizationId: string;
};

export type CreateSubOrgParams = {
  email?: string;
  phone?: string;
  passkey?: {
    name?: string;
    challenge: string;
    attestation: Attestation;
  };
  oauth?: OAuthProviderParams;
  apiKeys?: {
    apiKeyName: string;
    publicKey: string;
    curveType: CurveType;
    expirationSeconds?: string;
}[]
};

export type CreateSubOrgResponse = {
  subOrganizationId: string;
};

export type OtpAuthParams = {
  otpId: string;
  otpCode: string;
  organizationId: string;
  targetPublicKey: string;
  apiKeyName?: string;
  expirationSeconds?: string;
  invalidateExisting?: boolean;
};

export type OtpAuthResponse = {
  credentialBundle?: string;
};

export type OAuthProviderParams = {
  providerName: string;
  oidcToken: string;
};

export type OAuthLoginParams = {
  oidcToken: string;
  providerName: string;
  targetPublicKey: string;
  expirationSeconds: string;
};

export type OAuthLoginResponse = {
  credentialBundle: string;
};

export type Attestation = TurnkeyApiTypes["v1Attestation"];
export type CurveType = TurnkeyApiTypes["v1ApiKeyCurve"];
