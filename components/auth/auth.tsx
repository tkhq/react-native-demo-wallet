import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuthRelay } from "~/hooks/use-auth-relayer";
import { isSupported } from "@turnkey/sdk-react-native";
import { LoginMethod, OtpType } from "~/lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "~/lib/utils";
import { BaseButton } from "react-native-gesture-handler";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EmailInput } from "./auth.email";
import { OAuth } from "./oauth";
import { PhoneInput } from "./auth.phone";
import { LoaderButton } from "../ui/button";
import { Separator } from "../ui/separator";

export const Auth = () => {
  const insets = useSafeAreaInsets();
  const {
    state,
    initOtpLogin,
    signUpWithPasskey,
    loginWithPasskey,
    loginWithOAuth,
  } = useAuthRelay();

  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [isValidEmail, setIsValidEmail] = React.useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = React.useState<boolean>(false);

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
            <EmailInput
              onEmailChange={handleEmailChange}
              onValidationChange={setIsValidEmail}
            />
            <LoaderButton
              variant="outline"
              disabled={!!state.loading || !isValidEmail}
              loading={state.loading === LoginMethod.Email}
              onPress={() =>
                initOtpLogin({ otpType: OtpType.Email, contact: email })
              }
              className={cn("rounded-xl", {
                "border-black": isValidEmail,
              })}
            >
              <Text>Continue</Text>
            </LoaderButton>
            <OrSeparator />
            <PhoneInput
              onChangeText={handlePhoneChange}
              onValidationChange={setIsValidPhone}
            />
            <LoaderButton
              variant="outline"
              disabled={!!state.loading || !isValidPhone}
              loading={state.loading === LoginMethod.Phone}
              onPress={() =>
                initOtpLogin({ otpType: OtpType.Sms, contact: phone })
              }
              className={cn("rounded-xl", {
                "border-black": isValidPhone,
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

const OrSeparator = () => {
  return (
    <View className="relative">
      <View className="absolute inset-0 flex flex-row items-center">
        <Separator className="flex-1" />
      </View>
      <View className="relative flex justify-center items-center">
        <Text className="bg-white px-2 text-xs uppercase text-gray-500">
          Or
        </Text>
      </View>
    </View>
  );
};
