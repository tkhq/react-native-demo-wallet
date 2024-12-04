import { uncompressRawPublicKey } from '@turnkey/crypto';

import { getPublicKey } from '@turnkey/crypto';
import { getRandomBytesAsync } from 'expo-crypto';
import { toHex } from 'viem';
import { KeyPair } from './types';

export const generateP256KeyPair = async (): Promise<KeyPair> => {
  const privateKey = await getRandomBytesAsync(32);
  const publicKey = getPublicKey(privateKey, true);

  return {
    privateKey: toHex(privateKey),
    publicKey: toHex(uncompressRawPublicKey(publicKey)),
  };
};
