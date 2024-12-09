import { TurnkeyApiTypes } from '@turnkey/sdk-server';
import { JSONRPCRequest, MethodName, ParamsType } from './types';

interface TurnkeyRPCErrorDetails {
  code: string;
  message: string;
}

class TurnkeyRPCError extends Error implements TurnkeyRPCErrorDetails {
  code: string;

  constructor({ code, message }: TurnkeyRPCErrorDetails) {
    super(message);
    this.code = code;
    this.name = 'TurnkeyRPCError';
  }
}

export async function jsonRpcRequest<M extends MethodName, T>(
  method: M,
  params: ParamsType<M>
): Promise<T> {
  const requestBody: JSONRPCRequest<M> = {
    method,
    params,
  };

  const response = await fetch(
    'https://react-native-demo-wallet.vercel.app/turnkey',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const { error } = await response.json();

    throw new TurnkeyRPCError(error);
  }

  return response.json();
}

export const initOTPAuth = async (
  params: ParamsType<'initOTPAuth'>
): Promise<
  TurnkeyApiTypes['v1InitOtpAuthResult'] & { organizationId: string }
> => {
  return jsonRpcRequest<
    'initOTPAuth',
    TurnkeyApiTypes['v1InitOtpAuthResult'] & { organizationId: string }
  >('initOTPAuth', params);
};

export const getSubOrgId = async (params: ParamsType<'getSubOrgId'>) => {
  const { organizationIds } = await jsonRpcRequest<
    'getSubOrgId',
    TurnkeyApiTypes['v1GetSubOrgIdsResponse']
  >('getSubOrgId', params);

  return organizationIds[0];
};

export const createSubOrg = async (params: ParamsType<'createSubOrg'>) => {
  return jsonRpcRequest<
    'createSubOrg',
    TurnkeyApiTypes['v1CreateSubOrganizationIntentV7']
  >('createSubOrg', params);
};

export const getWhoami = async (params: ParamsType<'getWhoami'>) => {
  return jsonRpcRequest<'getWhoami', TurnkeyApiTypes['v1GetWhoamiResponse']>(
    'getWhoami',
    params
  );
};

export const otpAuth = async (
  params: ParamsType<'otpAuth'>
): Promise<TurnkeyApiTypes['v1OtpAuthResult']> => {
  return jsonRpcRequest<'otpAuth', TurnkeyApiTypes['v1OtpAuthResult']>(
    'otpAuth',
    params
  );
};
