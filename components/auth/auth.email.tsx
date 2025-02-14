import * as React from 'react';
import { Input } from '~/components/ui/input';

interface EmailInputProps {
  onEmailChange: (email: string) => void;
  initialValue?: string;
}

export const EmailInput =({ onEmailChange, initialValue }: EmailInputProps) => {
  const [email, setEmail] = React.useState(initialValue ?? '');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    onEmailChange(text);
  };

  return (
    <Input
    autoCapitalize="none"
      autoComplete="email"
      autoCorrect={false}
      keyboardType="email-address"
      placeholder="Enter your email"
      value={email}
      onChangeText={handleEmailChange}
      aria-labelledby="emailLabel"
      aria-errormessage="emailError"
    />
  );
}