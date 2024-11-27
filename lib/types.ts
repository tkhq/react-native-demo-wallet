import { TurnkeyApiTypes } from '@turnkey/sdk-server';

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

export type MethodParamsMap = {
  getSubOrgId: GetSubOrgIdParams;
  initOTPAuth: InitOtpAuthParams;
  createSubOrg: CreateSubOrgParams;
};

export type MethodName = keyof MethodParamsMap;

export type ParamsType<M extends MethodName> = MethodParamsMap[M];

export type JSONRPCRequest<M extends MethodName> = {
  method: M;
  params: ParamsType<M>;
};
