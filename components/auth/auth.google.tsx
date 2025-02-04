import { View, Image } from "react-native";
import { Button } from "../ui/button";
import { Text } from "~/components/ui/text";
import GoogleIcon from "../../assets/google.svg";

export const GoogleAuthButton: React.FC = () => {
  return (
    <Button
      onPress={() => console.log("GoogleAuthButton")}
      className="border border-black rounded-xl p-3 bg-transparent flex-row items-center justify-center"
    >
      <View className="flex flex-row items-center justify-center">
        <GoogleIcon width={20} height={20} />
        <Text className="text-base font-semibold text-black ml-2">
          Continue with Google
        </Text>
      </View>
    </Button>
  );
};
