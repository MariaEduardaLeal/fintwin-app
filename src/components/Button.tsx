import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'google' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand active:bg-brand-dark',
  secondary: 'border border-surface-border bg-surface-elevated active:opacity-80',
  google: 'bg-white active:opacity-90',
  ghost: 'bg-transparent active:opacity-70',
};

const TEXT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'text-slate-950 font-semibold',
  secondary: 'text-slate-100 font-semibold',
  google: 'text-slate-900 font-semibold',
  ghost: 'text-brand-light font-medium',
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-xl px-4 py-3.5 ${
        VARIANT_CLASSES[variant]
      } ${isDisabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'google' ? '#090D16' : '#34D399'}
        />
      ) : (
        <Text className={`text-base ${TEXT_CLASSES[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
