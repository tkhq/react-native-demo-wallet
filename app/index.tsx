import * as React from 'react';
import { View } from 'react-native';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import { Turnkey } from '~/lib/icons/Turnkey';
import Auth from '~/components/auth';

export default function Landing() {
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm ">
        <CardHeader className="items-center">
          <Turnkey className="" />
          <View className="p-3" />
          <CardTitle className="pb-2 text-center">Log in or sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth />
        </CardContent>
      </Card>
    </View>
  );
}
