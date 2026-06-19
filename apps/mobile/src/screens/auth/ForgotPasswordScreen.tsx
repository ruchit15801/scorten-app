import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { authAPI } from '../../services/api/auth.api';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

type Props = { navigation: any };

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successOwl}>
          <Text style={{ fontSize: 70 }}>🦉</Text>
        </View>
        <Text style={styles.successTitle}>Email Sent!</Text>
        <Text style={styles.successSub}>
          We've sent a password reset code to{'\n'}
          <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{email}</Text>
        </Text>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('OTP', { phone: email, purpose: 'password_reset' })}
        >
          <Text style={styles.continueBtnText}>Enter OTP →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backLinkText}>← Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <View style={styles.backCircle}>
          <Text style={styles.backArrow}>‹</Text>
        </View>
      </TouchableOpacity>

      {/* Owl */}
      <View style={styles.owlArea}>
        <View style={styles.owlCircle}>
          <Text style={styles.owlEmoji}>🦉</Text>
        </View>
      </View>

      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a verification code to reset your password.
      </Text>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
          <TextInput
            style={styles.input}
            placeholder="hello@example.com"
            placeholderTextColor={COLORS.inputPlaceholder}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.inputIcon}>✉</Text>
        </View>
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={[styles.continueBtn, !email && styles.btnDisabled]}
        activeOpacity={0.85}
        onPress={handleSend}
        disabled={loading || !email}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : (
          <Text style={styles.continueBtnText}>Send Reset Code</Text>
        )}
      </TouchableOpacity>

      {/* Back Link */}
      <TouchableOpacity style={styles.backLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backLinkText}>← Back to Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.screen,
    paddingTop: 56,
    paddingBottom: 40,
  },
  successContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.screen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  successOwl: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  successSub: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 40 },

  backBtn: { marginBottom: 20 },
  backCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },

  owlArea: { alignItems: 'center', marginBottom: 24 },
  owlCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  owlEmoji: { fontSize: 42 },

  title: {
    fontSize: 28, fontWeight: '800', color: COLORS.text,
    marginBottom: 10, letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 32,
  },

  inputGroup: { marginBottom: 28 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: { borderColor: COLORS.inputBorderFocused, backgroundColor: '#FFF' },
  input: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 14 },
  inputIcon: { fontSize: 18, opacity: 0.5 },

  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl, paddingVertical: 18,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    marginBottom: 16,
  },
  btnDisabled: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },

  backLink: { alignItems: 'center', paddingVertical: 12 },
  backLinkText: { fontSize: 15, color: COLORS.textSecondary },
});
