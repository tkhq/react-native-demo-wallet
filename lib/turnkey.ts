import { PasskeyStamper } from '@turnkey/react-native-passkey-stamper';
import { TurnkeyClient } from '@turnkey/http';

export const stampGetWhoami = async (organizationId: string) => {
  const stamper = new PasskeyStamper({
    rpId: 'react-native-demo-wallet.vercel.app',
  });

  const client = new TurnkeyClient(
    { baseUrl: 'https://api.turnkey.com' },
    stamper
  );

  const signedRequest = await client.stampGetWhoami({
    organizationId,
  });
  console.log('signedRequest', signedRequest);
  const { url, body, stamp } = signedRequest;

  // Forward the signed request to the Turnkey API for validation
  const resp = await fetch(url, {
    method: 'POST',
    body,
    headers: {
      [stamp.stampHeaderName]: stamp.stampHeaderValue,
    },
  });

  console.log(resp);

  return resp;
};
