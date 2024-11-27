import { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

const OTPAuth = () => {
  const [otpCode, setOtpCode] = useState('');

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-semibold mb-4">
        Please enter the 6-digit OTP code:
      </Text>
      <OtpInput numberOfDigits={6} onTextChange={setOtpCode} />
    </View>
  );
};

export default OTPAuth;
