import React from 'react';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { commonStyles } from '@/styles/commonStyles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={commonStyles.link}>
          <Text style={commonStyles.bodyText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
