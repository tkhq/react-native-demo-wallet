import { DEFAULT_ETHEREUM_ACCOUNTS } from "~/lib/constants";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTurnkey } from "@turnkey/sdk-react-native";

const ImportWalletScreen = ({ navigation }: { navigation: any }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { importWallet } = useTurnkey();

  const [walletName, setWalletName] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");

  const handleImportWallet = async () => {
    if (!walletName.trim() || !seedPhrase.trim()) {
      Alert.alert("Error", "Please enter both wallet name and seed phrase.");
      return;
    }

    try {
      await importWallet({
        walletName,
        mnemonic: seedPhrase,
        accounts: DEFAULT_ETHEREUM_ACCOUNTS,
      });
      router.back();
    } catch (error) {
      alert("Failed to import wallet.");
      console.error(error);
    }
  };

  return (
    <View
      className="flex-1 justify-between gap-12 p-6 bg-secondary/30"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 12 }}
    >
      <View className="flex flex-col justify-start gap-12">
        <View className="flex flex-col justify-center gap-4">
          <Text className="text-black text-xl font-bold">Wallet Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="Enter wallet name"
            value={walletName}
            onChangeText={setWalletName}
          />
        </View>
        <View className="flex flex-col justify-center gap-4">
          <Text className="text-black text-xl font-bold">Seed Phrase</Text>
          <TextInput
            className="border border-gray-300 rounded-lg h-40 p-3 text-base"
            placeholder="Enter seed phrase"
            value={seedPhrase}
            onChangeText={setSeedPhrase}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleImportWallet}
        className="bg-blue-600 rounded-lg p-3 mt-4"
      >
        <Text className="text-white text-center font-medium">
          Import Wallet
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImportWalletScreen;