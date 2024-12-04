import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
} from 'react-native';

export const OTPInput = ({
  length = 6,
  onCodeFilled,
}: {
  length?: number;
  onCodeFilled: (code: string) => void;
}) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d$/.test(text) && text !== '') return; // Allow only single numeric input

    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (updatedOtp.join('').length === length) {
      onCodeFilled && onCodeFilled(updatedOtp.join(''));
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (event.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View className="flex flex-row justify-center items-center space-x-2">
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="number-pad"
          maxLength={1}
          className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg"
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};
