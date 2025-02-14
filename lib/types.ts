import { type TurnkeyApiTypes } from "@turnkey/sdk-server";
import { type Hex } from "viem";

export enum HashFunction {
  NoOp = "HASH_FUNCTION_NO_OP",
  SHA256 = "HASH_FUNCTION_SHA256",
  KECCAK256 = "HASH_FUNCTION_KECCAK256",
  NotApplicable = "HASH_FUNCTION_NOT_APPLICABLE",
}

export enum PayloadEncoding {
  Hexadecimal = "PAYLOAD_ENCODING_HEXADECIMAL",
  TextUTF8 = "PAYLOAD_ENCODING_TEXT_UTF8",
}

export enum Authenticator {
  APIKey = "API_KEY",
  Passkey = "PASSKEY",
}

export enum LoginMethod {
  Passkey = "PASSKEY",
  Email = "EMAIL",
  Phone = "PHONE",
  OAuth = "OAUTH",
}

export type KeyPair = {
  privateKey: Hex;
  publicKey: Hex;
};

export type SignRawPayloadResult =
  | {
      r: string;
      s: string;
      v: string;
    }
  | undefined;

export type Email = `${string}@${string}.${string}`;

export type User = {
  id: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  organizationId: string;
  wallets: Wallet[];
};

export type Wallet = {
  name: string;
  id: string;
  accounts: `0x${string}`[];
};

export type Attestation = TurnkeyApiTypes["v1Attestation"];
export type WalletAccountParams = TurnkeyApiTypes["v1WalletAccountParams"];

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

export type InitOtpAuthParams = {
  otpType: "OTP_TYPE_EMAIL" | "OTP_TYPE_SMS";
  contact: string;
};

export type CreateSubOrgParams = {
  email?: Email;
  phone?: string;
  passkey?: {
    name?: string;
    challenge: string;
    attestation: Attestation;
  };
  oauth?: OAuthProviderParams;
};

export type GetWhoamiParams = {
  organizationId: string;
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

export type MethodParamsMap = {
  getSubOrgId: GetSubOrgIdParams;
  initOTPAuth: InitOtpAuthParams;
  createSubOrg: CreateSubOrgParams;
  getWhoami: GetWhoamiParams;
  otpAuth: OtpAuthParams;
  oAuthLogin: OAuthLoginParams;
};

export type MethodName = keyof MethodParamsMap;

export type ParamsType<M extends MethodName> = MethodParamsMap[M];

export type JSONRPCRequest<M extends MethodName> = {
  method: M;
  params: ParamsType<M>;
};
