import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import CountryPicker, {
  CountryModalProvider,
  Flag,
  Country,
  CountryCode,
  CountryCodeList,
} from "react-native-country-picker-modal";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { getCountryCallingCodeAsync } from "react-native-country-picker-modal/lib/CountryService";

const phoneUtil = PhoneNumberUtil.getInstance();

// List of unsupported country dial codes
const UNSUPPORTED_COUNTRY_CODES = new Set([
  "AF", // Afghanistan
  "IQ", // Iraq
  "SY", // Syria
  "SD", // Sudan
  "IR", // Iran
  "KP", // North Korea
  "CU", // Cuba
  "RW", // Rwanda
  "VA", // Vatican City
]);

const allowedCountryCodes = CountryCodeList.filter(
  (code) => !UNSUPPORTED_COUNTRY_CODES.has(code),
);

interface PhoneInputProps {
  initialCountry?: CountryCode;
  initialPhoneNumber?: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  initialCountry,
  initialPhoneNumber,
  disabled = false,
  onChangeText,
  onValidationChange,
}) => {
  const [code, setCode] = useState<string>("1");
  const [number, setNumber] = useState<string>(initialPhoneNumber || "");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<CountryCode>(
    initialCountry || "US",
  );

  useEffect(() => {
    const fetchCallingCode = async () => {
      try {
        const callingCode = await getCountryCallingCodeAsync(countryCode);
        setCode(callingCode);
      } catch (error) {
        console.error("Error fetching calling code:", error);
      }
    };
    fetchCallingCode();
  }, [countryCode]);

  const handleSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCode(country.callingCode[0]);
  };

  const handleTextChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setNumber(cleaned);

    onChangeText?.(`+${code}${cleaned}`);

    const isValid = isValidNumber(cleaned, countryCode);
    onValidationChange?.(isValid);
  };

  return (
    <View className="flex flex-row items-center border border-gray-300 rounded-md px-3 h-12">
      <CountryModalProvider>
        <View className="flex flex-row items-center justify-center">
          <TouchableOpacity
            className="flex flex-row justify-center items-center"
            disabled={disabled}
            onPress={() => setModalVisible(true)}
          >
            <CountryPicker
              onSelect={handleSelect}
              withEmoji
              withFilter
              withFlag
              countryCode={countryCode}
              withCallingCode
              countryCodes={allowedCountryCodes}
              disableNativeModal={disabled}
              visible={modalVisible}
              renderFlagButton={() => (
                <Flag countryCode={countryCode} flagSize={24} />
              )}
              onClose={() => setModalVisible(false)}
            />
            <Text className="text-black text-base font-medium">{`+${code}`}</Text>
            <Text className="text-black text-base font-normal ml-0.5">▾</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 text-base mb-1 ml-6"
            placeholder="Phone Number"
            onChangeText={handleTextChange}
            value={formatPhoneNumber(number, countryCode)}
            editable={!disabled}
            selectionColor="black"
            keyboardAppearance="dark"
            keyboardType="number-pad"
            autoFocus
          />
        </View>
      </CountryModalProvider>
    </View>
  );
};

const isValidNumber = (number: string, countryCode?: string): boolean => {
  try {
    if (!countryCode) return false;

    const parsedNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch {
    return false;
  }
};

const formatPhoneNumber = (phoneNumber: string, iso2: string) => {
  if (!phoneNumber) return "";
  try {
    const parsedNumber = phoneUtil.parse(phoneNumber, iso2);
    const formatted = phoneUtil.format(
      parsedNumber,
      PhoneNumberFormat.INTERNATIONAL,
    );
    const countryCode = `+${parsedNumber.getCountryCode()}`;
    return formatted.replace(countryCode, "").trim();
  } catch {
    return phoneNumber;
  }
};
