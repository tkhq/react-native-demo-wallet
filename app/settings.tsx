import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import EmailInput from '~/components/auth.email';
import PhoneNumberInput from '~/components/auth.phone';
import { ArrowLeft } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useTurnkey } from '~/hooks/use-turnkey';
import { useState } from 'react';

const Settings = () => {
  const { updateUser } = useTurnkey();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleUpdateUser = async () => {
    await updateUser({ email, phone });
  };

  return (
    <View className="flex-1 p-5 gap-4">
      <Link href="/dashboard">
        <ArrowLeft className="fill-black" size={24} />
      </Link>
      <Text className="text-2xl font-bold">Settings</Text>
      <Text className="font-medium">Email</Text>
      <EmailInput onEmailChange={setEmail} />
      <Text className="font-medium">Phone</Text>
      <PhoneNumberInput onPhoneChange={setPhone} />
      <Button onPress={handleUpdateUser}>
        <Text>Update</Text>
      </Button>
    </View>
  );
};

export default Settings;
