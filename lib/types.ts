import { type TurnkeyApiTypes } from '@turnkey/sdk-server';
import { type Hex } from 'viem';

export type Attestation = TurnkeyApiTypes['v1Attestation'];
export type WalletAccountParams = TurnkeyApiTypes['v1WalletAccountParams'];

export type Email = `${string}@${string}.${string}`;

export type GetSubOrgIdParams = {
  filterType:
    | 'NAME'
    | 'USERNAME'
    | 'EMAIL'
    | 'PHONE_NUMBER'
    | 'CREDENTIAL_ID'
    | 'PUBLIC_KEY'
    | 'OIDC_TOKEN';
  filterValue: string;
};

export type InitOtpAuthParams = {
  otpType: 'OTP_TYPE_EMAIL' | 'OTP_TYPE_SMS';
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
}

export type OAuthLoginParams = {
  oidcToken: string;
  providerName: string;
  targetPublicKey: string;
  expirationSeconds: string;
}

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

export enum Authenticator {
  APIKey = 'API_KEY',
  Passkey = 'PASSKEY',
}

export type KeyPair = {
  privateKey: Hex;
  publicKey: Hex;
};

export type User = {
  id: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  organizationId: string;
  wallets: {
    name: string;
    id: string;
    accounts: `0x${string}`[];
  }[];
};

export enum LoginMethod {
  Passkey = 'PASSKEY',
  Email = 'EMAIL',
  Phone = 'PHONE',
  OAuth = 'OAUTH',
}
