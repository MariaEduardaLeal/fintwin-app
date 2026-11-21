import React, { type ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`rounded-2xl border border-surface-border bg-surface-card p-5 ${className}`}
    >
      {children}
    </View>
  );
}
