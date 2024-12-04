import { TSignedRequest, TurnkeyApiTypes } from '@turnkey/sdk-server';
import { Hex } from 'viem/_types/types/misc';

export type Attestation = TurnkeyApiTypes['v1Attestation'];

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
  email: Email;
  passkey?: {
    name?: string;
    challenge: string;
    attestation: Attestation;
  };
};

export type GetWhoamiParams = {
  organizationId: string;
};

export type OtpAuthParams = {
  otpId: string;
  otpCode: string;
  targetPublicKey: Hex;
  organizationId: string;
};

export type MethodParamsMap = {
  getSubOrgId: GetSubOrgIdParams;
  initOTPAuth: InitOtpAuthParams;
  createSubOrg: CreateSubOrgParams;
  getWhoami: GetWhoamiParams;
  otpAuth: OtpAuthParams;
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
