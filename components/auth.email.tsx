import * as React from 'react';
import { Input } from '~/components/ui/input';

interface EmailInputProps {
  onEmailChange: (email: string) => void;
  initialValue?: string;
}

function EmailInput({ onEmailChange, initialValue }: EmailInputProps) {
  const [email, setEmail] = React.useState(initialValue ?? '');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    onEmailChange(text); // Call the callback function with the new email value
  };

  return (
    <Input
      className="placeholder:text-sm placeholder:text-muted-foreground"
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

export default EmailInput;
