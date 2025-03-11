import { Address, createPublicClient, http, PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
let publicClient: PublicClient;

export const getPublicClient = () => {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
  }
  return publicClient;
};

export const getBalance = async (address: Address) => {
  const balance = await getPublicClient().getBalance({ address });
  return balance;
};

type TokenPriceResponse<T extends string> = {
  [key in T]: {
    usd: number;
  };
};

export const getTokenPrice = async <T extends string>(
  token: T
): Promise<number> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': process.env.COINGECKO_API_KEY ?? '',
    },
  });
  const data: TokenPriceResponse<T> = await response.json();

  return data[token].usd;
};