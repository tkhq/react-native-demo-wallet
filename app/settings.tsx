
import { Keyboard, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useState } from "react";
import { parsePhoneNumber } from "~/lib/utils";
import { EmailInput } from "~/components/auth/auth.email";
import { LoaderButton } from "~/components/ui/button";
import { PhoneInput } from "~/components/auth/auth.phone";
import { useTurnkey } from '@turnkey/sdk-react-native';

const Settings = () => {
  const { user, updateUser } = useTurnkey();

  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>(user?.phoneNumber || "");

  const [isValidEmail, setIsValidEmail] = useState<boolean>(
    user?.email ? true : false
  );
  const [isValidPhone, setIsValidPhone] = useState<boolean>(
    user?.phoneNumber ? true : false
  );

  const { country, nationalNumber } = parsePhoneNumber(phone);

  const handleUpdateUser = async () => {
    try {
      await updateUser({ email, phone });
      Keyboard.dismiss();
    }
    catch (err){
      alert("Failed to update user.");
      console.error(err);
    }
   
  };

  const isDisabled =
    !isValidEmail ||
    !isValidPhone ||
    (email === user?.email && phone === user?.phoneNumber);

  return (
    <View className="flex-1 p-5 gap-4">
      <Text className="font-medium">Email</Text>
      <EmailInput
        initialValue={user?.email}
        onEmailChange={setEmail}
        onValidationChange={setIsValidEmail}
      />
      <Text className="font-medium">Phone</Text>
      <PhoneInput
        initialCountry={country}
        initialPhoneNumber={nationalNumber}
        onChangeText={setPhone}
        onValidationChange={setIsValidPhone}
      />
      <LoaderButton onPress={handleUpdateUser} disabled={isDisabled}>
        <Text className="text-white">Update</Text>
      </LoaderButton>
    </View>
  );
};

export default Settings;
