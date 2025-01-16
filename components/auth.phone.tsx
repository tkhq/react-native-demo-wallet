import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";

// TODO: we need a better way of handling country codes and flags
// for the React Auth component, we use react-international-phone, but this is not available for react-native
const countries = [
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
];

const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length === 0) return "";
  if (phoneNumber.length <= 3) {
    return `(${phoneNumber}`;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};

const PhoneNumberInput = ({
  onPhoneChange,
  initialValue,
}: {
  onPhoneChange: (phone: string) => void;
  initialValue?: string;
}) => {
  const [phone, setPhone] = useState(initialValue ?? "");
  const [callingCode, setCallingCode] = useState({
    code: countries[0].code,
    flag: countries[0].flag,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setPhone(cleaned);

    const phoneWithCode = `${callingCode.code}${cleaned}`;
    onPhoneChange(phoneWithCode);
  };

  const selectCountry = (country: { code: string; flag: any }) => {
    setCallingCode(country);
    setDropdownVisible(false);
  };

  return (
    <View className="relative w-full">
      <View className="flex flex-row items-center border border-gray-300 rounded-md px-3 h-12">
        <TouchableOpacity
          className="flex flex-row items-center mr-2"
          onPress={() => setDropdownVisible((prev) => !prev)}
        >
          <Text className="text-base font-normal">{callingCode.flag}</Text>
          <View className="flex flex-row items-center ml-1">
            <Text className="text-base font-normal">{callingCode.code}</Text>
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
        <View className="absolute top-16 left-0 right-0 bg-white border border-gray-300 rounded-md z-10">
          <FlatList
            data={countries}
            keyExtractor={(item) => item.name}
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

export default PhoneNumberInput;
