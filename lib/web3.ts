import { Address, createPublicClient, http, PublicClient } from "viem";
import { sepolia } from "viem/chains";
let publicClient: PublicClient;
import { withTimeout } from "./utils";

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
  const balance = await withTimeout(
    getPublicClient().getBalance({ address }),
    2000,
    BigInt(0)
  );
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

  const fetchPromise = fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': process.env.COINGECKO_API_KEY ?? '',
    },
  })
    .then((res) => res.json())
    .then((data: TokenPriceResponse<T>) => data[token]?.usd ?? 0);

  const price = await withTimeout(fetchPromise, 2000, 0);
  return price;
};
