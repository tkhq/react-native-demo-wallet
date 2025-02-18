import * as React from "react";
import { Input } from "~/components/ui/input";

interface EmailInputProps {
  initialValue?: string;
  onEmailChange: (email: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const EmailInput = ({
  initialValue,
  onEmailChange,
  onValidationChange,
}: EmailInputProps) => {
  const [email, setEmail] = React.useState(initialValue ?? "");

  const handleEmailChange = (text: string) => {
    setEmail(text);
    onEmailChange(text);

    const isValid = isValidEmail(text);
    onValidationChange?.(isValid);
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
};

const isValidEmail = (email: string | undefined) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
