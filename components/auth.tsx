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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "~/lib/utils";
import { BaseButton } from "react-native-gesture-handler";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function Auth() {
  const insets = useSafeAreaInsets();
  const { state, initEmailLogin, signUpWithPasskey, loginWithPasskey } = useTurnkey();

  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
  };

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top }}
      className="justify-center items-center gap-5 p-6 bg-secondary/30"
    >
      <Card className="w-full max-w-sm ">
        <CardHeader className="items-center">
          <View className="p-3" />
          <CardTitle className="pb-2 text-center">Log in or sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="gap-6">
            <EmailInput onEmailChange={handleEmailChange} />
            <LoaderButton
              variant="outline"
              disabled={!!state.loading || !isValidEmail(email)}
              loading={state.loading === LoginMethod.OtpAuth}
              onPress={() => initEmailLogin(email as Email)}
              className={cn("rounded-xl", {
                "border-black": isValidEmail(email),
              })}
            >
              <Text>Continue</Text>
            </LoaderButton>
            <OrSeparator />
            <PhoneNumberInput onPhoneChange={handlePhoneChange} />
            <LoaderButton
              variant="outline"
              disabled={!!state.loading || phone.length < 12}
              loading={state.loading === LoginMethod.OtpAuth}
              onPress={() => initEmailLogin(email as Email)}
              className={cn("rounded-xl", { "border-black": phone.length === 12 })}
            >
              <Text>Continue</Text>
            </LoaderButton>
            <OrSeparator />
            {isSupported() ? (
              <View className="flex flex-col gap-4">
                <LoaderButton
                  variant="outline"
                  disabled={!!state.loading}
                  loading={state.loading === LoginMethod.Passkey}
                  onPress={() => loginWithPasskey()}
                  className="border-black rounded-xl"
                >
                  <Text>Log in with passkey</Text>
                </LoaderButton>
                <BaseButton onPress={() => signUpWithPasskey()}>
                  <View className="flex flex-col justify-center items-center">
                    <Text className="text-base font-semibold text-blue-700">
                      Sign up with passkey
                    </Text>
                  </View>
                </BaseButton>
              </View>
            ) : null}
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

export default Auth;
