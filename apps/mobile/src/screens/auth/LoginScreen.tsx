import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator, StatusBar, Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearError } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

// ─── Validation Helpers ────────────────────────────────────────────────────────
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPassword = (pw: string) => pw.length >= 6;

// ─── Input Field Component ─────────────────────────────────────────────────────
function InputField({
  label, value, onChange, placeholder, icon, secure, onToggleSecure,
  keyboardType, error, hint, autoCapitalize,
}: any) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? COLORS.error
    : focused
    ? COLORS.primary
    : COLORS.inputBorder;

  const bgColor = error
    ? COLORS.errorBg
    : focused
    ? COLORS.primaryUltraLight
    : COLORS.inputBg;

  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, { borderColor, backgroundColor: bgColor }]}>
        <Icon name={icon} size={18} color={focused ? COLORS.primary : COLORS.textMuted} />
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secure}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
        />
        {onToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure} style={s.eyeBtn}>
            <Icon name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        {!error && !secure && value.length > 0 && !onToggleSecure && (
          <Icon name="checkmark-circle" size={18} color={COLORS.success} />
        )}
        {error && <Icon name="alert-circle" size={18} color={COLORS.error} />}
      </View>
      {error ? (
        <Text style={s.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={s.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: RADIUS.lg, borderWidth: 1.5,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  eyeBtn: { padding: 2 },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 5, marginLeft: 2 },
  hintText: { fontSize: 12, color: COLORS.textMuted, marginTop: 5, marginLeft: 2 },
});

// ─── Main Login Screen ─────────────────────────────────────────────────────────
export function LoginScreen({ navigation }: any) {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [showPass, setShowPass]             = useState(false);
  const [touched, setTouched]               = useState({ email: false, password: false });
  const [shakeAnim]                         = useState(new Animated.Value(0));

  const dispatch = useDispatch<any>();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);

  useEffect(() => { dispatch(clearError()); }, []);

  // Field-level validation
  const emailError   = touched.email    && !isValidEmail(email)   ? 'Enter a valid email address' : null;
  const passError    = touched.password && !isValidPassword(password) ? 'Password must be at least 6 characters' : null;
  const canSubmit    = isValidEmail(email) && isValidPassword(password);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!canSubmit) { shake(); return; }
    const result = await dispatch(loginThunk({ email: email.trim(), password }));
    if (result.meta.requestStatus === 'rejected') { shake(); }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER HERO */}
      <View style={styles.hero}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.heroCenter}>
          <View style={styles.heroBrand}>
            <Icon name="school" size={36} color="#FFF" />
          </View>
          <Text style={styles.heroTitle}>Welcome Back</Text>
          <Text style={styles.heroSub}>Sign in to your Scorten account</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* API Error Banner */}
        {!!error && (
          <Animated.View style={[styles.errorBanner, { transform: [{ translateX: shakeAnim }] }]}>
            <Icon name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </Animated.View>
        )}

        {/* FORM CARD */}
        <View style={styles.card}>
          <InputField
            label="Email Address"
            value={email}
            onChange={(v: string) => { setEmail(v); setTouched(t => ({ ...t, email: false })); }}
            placeholder="your@email.com"
            icon="mail-outline"
            keyboardType="email-address"
            error={emailError}
          />
          <InputField
            label="Password"
            value={password}
            onChange={(v: string) => { setPassword(v); setTouched(t => ({ ...t, password: false })); }}
            placeholder="Enter your password"
            icon="lock-closed-outline"
            secure={!showPass}
            onToggleSecure={() => setShowPass(!showPass)}
            error={passError}
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* SIGN IN BUTTON */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <TouchableOpacity
            style={[styles.signInBtn, !canSubmit && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="log-in-outline" size={20} color="#FFF" />
                <Text style={styles.signInBtnText}> Sign In</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.divLine} />
          <Text style={styles.divText}>or</Text>
          <View style={styles.divLine} />
        </View>

        {/* OTP Login */}
        <TouchableOpacity
          style={styles.otpBtn}
          onPress={() => navigation.navigate('OTP', { purpose: 'login' })}
        >
          <Icon name="phone-portrait-outline" size={20} color={COLORS.primary} />
          <Text style={styles.otpBtnText}>Login with Mobile OTP</Text>
        </TouchableOpacity>

        {/* Sign Up Row */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RoleSelect')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Login Hint */}
        <View style={styles.demoCard}>
          <Icon name="information-circle-outline" size={16} color={COLORS.primary} />
          <Text style={styles.demoText}> Use your registered email & password to sign in</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 32,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  heroCenter: { alignItems: 'center' },
  heroBrand: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFFFFF20',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    borderWidth: 2, borderColor: '#FFFFFF40',
  },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  heroSub: { fontSize: 14, color: '#FFFFFFBB', letterSpacing: 0.2 },

  scroll: { padding: SPACING.screen },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.xl, padding: 14, marginBottom: 14,
    borderWidth: 1.5, borderColor: COLORS.error + '40',
  },
  errorBannerText: { flex: 1, fontSize: 14, color: COLORS.error, fontWeight: '600' },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 4 },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  signInBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, marginBottom: 20,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  btnDisabled: { backgroundColor: COLORS.primaryLight, shadowOpacity: 0.1, elevation: 2 },
  signInBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  divText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },

  otpBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, paddingVertical: 16,
    borderWidth: 1.5, borderColor: COLORS.border, marginBottom: 24,
  },
  otpBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text },

  signupRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  signupText: { fontSize: 15, color: COLORS.textSecondary },
  signupLink: { fontSize: 15, color: COLORS.primary, fontWeight: '800' },

  demoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 12,
    borderWidth: 1, borderColor: COLORS.primary + '25',
  },
  demoText: { flex: 1, fontSize: 12, color: COLORS.primaryDark, lineHeight: 18 },
});
