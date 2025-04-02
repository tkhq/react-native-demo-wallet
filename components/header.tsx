import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '~/lib/utils';
import { Text } from './ui/text';
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import { useRouter } from "expo-router";
import { useTurnkey } from "@turnkey/sdk-react-native";

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

export function Account() {
  const { clearSession } = useTurnkey();
  const router = useRouter();

  const handleLogout = async () => {
    await clearSession();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 bg-none w-12 rounded-full web:hover:bg-none active:bg-none space-x-0"
        >
          <Avatar alt="Account Avatar" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        alignOffset={-5}
        align="end"
        side="bottom"
        sideOffset={12}
        className="w-64 native:w-72 bg-white"
      >
        <DropdownMenuItem onPress={() => router.push("/settings")}>
          <Text>Settings</Text>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={handleLogout}>
          <Text>Log out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
