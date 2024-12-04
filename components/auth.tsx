import * as React from 'react';
import EmailInput from './auth.email';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from './ui/button';
import OrSeparator from './or-separator';
import { useTurnkey } from '~/hooks/use-turnkey';
import { isSupported } from '@turnkey/react-native-passkey-stamper';
import PhoneNumberInput from './auth.phone';

function Auth() {
  const [email, setEmail] = React.useState('');
  const { login } = useTurnkey();

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const [phone, setPhone] = React.useState('');

  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
  };

  return (
    <View className="gap-6">
      <EmailInput onEmailChange={handleEmailChange} />
      <Button
        variant="outline"
        onPress={() =>
          login('OTP_AUTH', { otpType: 'OTP_TYPE_EMAIL', contact: email })
        }
      >
        <Text>Continue with email</Text>
      </Button>
      {isSupported() ? (
        <Button onPress={() => login('PASSKEY', { email })}>
          <Text>Continue with passkey</Text>
        </Button>
      ) : null}
      <OrSeparator />

      <PhoneNumberInput onPhoneChange={handlePhoneChange} />
      <Button
        variant="outline"
        onPress={() =>
          login('OTP_AUTH', { otpType: 'OTP_TYPE_SMS', contact: phone })
        }
      >
        <Text>Continue with phone</Text>
      </Button>
    </View>
  );
}

export default Auth;
