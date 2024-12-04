import { View } from 'react-native';
import { Icons } from '~/components/icons';
import { cn } from '~/lib/utils';
import { Account } from './account';

export function Header({ className }: { className?: string }) {
  return (
    <View
      className={cn(
        'flex flex-row justify-between items-center w-full pt-8 pb-6 px-6 bg-black',
        className
      )}
    >
      <Icons.turnkey className="fill-white stroke-none" />
      <Account />
    </View>
  );
}
