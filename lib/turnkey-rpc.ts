import { TurnkeyApiTypes } from '@turnkey/sdk-server';
import { JSONRPCRequest, MethodName, ParamsType } from './types';

export async function jsonRpcRequest<M extends MethodName, T>(
  method: M,
  params: ParamsType<M>
): Promise<T> {
  const requestBody: JSONRPCRequest<M> = {
    method,
    params,
  };

  const response = await fetch('http://192.168.0.43:8081/turnkey', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

export const initOTPAuth = async (params: ParamsType<'initOTPAuth'>) => {
  return jsonRpcRequest<'initOTPAuth', TurnkeyApiTypes['v1InitOtpAuthResult']>(
    'initOTPAuth',
    params
  );
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
