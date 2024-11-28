import { PasskeyStamper } from '@turnkey/react-native-passkey-stamper';
import { TurnkeyClient } from '@turnkey/http';

export const stampGetWhoami = async (organizationId: string) => {
  const stamper = new PasskeyStamper({
    rpId: 'localhost',
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

// export const stampGetWhoami = (organizationId: string) => {
//   return {
//     with: async (authenticator: Authenticator) => {
//       let stamper;

//       switch (authenticator) {
//         case Authenticator.APIKey:
//           stamper = await new ApiKeyStamper({
//             apiPublicKey: '', // Placeholder, fill in later
//             apiPrivateKey: '', // Placeholder, fill in later
//           });
//           break;
//         default:
//           stamper = await new PasskeyStamper({
//             rpId: 'localhost',
//           });
//           break;
//       }

//       const client = new TurnkeyClient(
//         { baseUrl: 'https://api.turnkey.com' },
//         stamper
//       );

//       const signedRequest = await client.stampGetWhoami({
//         organizationId,
//       });

//       const { url, body, stamp } = signedRequest;

//       // Forward the signed request to the Turnkey API for validition
//       const resp = await fetch(url, {
//         method: 'POST',
//         body,
//         headers: {
//           [stamp.stampHeaderName]: stamp.stampHeaderValue,
//         },
//       });

//       console.log(resp);

//       return signedRequest;
//     },
//   };
// };
