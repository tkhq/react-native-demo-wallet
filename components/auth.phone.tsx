import React from 'react';
import { Input } from './ui/input';

const PhoneNumberInput = ({
  onPhoneChange,
  initialValue,
}: {
  onPhoneChange: (phone: string) => void;
  initialValue?: string;
}) => {
  const [phone, setPhone] = React.useState(initialValue ?? '');

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    onPhoneChange(text);
  };

  return (
    <Input
      className="placeholder:text-sm placeholder:text-muted-foreground"
      id="phone-number"
      placeholder="+12345678901"
      onChangeText={handlePhoneChange}
      keyboardType="phone-pad"
      autoCapitalize="none"
      autoComplete="tel"
      autoCorrect={false}
      aria-labelledby="phone-number-label"
      aria-errormessage="phone-number-error"
      value={phone}
    />
  );
};

export default PhoneNumberInput;
