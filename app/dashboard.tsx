import { View } from 'react-native';
import WalletCard from '~/components/wallet-card';

const Dashboard = () => {
  return (
    <View className="flex-1 p-5">
      <WalletCard />
    </View>
  );
};

export default Dashboard;
