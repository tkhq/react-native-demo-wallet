import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface SignWithWalletButtonProps {
  onSignWithWallet: () => Promise<void>;
}

export const SignWithWalletButton: React.FC<SignWithWalletButtonProps> = (
  props
) => {
  const { onSignWithWallet } = props;

  return (
    <Button
      onPress={onSignWithWallet}
      className="border border-black rounded-xl bg-transparent flex-row items-center justify-center w-1/3"
    >
      <Text className="text-base font-bold text-black">Sign</Text>
    </Button>
  );
};