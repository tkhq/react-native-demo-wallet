import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import countries from "i18n-iso-countries";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import emojiFlags from "emoji-flags";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const UNSUPPORTED_COUNTRY_CODES = new Set([
  "+93", // Afghanistan
  "+964", // Iraq
  "+963", // Syria
  "+249", // Sudan
  "+98", // Iran
  "+850", // North Korea
  "+53", // Cuba
  "+250", // Rwanda
  "+379", // Vatican City
]);

interface Country {
  name: string;
  code: string;
  iso2: string;
  flag: string;
}

export interface PhoneNumberInputProps {
  onPhoneChange: (phone: string) => void;
  initialValue?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  onPhoneChange,
  initialValue,
}) => {
  const countryList = useCountryList();

  // defualt to the United States
  const defaultCountry =
    countryList.find((c) => c.iso2 === "US") || countryList[0];

  const [phone, setPhone] = useState(initialValue ?? "");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(defaultCountry);

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setPhone(cleaned);
    onPhoneChange(`${selectedCountry.code}${cleaned}`);
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setDropdownVisible(false);
  };

  return (
    <View className="relative w-full">
      <View className="flex flex-row items-center border border-gray-300 rounded-md px-3 h-12">
        <TouchableOpacity
          className="flex flex-row items-center mr-2"
          onPress={() => setDropdownVisible((prev) => !prev)}
        >
          <Text className="text-base font-normal">{selectedCountry.flag}</Text>
          <View className="flex flex-row items-center ml-1">
            <Text className="text-base font-normal">
              {selectedCountry.code}
            </Text>
            <Text className="text-base font-normal ml-1">▾</Text>
          </View>
        </TouchableOpacity>
        <TextInput
          className="flex-1 text-base"
          placeholder="Phone number"
          keyboardType="phone-pad"
          onChangeText={handlePhoneChange}
          value={formatPhoneNumber(phone)}
          maxLength={14}
        />
      </View>
      {dropdownVisible && (
        <View className="absolute top-16 left-0 right-0 bg-white border border-gray-300 rounded-md z-10 max-h-56">
          <FlatList
            data={countryList}
            keyExtractor={(item) => item.iso2}
            showsVerticalScrollIndicator
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row items-center justify-between py-2 px-3"
                onPress={() => selectCountry(item)}
              >
                <View className="flex flex-row items-center">
                  <Text className="text-xl font-normal mr-2">{item.flag}</Text>
                  <Text className="text-base font-normal">{item.name}</Text>
                </View>
                <Text className="text-base font-normal">{item.code}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const useCountryList = () =>
  useMemo(
    () =>
      getCountries()
        .filter((iso2) => countries.getName(iso2, "en"))
        .map((iso2) => {
          const name = countries.getName(iso2, "en")!;
          const code = `+${getCountryCallingCode(iso2)}`;
          const flag = emojiFlags[iso2]?.emoji || "🏳️";

          return { name, code, iso2, flag };
        })
        .filter((country) => !UNSUPPORTED_COUNTRY_CODES.has(country.code)),
    []
  );

const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length === 0) return "";
  if (phoneNumber.length <= 3) return `(${phoneNumber}`;
  if (phoneNumber.length <= 6)
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};
