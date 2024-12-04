import * as React from 'react';
import EmailInput from './auth.email';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from './ui/button';
import OrSeparator from './or-separator';
import { useTurnkey } from '~/hooks/use-turnkey';
import { isSupported } from '@turnkey/react-native-passkey-stamper';
import PhoneNumberInput from './auth.phone';
import { LoginMethod } from '~/lib/types';

import { LoaderButton } from './ui/loader-button';

function Auth() {
  const [email, setEmail] = React.useState('');
  const { login, loading } = useTurnkey();

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
      <LoaderButton
        variant="outline"
        disabled={!!loading}
        loading={loading === LoginMethod.OtpAuth}
        onPress={() =>
          login(LoginMethod.OtpAuth, {
            otpType: 'OTP_TYPE_EMAIL',
            contact: email,
          })
        }
      >
        <Text>Continue with email</Text>
      </LoaderButton>
      {isSupported() ? (
        <LoaderButton
          disabled={!!loading}
          loading={loading === LoginMethod.Passkey}
          onPress={() => login(LoginMethod.Passkey, { email })}
        >
          <Text>Continue with passkey</Text>
        </LoaderButton>
      ) : null}
      <OrSeparator />

      <PhoneNumberInput onPhoneChange={handlePhoneChange} />
      <LoaderButton
        variant="outline"
        disabled={!!loading}
        loading={loading === LoginMethod.OtpAuth}
        onPress={() =>
          login(LoginMethod.OtpAuth, {
            otpType: 'OTP_TYPE_SMS',
            contact: phone,
          })
        }
      >
        <Text className="">Continue with phone</Text>
      </LoaderButton>
    </View>
  );
}

export default Auth;
