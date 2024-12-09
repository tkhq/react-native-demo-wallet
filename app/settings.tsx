import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import EmailInput from '~/components/auth.email';
import PhoneNumberInput from '~/components/auth.phone';
import { ArrowLeft } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useTurnkey } from '~/hooks/use-turnkey';
import { useEffect, useState } from 'react';
import { Icons } from '~/components/icons';

const Settings = () => {
  const { updateUser, user } = useTurnkey();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleUpdateUser = async () => {
    await updateUser({ email, phone });
  };

  useEffect(() => {
    setEmail(user?.email ?? '');
    setPhone(user?.phoneNumber ?? '');
    console.log('user', user);
  }, [user]);

  return (
    <View className="flex-1 p-5 gap-4">
      <Text className="font-medium">Email</Text>
      <EmailInput initialValue={user?.email} onEmailChange={setEmail} />
      <Text className="font-medium">Phone</Text>
      <PhoneNumberInput
        initialValue={user?.phoneNumber}
        onPhoneChange={setPhone}
      />
      <Button onPress={handleUpdateUser}>
        <Text>Update</Text>
      </Button>
    </View>
  );
};

export default Settings;
