import { useState } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { OtpInput } from 'react-native-otp-entry';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { useTurnkey } from '~/hooks/use-turnkey';
import { Turnkey } from '~/lib/icons/Turnkey';
import { router } from 'expo-router';

const OTPAuth = () => {
  const [otpCode, setOtpCode] = useState('');
  const { completeLogin, error, clearError } = useTurnkey();

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm ">
        <CardHeader className="items-center">
          <Turnkey className="" />
          <View className="p-3" />
          <CardTitle className="text-xl pb-2 text-center ">
            Enter OTP Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OtpInput
            secureTextEntry
            theme={{
              pinCodeContainerStyle: {
                ...(error ? { borderColor: '#ed143dcc' } : {}),
              },
            }}
            numberOfDigits={6}
            onTextChange={setOtpCode}
          />
          {error && <Text className="text-red-500">{error}</Text>}
        </CardContent>
        <CardFooter className="flex-row justify-between">
          <Button
            variant="secondary"
            onPress={() => {
              clearError();
              router.replace('/');
            }}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            disabled={otpCode.length !== 6}
            onPress={() => completeLogin('OTP_AUTH', { otpCode })}
          >
            <Text>Continue</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
};

export default OTPAuth;
