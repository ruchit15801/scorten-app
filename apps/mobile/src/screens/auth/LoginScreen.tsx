import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

type Props = { navigation: any };

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const dispatch = useDispatch<any>();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);

  const handleLogin = async () => {
    if (!email || !password) return;
    await dispatch(loginThunk({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
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

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Pick up where you left off and keep{'\n'}progressing forward.
        </Text>

        {/* Error */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={[
            styles.inputWrapper,
            emailFocused && styles.inputWrapperFocused,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="hello@example.com"
              placeholderTextColor={COLORS.inputPlaceholder}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.inputIcon}>✉</Text>
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[
            styles.inputWrapper,
            passwordFocused && styles.inputWrapperFocused,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.inputPlaceholder}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.inputIcon}>{showPassword ? '👁' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>Forget Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.signInBtn, (!email || !password) && styles.btnDisabled]}
          activeOpacity={0.85}
          onPress={handleLogin}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.signInBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* OTP Login */}
        <TouchableOpacity
          style={styles.otpBtn}
          onPress={() => navigation.navigate('OTP', { purpose: 'login' })}
        >
          <Text style={styles.otpIcon}>📱</Text>
          <Text style={styles.otpBtnText}>Login with OTP</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RoleSelect')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: { marginBottom: 20 },
  backCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },

  owlArea: { alignItems: 'center', marginBottom: 28 },
  owlCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  owlEmoji: { fontSize: 50 },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 28,
  },

  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderError + '40',
  },
  errorText: { fontSize: 14, color: COLORS.error },

  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputWrapperFocused: {
    borderColor: COLORS.inputBorderFocused,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 14,
  },
  inputIcon: { fontSize: 18, opacity: 0.5 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 28 },
  forgotText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  signInBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: {
    backgroundColor: COLORS.primaryBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  signInBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 13, color: COLORS.textMuted },

  otpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: RADIUS.xl,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: 32,
  },
  otpIcon: { fontSize: 20 },
  otpBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.text },

  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { fontSize: 15, color: COLORS.textSecondary },
  signupLink: { fontSize: 15, color: COLORS.primary, fontWeight: '700' },
});
