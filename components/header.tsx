import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '~/lib/utils';
import { Account } from './account';
import { Text } from './ui/text';

export function Header({ className }: { className?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top }}
      className={cn(
        'flex flex-row justify-between items-center w-full pt-8 pb-6 px-6 bg-black',
        className
      )}
    >
      <Text className="text-2xl text-white font-bold">Demo Wallet</Text>
      <Account />
    </View>
  );
}
