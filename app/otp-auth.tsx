import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { useAuthRelay } from '~/hooks/use-auth-relayer';
import { Turnkey } from '~/lib/icons/Turnkey';
import { router } from 'expo-router';
import { LoginMethod } from '~/lib/types';
import { toast } from 'sonner-native';
import { useSearchParams } from 'expo-router/build/hooks';

const OTPAuth = () => {
  const [otpCode, setOtpCode] = useState('');
  const { state, completeEmailAuth, clearError } = useAuthRelay();
  const otpInputRef = useRef<OtpInputRef>(null);

  const searchParams = useSearchParams();
  const otpId = searchParams.get('otpId') ?? '';
  const organizationId = searchParams.get('organizationId') ?? '';

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearError();
      setOtpCode('');
      otpInputRef.current?.clear();
    }
  }, [state.error]);

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
            ref={otpInputRef}
            secureTextEntry
            theme={{
              focusedPinCodeContainerStyle: {
                borderColor: 'hsl(241.31 100% 64.12%)',
              },
              focusStickStyle: {
                backgroundColor: '#404040',
              },
            }}
            numberOfDigits={6}
            onTextChange={setOtpCode}
          />
        </CardContent>
        <CardFooter className="flex-row justify-between gap-4">
          <Button
            className="flex-1"
            variant="secondary"
            onPress={() => {
              clearError();
              router.back();
            }}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            className="flex-1"
            disabled={otpCode.length !== 6}
            onPress={() => completeEmailAuth({ otpId, otpCode, organizationId })}
          >
            <Text>Continue</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
};

export default OTPAuth;
