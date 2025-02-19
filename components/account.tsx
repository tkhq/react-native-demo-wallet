import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { Avatar } from "./ui/avatar";
import { useRouter } from "expo-router";
import { Drawer } from "react-native-drawer-layout";
import { useTurnkey } from "@turnkey/sdk-react-native";

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
        className="w-64 native:w-72"
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

function AccountDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return <Text>Drawer content</Text>;
      }}
    >
      <Button onPress={() => setOpen((prevOpen) => !prevOpen)}>
        <Text>Open drawer</Text>
      </Button>
    </Drawer>
  );
}
