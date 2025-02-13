import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, Modal, View } from "react-native";
import { formatEther } from "viem";
import { Skeleton } from "./ui/skeleton";
import { truncateAddress } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Icons } from "./icons";
import { H3, Muted } from "./ui/typography";
import { getBalance, getTokenPrice } from "~/lib/web3";
import { ExportWalletButton } from "./export";
import { Button } from "./ui/button";
import { BaseButton } from "react-native-gesture-handler";

interface WalletCardProps {
  wallet: {
    id: string;
    accounts: `0x${string}`[];
    name?: string;
  };
  exportWallet: (params: { walletId: string }) => Promise<string>;
}

export const WalletCard = (props: WalletCardProps) => {
  const { wallet, exportWallet } = props;
  const [selectedAccount, setSelectedAccount] = useState<{
    address: `0x${string}`;
    balance: bigint;
    balanceUsd: number;
  } | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      if (wallet.accounts.length > 0) {
        const balance = await getBalance(wallet.accounts[0]);
        const price = await getTokenPrice("ethereum");
        setSelectedAccount({
          address: wallet.accounts[0],
          balance,
          balanceUsd: Number(formatEther(balance)) * price,
        });
      }
    })();
  }, [wallet]);

  const handleExportWallet = async () => {
    const seed = await exportWallet({ walletId: wallet.id });
    setSeedPhrase(seed);
    setModalVisible(true);
  };

  const handleCopyWalletAddress = async () => {
    await navigator.clipboard.writeText(selectedAccount?.address || "");
  };

  const handleCopySeedPhrase = async () => {
    await navigator.clipboard.writeText(seedPhrase || "");
  };

  return (
    <>
      <Card className="w-full space-y-0 mb-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="font-medium">
            {wallet.name || "Unnamed Wallet"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 gap-2">
          {selectedAccount ? (
            <TouchableOpacity
              className="flex flex-row items-center gap-2 w-full"
              onPress={handleCopyWalletAddress}
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
            ${selectedAccount?.balanceUsd.toFixed(2)}{" "}
            <Muted className="ml-1">USD</Muted>
          </H3>
          <Muted>
            {selectedAccount?.balance
              ? parseFloat(
                  Number(formatEther(selectedAccount?.balance)).toFixed(6)
                ).toString()
              : "0"}{" "}
            ETH
          </Muted>
          <ExportWalletButton onExportWallet={handleExportWallet} />
        </CardContent>
      </Card>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl shadow-lg w-4/5">
            <Text className="text-lg font-bold mb-3 text-center">
              Seed Phrase
            </Text>
            <BaseButton onPress={handleCopySeedPhrase}>
            <View className="p-4 bg-gray-200 rounded-lg">
              <Text className="text-center">{seedPhrase}</Text>
              <View className="bg-transparent pt-2 rounded-lg flex flex-col items-end justify-right">
                <Icons.copy className="stroke-muted-foreground" size={16} />
              </View>
            </View>
            </BaseButton>
            <Button
              onPress={() => setModalVisible(false)}
              className="mt-8 p-3 rounded-lg bg-blue-600"
            >
              <Text className="text-white text-center font-bold">Done</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};
