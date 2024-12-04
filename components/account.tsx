import * as React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Text } from '~/components/ui/text';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useTurnkey } from '~/hooks/use-turnkey';
import { truncateAddress } from '~/lib/utils';
import { Link, useRouter } from 'expo-router';

export function Account() {
  const { user } = useTurnkey();
  const address = user?.wallets[0].accounts[0];
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 bg-none w-12 rounded-full web:hover:bg-none active:bg-none space-x-0"
        >
          <Avatar alt="Account Avatar">
            <AvatarFallback>
              <Text></Text>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        alignOffset={-5}
        align="end"
        side="bottom"
        sideOffset={12}
        className="w-64 native:w-72"
      >
        <DropdownMenuItem onPress={() => router.push('/settings')}>
          <Text>Settings</Text>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Text>Log out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
