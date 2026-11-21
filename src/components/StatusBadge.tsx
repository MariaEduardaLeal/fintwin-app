import React from 'react';
import { Text, View } from 'react-native';

type BadgeTone = 'ok' | 'warning' | 'danger' | 'neutral';

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
}

const TONE_CLASSES: Record<BadgeTone, { bg: string; text: string; dot: string }> = {
  ok: {
    bg: 'bg-emerald-500/15 border-emerald-500/40',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  warning: {
    bg: 'bg-amber-500/15 border-amber-500/40',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  danger: {
    bg: 'bg-red-500/15 border-red-500/40',
    text: 'text-red-300',
    dot: 'bg-red-400',
  },
  neutral: {
    bg: 'bg-slate-700/40 border-slate-600/50',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
  },
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  const palette = TONE_CLASSES[tone];

  return (
    <View
      className={`flex-row items-center gap-2 self-start rounded-full border px-3 py-1 ${palette.bg}`}
    >
      <View className={`h-2 w-2 rounded-full ${palette.dot}`} />
      <Text className={`text-xs font-medium ${palette.text}`}>{label}</Text>
    </View>
  );
}
