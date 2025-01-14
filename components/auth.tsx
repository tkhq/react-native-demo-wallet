import * as React from "react";
import EmailInput from "./auth.email";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "./ui/button";
import OrSeparator from "./or-separator";
import { useTurnkey } from "~/hooks/use-turnkey";
import { isSupported } from "@turnkey/react-native-passkey-stamper";
import PhoneNumberInput from "./auth.phone";
import { Email, LoginMethod } from "~/lib/types";

import { LoaderButton } from "./ui/loader-button";

function Auth() {
  const { state, initEmailLogin, loginWithPasskey } = useTurnkey();

  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
  };

  return (
    <View className="gap-6">
      <EmailInput onEmailChange={handleEmailChange} />
      <LoaderButton
        variant="outline"
        disabled={!!state.loading}
        loading={state.loading === LoginMethod.OtpAuth}
        onPress={() => initEmailLogin(email as Email)}
      >
        <Text>Continue with email</Text>
      </LoaderButton>
      {isSupported() ? (
        <LoaderButton
          disabled={!!state.loading}
          loading={state.loading === LoginMethod.Passkey}
          onPress={() => loginWithPasskey()}
        >
          <Text>Continue with passkey</Text>
        </LoaderButton>
      ) : null}
      <OrSeparator />
    </View>
  );
}

export default Auth;
