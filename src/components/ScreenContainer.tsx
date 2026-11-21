import React, { type ReactNode } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
}

export function ScreenContainer({
  children,
  scroll = true,
  className = '',
}: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface dark">
      <StatusBar barStyle="light-content" />
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={`px-5 py-6 ${className}`}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 px-5 py-6 ${className}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
