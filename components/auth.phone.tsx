import React from 'react';
import { Input } from './ui/input';

const PhoneNumberInput = ({
  onPhoneChange,
}: {
  onPhoneChange: (phone: string) => void;
}) => {
  return (
    <Input
      id="phone-number"
      placeholder="Enter your phone number"
      onChangeText={onPhoneChange}
      keyboardType="phone-pad"
      autoCapitalize="none"
      autoComplete="tel"
      autoCorrect={false}
    />
  );
};

export default PhoneNumberInput;
