import { PasskeyStamper } from '@turnkey/react-native-passkey-stamper';
import { TurnkeyClient } from '@turnkey/http';

export const stampGetWhoami = async (organizationId: string) => {
  const stamper = new PasskeyStamper({
    rpId: process.env.EXPO_PUBLIC_TURNKEY_RP_ID ?? '',
  });

  const client = new TurnkeyClient(
    { baseUrl: process.env.EXPO_PUBLIC_TURNKEY_API_URL ?? '' },
    stamper
  );

  const signedRequest = await client.stampGetWhoami({
    organizationId,
  });

  const { url, body, stamp } = signedRequest;

  // Forward the signed request to the Turnkey API for validation
  const resp = await fetch(url, {
    method: 'POST',
    body,
    headers: {
      [stamp.stampHeaderName]: stamp.stampHeaderValue,
    },
  });

  return resp;
};
