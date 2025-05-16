import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, Modal, View } from "react-native";
import { formatEther, keccak256, toBytes } from "viem";
import { Skeleton } from "./ui/skeleton";
import { truncateAddress } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Icons } from "./ui/icon";
import { getBalance, getTokenPrice } from "~/lib/web3";
import { ExportWalletButton } from "./export";
import { Button } from "./ui/button";
import { BaseButton } from "react-native-gesture-handler";
import { TurnkeyClient, useTurnkey, Wallet } from "@turnkey/sdk-react-native";
import { SignWithWalletButton } from "./sign";
import { createAccount } from "@turnkey/viem";
import { createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";

interface WalletCardProps {
  wallet: Wallet;
  exportWallet: (params: { walletId: string }) => Promise<string>;
}

export const WalletCard = (props: WalletCardProps) => {
  const { wallet, exportWallet } = props;
  const { user, client } = useTurnkey();
  const [selectedAccount, setSelectedAccount] = useState<{
    address: `0x${string}`;
    balance: bigint;
    balanceUsd: number;
  } | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"export" | "sign" | null>(null);

  const unsignedMessage = "I love Turnkey!";

  useEffect(() => {
    (async () => {
      if (wallet.accounts.length > 0) {
        const balance = await getBalance(
          wallet.accounts[0].address as `0x${string}`
        );
        const price = await getTokenPrice("ethereum");
        setSelectedAccount({
          address: wallet.accounts[0].address as `0x${string}`,
          balance,
          balanceUsd: parseFloat(formatEther(balance)) * price,
        });
      }
    })();
  }, [wallet]);

  const handleExportWallet = async () => {
    try {
      const seed = await exportWallet({ walletId: wallet.id });
      setSeedPhrase(seed);
      setModalType("export");
    } catch (error) {
      alert("Failed to export wallet.");
      console.error("Failed to export wallet:", error);
    }
  };

  const handleSignWithWallet = async () => {
    setSignedMessage(null);
    setModalType("sign");
  };

  const confirmSignMessage = async () => {
    try {
      const viemAccount = await createAccount({
        client: client as TurnkeyClient,
        organizationId: user?.organizationId!,
        signWith: selectedAccount?.address as string,
        ethereumAddress: selectedAccount?.address as string,
      });

      const viemClient = createWalletClient({
        account: viemAccount,
        chain: sepolia,
        transport: http(),
      });

      const signedMessage = await viemClient.signMessage({
        message: unsignedMessage,
      });

      setSignedMessage(signedMessage);
    } catch (error) {
      alert("Error signing message.");
      console.error("Error signing message:", error);
    }
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
            <TouchableOpacity className="flex flex-row items-center gap-2 w-full">
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
          <View className="web:scroll-m-20 text-2xl text-foreground font-semibold tracking-tight web:select-text">
            <Text className="text-4xl font-bold">
              ${selectedAccount?.balanceUsd.toFixed(2)}{" "}
              <Text className="text-sm text-muted-foreground ml-1">USD</Text>
            </Text>
          </View>
          <Text className="text-sm text-muted-foreground">
            {selectedAccount?.balance
              ? parseFloat(
                  Number(formatEther(selectedAccount?.balance)).toFixed(6)
                ).toString()
              : "0"}{" "}
            ETH
          </Text>
          <View className="flex flex-row items-center gap-4">
            <ExportWalletButton onExportWallet={handleExportWallet} />
            <SignWithWalletButton onSignWithWallet={handleSignWithWallet} />
          </View>
        </CardContent>
      </Card>
      {/* Modals */}
      <ExportSeedPhraseModal
        visible={modalType === "export"}
        onClose={() => setModalType(null)}
        seedPhrase={seedPhrase}
      />
      <SignMessageModal
        visible={modalType === "sign"}
        unSignedMessage={unsignedMessage}
        signedMessage={signedMessage}
        onClose={() => setModalType(null)}
        onSign={confirmSignMessage}
      />
    </>
  );
};

interface ExportSeedPhraseModalProps {
  visible: boolean;
  seedPhrase: string | null;
  onClose: () => void;
}

const ExportSeedPhraseModal = ({
  visible,
  onClose,
  seedPhrase,
}: ExportSeedPhraseModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl shadow-lg w-4/5">
          <Text className="text-lg font-bold mb-3 text-center">
            Seed Phrase
          </Text>
          <BaseButton>
            <View className="p-4 bg-gray-200 rounded-lg">
              <Text className="text-center">{seedPhrase}</Text>
              <View className="bg-transparent pt-2 rounded-lg flex flex-col items-end justify-right">
                <Icons.copy className="stroke-muted-foreground" size={16} />
              </View>
            </View>
          </BaseButton>
          <Button onPress={onClose} className="mt-8 p-3 rounded-lg bg-blue-600">
            <Text className="text-white text-center font-bold">Done</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

interface SignMessageModalProps {
  visible: boolean;
  unSignedMessage: string;
  signedMessage: string | null;
  onClose: () => void;
  onSign: () => void;
}

const SignMessageModal = ({
  visible,
  unSignedMessage,
  signedMessage,
  onClose,
  onSign,
}: SignMessageModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl shadow-lg w-4/5">
          <Text className="text-lg font-bold mb-3 text-center">
            Sign Message
          </Text>
          <View className="p-4 bg-gray-200 rounded-lg">
            <Text className="text-center">{unSignedMessage}</Text>
          </View>

          {signedMessage ? (
            <View>
              <View className="mt-4 p-4 bg-gray-100 rounded-lg gap-4">
                <Text className="font-semibold">Signed Result:</Text>
                <Text className="text-black text-base font-normal">
                  {signedMessage}
                </Text>
              </View>
              <Button
                onPress={onClose}
                className="mt-8 p-3 rounded-lg bg-blue-600"
              >
                <Text className="text-white text-center font-bold">Done</Text>
              </Button>
            </View>
          ) : (
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={onClose}
                className="p-3 bg-gray-300 rounded-lg flex-1 mr-2"
              >
                <Text className="text-center font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSign}
                className="p-3 bg-blue-600 rounded-lg flex-1"
              >
                <Text className="text-white text-center font-bold">Sign</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
