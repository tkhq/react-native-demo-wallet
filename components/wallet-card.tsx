// wallet-card.js
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
// import * as Clipboard from '@react-native-clipboard/clipboard';

import { formatEther } from 'viem';

import { Skeleton } from './ui/skeleton';
import { truncateAddress } from '~/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Icons } from './icons';
import { useTurnkey } from '~/hooks/use-turnkey';
import { H3, Muted } from './ui/typography';
import { getBalance, getTokenPrice } from '~/lib/web3';

export default function WalletCard() {
  const { user } = useTurnkey();
  const [selectedAccount, setSelectedAccount] = useState<{
    address: `0x${string}`;
    balance: bigint;
    balanceUsd: number;
  } | null>(null);

  const handleFundWallet = async () => {};

  const handleCopyAddress = () => {
    // Clipboard.default.setString(selectedAccount?.address || '');
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const balance = await getBalance(user.wallets[0].accounts[0]);
        const price = await getTokenPrice('ethereum');
        setSelectedAccount({
          address: user.wallets[0].accounts[0],
          balance: balance,
          balanceUsd: Number(formatEther(balance)) * price,
        });
      }
    })();
  }, [user]);

  return (
    <Card className="w-full space-y-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="font-medium">Default Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 gap-2">
        {selectedAccount ? (
          <TouchableOpacity
            className="flex flex-row items-center gap-2 w-full"
            onPress={handleCopyAddress}
          >
            <Text>
              {truncateAddress(selectedAccount.address, {
                prefix: 12,
                suffix: 6,
              })}
            </Text>
            <Icons.copy className="stroke-muted-foreground" size={16} />
          </TouchableOpacity>
        ) : (
          <Skeleton className="h-12 w-12" />
        )}
        <H3 className="text-4xl font-bold">
          ${selectedAccount?.balanceUsd.toFixed(2)}{' '}
          <Muted className="ml-1">USD</Muted>
        </H3>
        <Muted>
          {selectedAccount?.balance
            ? parseFloat(
                Number(formatEther(selectedAccount?.balance)).toFixed(6)
              ).toString()
            : '0'}{' '}
          ETH
        </Muted>
      </CardContent>
    </Card>
  );
}
