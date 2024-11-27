import * as React from 'react';
import { View, Text } from 'react-native';
import { Separator } from './ui/separator';

export default function OrSeparator() {
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
}
