import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface ExportWalletButtonProps {
  onExportWallet: () => Promise<void>;
}

export const ExportWalletButton: React.FC<ExportWalletButtonProps> = (
  props
) => {
  const { onExportWallet } = props;

  return (
    <Button
      onPress={onExportWallet}
      className="border border-black rounded-xl bg-transparent flex-row items-center justify-center w-1/3"
    >
      <Text className="text-base font-bold text-black">Export Wallet</Text>
    </Button>
  );
};