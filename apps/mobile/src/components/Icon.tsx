// ─── Icon Wrapper ──────────────────────────────────────────────────────────────
// Wraps react-native-vector-icons with safe fallback
import React from 'react';
import { Text } from 'react-native';

let IconLib: any = null;
try {
  IconLib = require('react-native-vector-icons/Ionicons').default;
} catch (e) {
  IconLib = null;
}

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export function Icon({ name, size = 22, color = '#1A1A2E', style }: IconProps) {
  if (IconLib) {
    return <IconLib name={name} size={size} color={color} style={style} />;
  }
  // Emoji fallback map
  const FALLBACK: Record<string, string> = {
    'home': '🏠', 'home-outline': '🏠',
    'briefcase': '💼', 'briefcase-outline': '💼',
    'document-text': '📋', 'document-text-outline': '📋',
    'chatbubbles': '💬', 'chatbubbles-outline': '💬',
    'person': '👤', 'person-outline': '👤',
    'search': '🔍', 'search-outline': '🔍',
    'notifications': '🔔', 'notifications-outline': '🔔',
    'heart': '❤️', 'heart-outline': '🤍',
    'star': '⭐', 'star-outline': '⭐',
    'checkmark': '✓', 'checkmark-circle': '✅', 'checkmark-circle-outline': '⭕',
    'close': '✕', 'close-circle': '❌',
    'arrow-back': '←', 'chevron-back': '‹', 'chevron-forward': '›',
    'add': '+', 'add-circle': '➕',
    'send': '➤', 'send-outline': '➤',
    'camera': '📷', 'image': '🖼️',
    'school': '🏫', 'school-outline': '🏫',
    'book': '📚', 'book-outline': '📚',
    'time': '⏱️', 'time-outline': '⏱️',
    'location': '📍', 'location-outline': '📍',
    'cash': '💰', 'cash-outline': '💰',
    'trophy': '🏆', 'trophy-outline': '🏆',
    'settings': '⚙️', 'settings-outline': '⚙️',
    'log-out': '🚪', 'log-out-outline': '🚪',
    'create': '✏️', 'create-outline': '✏️',
    'share': '📤', 'share-outline': '📤',
    'filter': '⚙️', 'filter-outline': '⚙️',
    'mic': '🎙️', 'mic-outline': '🎙️',
    'videocam': '🎥', 'videocam-outline': '🎥',
    'trending-up': '📈', 'stats-chart': '📊',
    'people': '👥', 'people-outline': '👥',
    'calendar': '📅', 'calendar-outline': '📅',
    'mail': '📧', 'mail-outline': '📧',
    'call': '📞', 'call-outline': '📞',
    'eye': '👁️', 'eye-outline': '👁️',
    'lock-closed': '🔒', 'lock-closed-outline': '🔒',
    'help-circle': '❓', 'help-circle-outline': '❓',
    'information-circle': 'ℹ️',
    'play': '▶️', 'play-circle': '▶️',
    'pause': '⏸️',
    'flash': '⚡', 'flash-outline': '⚡',
    'ribbon': '🎗️',
    'rocket': '🚀',
    'sparkles': '✨',
    'grid': '⊞', 'grid-outline': '⊞',
    'list': '≡', 'list-outline': '≡',
  };
  const emoji = FALLBACK[name] || '•';
  return <Text style={[{ fontSize: size * 0.85, color, lineHeight: size }, style]}>{emoji}</Text>;
}
