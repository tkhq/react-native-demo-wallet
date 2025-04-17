import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
} from "react-native";
import { WalletCard } from "~/components/wallet-card";
import { useRouter } from "expo-router";
import { DEFAULT_ETHEREUM_ACCOUNTS } from "~/lib/constants";
import { useTurnkey } from "@turnkey/sdk-react-native";

const Dashboard = () => {
  const { user, createWallet, exportWallet } = useTurnkey();
  const router = useRouter();
  
  const [showMenu, setShowMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [walletName, setWalletName] = useState("");

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleCreateWallet = () => {
    setShowMenu(false);
    setModalVisible(true);
  };

  const handleConfirmCreateWallet = async () => {
    if (!walletName.trim()) {
      alert("Please enter a wallet name.");
      return;
    }

    try {
      await createWallet({ walletName, accounts: DEFAULT_ETHEREUM_ACCOUNTS });
      setModalVisible(false);
      setWalletName("");
    } catch (error) {
      alert("Failed to create wallet.");
      console.error(error);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 p-5" keyboardShouldPersistTaps="handled">
        {user?.wallets.map((wallet) => (
          <WalletCard key={wallet.id} wallet={wallet} exportWallet={exportWallet} />
        ))}
      </ScrollView>
      <View className="absolute bottom-12 left-0 right-0 flex items-center">
        {showMenu && (
          <View className="mb-3 bg-white shadow-lg rounded-lg w-52 p-2">
            <TouchableOpacity
              onPress={handleCreateWallet}
              className="p-2 border-b border-gray-200"
            >
              <Text className="text-black text-base font-medium">Create New Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowMenu(false); router.push("/import-wallet"); }} className="p-2">
              <Text className="text-black text-base font-medium">Import Existing Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          onPress={toggleMenu}
          className="bg-blue-600 px-5 py-2 rounded-full shadow-lg"
        >
          <Text className="text-white text-3xl font-black">+</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl shadow-lg w-4/5">
            <Text className="text-lg font-bold mb-3 text-center">
              Enter Wallet Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base mb-4"
              placeholder="Wallet Name"
              value={walletName}
              onChangeText={setWalletName}
            />
            <View className="flex flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-3 bg-gray-300 rounded-lg flex-1 mr-2"
              >
                <Text className="text-center font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmCreateWallet}
                className="p-3 bg-blue-600 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center font-bold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;