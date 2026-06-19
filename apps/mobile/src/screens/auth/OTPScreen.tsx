import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, StatusBar, Animated,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { verifyOtpThunk } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api/auth.api';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

type Props = { navigation: any; route: any };

const OTP_LENGTH = 4;

export function OTPScreen({ navigation, route }: Props) {
  const { phone, purpose, role } = route?.params || {};
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch<any>();

  useEffect(() => {
    // Start countdown
    let t = 20;
    const interval = setInterval(() => {
      t--;
      setResendTimer(t);
      if (t <= 0) {
        clearInterval(interval);
        setCanResend(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < OTP_LENGTH) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await dispatch(verifyOtpThunk({ phone, otp: otpCode, role }));
      if (result.meta.requestStatus === 'rejected') {
        setError('Wrong code, please try again');
        setOtp(Array(OTP_LENGTH).fill(''));
        shakeInputs();
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Wrong code, please try again');
      shakeInputs();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    await authAPI.sendOtp(phone);
    setResendTimer(20);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');

    let t = 20;
    const interval = setInterval(() => {
      t--;
      setResendTimer(t);
      if (t <= 0) { clearInterval(interval); setCanResend(true); }
    }, 1000);
  };

  const isComplete = otp.every(d => d !== '');
  const hasError = !!error;

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

      {/* Title */}
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        We've sent an Email with an activation code to your email ID{' '}
        <Text style={styles.emailText}>{phone || 'helloworld@gmail.com'}</Text>
      </Text>

      {/* OTP Inputs */}
      <Animated.View
        style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}
      >
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={ref => { if (ref) inputRefs.current[i] = ref; }}
            style={[
              styles.otpBox,
              digit && styles.otpBoxFilled,
              hasError && styles.otpBoxError,
            ]}
            value={digit}
            onChangeText={v => handleOtpChange(v, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectionColor={COLORS.primary}
          />
        ))}
      </Animated.View>

      {/* Error message */}
      {hasError && (
        <Text style={styles.errorMsg}>⚠ {error}</Text>
      )}

      {/* Resend */}
      <View style={styles.resendRow}>
        <Text style={styles.resendLabel}>
          {canResend ? "I didn't receive a code : " : `Send code again : `}
        </Text>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resendTimer}>
            00.{resendTimer.toString().padStart(2, '0')}
          </Text>
        )}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueBtn, !isComplete && styles.btnDisabled]}
        activeOpacity={0.85}
        onPress={handleContinue}
        disabled={!isComplete || isLoading}
      >
        <Text style={styles.continueBtnText}>
          {isLoading ? 'Verifying...' : 'Continue'}
        </Text>
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
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 40,
  },
  emailText: { color: COLORS.primary, fontWeight: '600' },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  otpBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryUltraLight,
  },
  otpBoxError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },

  errorMsg: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 4,
  },
  resendLabel: { fontSize: 14, color: COLORS.textSecondary },
  resendLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
  resendTimer: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },

  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
