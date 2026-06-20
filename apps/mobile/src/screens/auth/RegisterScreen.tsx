import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

type Props = { navigation: any; route: any };

function InputField({
  label, value, onChange, placeholder, secure, showToggle, keyboardType,
}: any) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secure && !showToggle?.show}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          autoCorrect={false}
        />
        {showToggle && (
          <TouchableOpacity onPress={showToggle.toggle}>
            <Text style={styles.eyeIcon}>{showToggle.show ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export function RegisterScreen({ navigation, route }: Props) {
  const role = route?.params?.role || 'teacher';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const dispatch = useDispatch<any>();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);

  const isValid = name && email && password && confirmPassword
    && password === confirmPassword && agreed;

  const handleRegister = async () => {
    if (!isValid) return;
    const [firstName, ...rest] = name.trim().split(' ');
    await dispatch(registerThunk({
      firstName,
      lastName: rest.join(' ') || firstName,
      email,
      password,
      role,
    }));
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

        {/* Title */}
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Join Scorten to hire, teach, and grow with trust and simplicity.
        </Text>

        {/* Role badge */}
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {role === 'teacher' ? '👩‍🏫 Signing up as Teacher' : '🏫 Signing up as School'}
          </Text>
        </View>

        {/* Error */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}

        {/* Password mismatch */}
        {confirmPassword && password !== confirmPassword && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ Passwords do not match</Text>
          </View>
        )}

        {/* Inputs */}
        <InputField
          id="name" label="Full Name" value={name}
          onChange={setName} placeholder="John Doe"
        />
        <InputField
          id="email" label="Email Address" value={email}
          onChange={setEmail} placeholder="hello@example.com"
          keyboardType="email-address"
        />
        <InputField
          id="password" label="Password" value={password}
          onChange={setPassword} placeholder="Create a strong password"
          secure showToggle={{ show: showPass, toggle: () => setShowPass(!showPass) }}
        />
        <InputField
          id="confirm" label="Confirm Password" value={confirmPassword}
          onChange={setConfirmPassword} placeholder="Repeat your password"
          secure showToggle={{ show: showConfirmPass, toggle: () => setShowConfirmPass(!showConfirmPass) }}
        />

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            I'm agree to the{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpBtn, !isValid && styles.btnDisabled]}
          activeOpacity={0.85}
          onPress={handleRegister}
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Do you have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>Sign In</Text>
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

  owlArea: { alignItems: 'center', marginBottom: 20 },
  owlCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  owlEmoji: { fontSize: 42 },

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
    marginBottom: 16,
  },

  roleBadge: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  roleBadgeText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderError + '40',
  },
  errorText: { fontSize: 14, color: COLORS.error },

  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: { borderColor: COLORS.inputBorderFocused, backgroundColor: '#FFF' },
  input: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 14 },
  eyeIcon: { fontSize: 18, opacity: 0.5 },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 28,
    marginTop: 8,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { fontSize: 13, color: '#FFF', fontWeight: '700' },
  termsText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  termsLink: { color: COLORS.primary, fontWeight: '600' },

  signUpBtn: {
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
  btnDisabled: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  signUpBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },

  signInRow: { flexDirection: 'row', justifyContent: 'center' },
  signInText: { fontSize: 15, color: COLORS.textSecondary },
  signInLink: { fontSize: 15, color: COLORS.primary, fontWeight: '700' },
});
