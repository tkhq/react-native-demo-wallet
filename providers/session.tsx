import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { getPublicKey, decryptCredentialBundle } from '@turnkey/crypto';
import { Hex, toHex } from 'viem';
import { generateP256KeyPair } from '../lib/crypto';
import { toast } from 'sonner-native';
import { usePathname, useRouter } from 'expo-router';

enum StorageKey {
  EmbeddedKey = 'embedded-key',
  Session = 'session',
}
// In seconds: 900s = 15 minutes
const DEFAULT_SESSION_EXPIRATION = 900;

type Session = {
  publicKey: Hex;
  privateKey: Hex;
  expiry: number;
};

export interface SessionContextType {
  session: Session | null;
  createEmbeddedKey: () => Promise<Hex>;
  createSession: (bundle: string, expiry?: number) => Promise<Session>;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

export const SessionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      console.log('getting session');
      const session = await getSession();
      console.log('session', session);
      if (session?.expiry && session.expiry > Date.now()) {
        console.log('session found', session);
        setSession(session);
        if (pathname !== '/dashboard') {
          router.replace('/dashboard');
        }
      } else {
        toast.error('Session expired');
        if (pathname === '/dashboard') {
          router.push('/');
        }
      }
    })();
  }, []);

  /**
   * Creates an embedded key
   * @returns The embedded public key
   */
  const createEmbeddedKey = async () => {
    const key = await generateP256KeyPair();
    // Remove the 0x prefix from the private key
    const embeddedPrivateKey = key.privateKey.slice(2);
    const publicKey = key.publicKey;

    await saveEmbeddedKey(embeddedPrivateKey);

    return publicKey;
  };

  const saveEmbeddedKey = async (key: string) => {
    await SecureStore.setItemAsync(StorageKey.EmbeddedKey, key);
  };

  /**
   * Gets the embedded key and *deletes* it from storage
   * @param deleteKey - Whether to delete the key from storage
   * @returns The embedded key
   */
  const getEmbeddedKey = async (deleteKey = true) => {
    return SecureStore.getItemAsync(StorageKey.EmbeddedKey).then((key) => {
      if (deleteKey) {
        SecureStore.deleteItemAsync(StorageKey.EmbeddedKey);
      }
      return key;
    });
  };

  /**
   * Creates a session from a credential bundle
   * @param bundle - The credential bundle
   * @param expiry - The expiry time in seconds, defaults to 15 minutes
   */
  const createSession = async (
    bundle: string,
    expirySeconds: number = DEFAULT_SESSION_EXPIRATION
  ): Promise<Session> => {
    const embeddedKey = await getEmbeddedKey();
    if (!embeddedKey) {
      throw new Error('Embedded key not found.');
    }

    const privateKey = (await decryptCredentialBundle(
      bundle,
      embeddedKey
    )) as Hex;

    const expiry = Date.now() + expirySeconds * 1000;

    const publicKey = toHex(getPublicKey(privateKey));
    const session = { publicKey, privateKey, expiry };
    saveSession(session);

    return session;
  };

  const getSession = async (): Promise<Session | null> => {
    const session = await SecureStore.getItemAsync(StorageKey.Session);
    if (session) {
      return JSON.parse(session);
    }

    return null;
  };

  const saveSession = async (session: Session) => {
    setSession(session);
    await storeSession(session);
  };

  const storeSession = async (session: Session) => {
    await SecureStore.setItemAsync(StorageKey.Session, JSON.stringify(session));
  };

  const clearSession = async () => {
    setSession(null);
    await SecureStore.deleteItemAsync(StorageKey.Session);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        createEmbeddedKey,
        createSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
