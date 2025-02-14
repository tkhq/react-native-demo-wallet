import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useTurnkey } from "~/hooks/use-turnkey";
import { isSupported } from "@turnkey/react-native-passkey-stamper";
import { Email, LoginMethod } from "~/lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn, isValidEmail, isValidPhone } from "~/lib/utils";
import { BaseButton } from "react-native-gesture-handler";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EmailInput } from "./auth.email";
import { LoaderButton } from "../ui/loader-button";
import OrSeparator from "../or-separator";
import { PhoneNumberInput } from "./auth.phone";
import { OAuth } from "./oauth";

export const Auth = () => {
  const insets = useSafeAreaInsets();
  const {
    state,
    initEmailLogin,
    initPhoneLogin,
    signUpWithPasskey,
    loginWithPasskey,
    loginWithOAuth,
  } = useTurnkey();

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
            <OAuth onSuccess={loginWithOAuth} />
            <OrSeparator />
            <EmailInput onEmailChange={handleEmailChange} />
            <LoaderButton
              variant="outline"
              disabled={!!state.loading || !isValidEmail(email)}
              loading={state.loading === LoginMethod.Email}
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
              disabled={!!state.loading || !isValidPhone(phone)}
              loading={state.loading === LoginMethod.Phone}
              onPress={() => initPhoneLogin(phone)}
              className={cn("rounded-xl", {
                "border-black": isValidPhone(phone),
              })}
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
};
