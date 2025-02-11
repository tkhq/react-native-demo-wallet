import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { WalletCard } from "~/components/wallet-card";
import { useTurnkey } from "~/hooks/use-turnkey";
import { Icons } from "~/components/icons";

const Dashboard = () => {
  const { user, exportWallet } = useTurnkey();

  const handleAddWallet = () => {
    console.log("Add Wallet button clicked");
    // TODO: Implement the wallet creation logic here
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 p-5">
        {user?.wallets.map((wallet) => (
          <WalletCard key={wallet.id} wallet={wallet} exportWallet={exportWallet} />
        ))}
      </ScrollView>

      <View className="absolute bottom-12 left-0 right-0 flex-row justify-center">
        <TouchableOpacity
          onPress={handleAddWallet}
          className="flex flex-col justify-center items-center bg-blue-800 px-4 py-1 rounded-lg shadow-lg"
        >
          <Text className="text-white text-3xl font-black ">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;
