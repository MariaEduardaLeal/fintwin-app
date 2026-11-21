import React from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function Input({ label, error, className = '', ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </Text>
      <TextInput
        placeholderTextColor="#64748B"
        className={`rounded-xl border border-surface-border bg-surface-elevated px-4 py-3.5 text-base text-slate-100 ${className}`}
        {...rest}
      />
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
