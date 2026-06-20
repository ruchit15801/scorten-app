import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  StatusBar, Animated, Clipboard, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk, clearError } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';
import { generateSchoolSCortenId } from '../../utils/scortenId';

// ─── Validation ────────────────────────────────────────────────────────────────
const isValidEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone  = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\s/g, ''));
const isStrongPass  = (v: string) => v.length >= 8 && /[A-Z]/.test(v) && /\d/.test(v);
const isValidAffNo  = (v: string) => v.trim().length >= 5; // affiliation no.

// ─── Password Strength ─────────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const hasLen   = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum   = /\d/.test(password);
  const hasSpec  = /[!@#$%^&*]/.test(password);
  const score    = [hasLen, hasUpper, hasNum, hasSpec].filter(Boolean).length;
  const levels   = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors   = ['', COLORS.error, COLORS.warning, '#3B82F6', COLORS.success];

  return (
    <View style={pw.wrap}>
      <View style={pw.bars}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[pw.bar, i <= score && { backgroundColor: colors[score] }]} />
        ))}
      </View>
      <Text style={[pw.label, { color: colors[score] }]}>{levels[score]}</Text>
      <View style={pw.hintRow}>
        {[
          { done: hasLen,   text: '8+ chars' },
          { done: hasUpper, text: 'Uppercase' },
          { done: hasNum,   text: 'Number' },
        ].map(h => (
          <View key={h.text} style={pw.hint}>
            <Icon name={h.done ? 'checkmark-circle' : 'ellipse-outline'} size={12} color={h.done ? COLORS.success : COLORS.textMuted} />
            <Text style={[pw.hintText, h.done && { color: COLORS.success }]}> {h.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const pw = StyleSheet.create({
  wrap: { marginTop: 8, marginBottom: 4 },
  bars: { flexDirection: 'row', gap: 4, marginBottom: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 6 },
  hintRow: { flexDirection: 'row', gap: 12 },
  hint: { flexDirection: 'row', alignItems: 'center' },
  hintText: { fontSize: 10, color: COLORS.textMuted },
});

// ─── Field Component ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, icon, secure, onToggleSecure, keyboardType, error, autoCapitalize, editable = true }: any) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? COLORS.error : focused ? COLORS.primary : COLORS.inputBorder;
  const bg = error ? COLORS.errorBg : focused ? COLORS.primaryUltraLight : COLORS.inputBg;

  return (
    <View style={f.group}>
      <Text style={f.label}>{label}</Text>
      <View style={[f.wrap, { borderColor, backgroundColor: bg }]}>
        <Icon name={icon} size={17} color={focused ? COLORS.primary : COLORS.textMuted} />
        <TextInput
          style={f.input}
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
          editable={editable}
        />
        {onToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure}>
            <Icon name={secure ? 'eye-off-outline' : 'eye-outline'} size={19} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        {error && <Icon name="alert-circle" size={17} color={COLORS.error} />}
        {!error && !secure && value?.length > 0 && !onToggleSecure && (
          <Icon name="checkmark-circle" size={17} color={COLORS.success} />
        )}
      </View>
      {error && <Text style={f.errorText}>{error}</Text>}
    </View>
  );
}

const f = StyleSheet.create({
  group: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.text, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 },
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: RADIUS.lg, borderWidth: 1.5,
    paddingHorizontal: 13, paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 4, marginLeft: 2 },
});

// ─── Register Screen ───────────────────────────────────────────────────────────
export function RegisterScreen({ navigation, route }: any) {
  const role = route?.params?.role || 'teacher';
  const isSchool = role === 'school';

  // Common fields
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [agreed,          setAgreed]          = useState(false);
  const [touched,         setTouched]         = useState(false);
  const [shakeAnim]                           = useState(new Animated.Value(0));

  // Teacher fields
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [phone,      setPhone]      = useState('');

  // School fields
  const [schoolName,    setSchoolName]    = useState('');
  const [affNo,         setAffNo]         = useState('');
  const [board,         setBoard]         = useState('CBSE');
  const [principalName, setPrincipalName] = useState('');
  const [city,          setCity]          = useState('');
  // Auto-generated Scorten ID – unique per registration session
  const [scortenId, setSCortenId] = useState('');

  const dispatch = useDispatch<any>();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    dispatch(clearError());
    // Generate unique school ID on mount
    if (isSchool) setSCortenId(generateSchoolSCortenId());
  }, []);

  // Validation
  const emailErr   = touched && !isValidEmail(email)          ? 'Enter a valid email' : null;
  const passErr    = touched && !isStrongPass(password)       ? 'Min 8 chars, 1 uppercase, 1 number' : null;
  const confirmErr = touched && password !== confirmPassword  ? 'Passwords do not match' : null;
  const phoneErr   = touched && phone && !isValidPhone(phone) ? 'Enter a valid 10-digit mobile number' : null;

  const teacherValid = firstName && lastName && isValidEmail(email) && isStrongPass(password) && password === confirmPassword && agreed;
  const schoolValid  = schoolName && affNo && isValidEmail(email) && isStrongPass(password) && password === confirmPassword && agreed && city;
  const canSubmit    = isSchool ? schoolValid : teacherValid;

  const shake = () => Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
  ]).start();

  const handleRegister = async () => {
    setTouched(true);
    if (!canSubmit) { shake(); return; }

    const payload = isSchool
      ? {
          role,
          email: email.trim(),
          password,
          schoolName: schoolName.trim(),
          affiliationNumber: affNo.trim(),
          scortenId,
          board,
          principalName: principalName.trim(),
          city: city.trim(),
          phone: phone.trim(),
        }
      : {
          role,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
        };

    const result = await dispatch(registerThunk(payload));
    if (result.meta.requestStatus === 'rejected') {
      shake();
      // Error banner already shown via Redux error state
    }
    // On success → RootNavigator reacts to pendingSuccessScreen=true automatically:
    //   Schools → RegistrationSuccessScreen shown
    //   Teachers → TeacherApp shown immediately
  };

  const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={isSchool ? '#059669' : COLORS.primary} barStyle="light-content" />

      {/* HERO */}
      <View style={[styles.hero, isSchool && { backgroundColor: '#059669' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.heroCenter}>
          <View style={styles.heroBrand}>
            <Icon name={isSchool ? 'business' : 'person'} size={36} color="#FFF" />
          </View>
          <Text style={styles.heroTitle}>
            {isSchool ? 'Register Your School' : 'Create Teacher Account'}
          </Text>
          <View style={styles.rolePill}>
            <Icon name={isSchool ? 'school' : 'person-circle'} size={14} color={isSchool ? '#059669' : COLORS.primary} />
            <Text style={[styles.rolePillText, isSchool && { color: '#059669' }]}>
              {isSchool ? 'School / Institution' : 'Teacher'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* API Error */}
        {!!error && (
          <View style={styles.errorBanner}>
            <Icon name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* ── SCHOOL FORM ── */}
        {isSchool ? (
          <>
            {/* ── SCORTEN ID CARD ── */}
            <View style={styles.scortenIdCard}>
              <View style={styles.scortenIdTop}>
                <View style={styles.scortenIdIconBox}>
                  <Icon name="shield-checkmark" size={22} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scortenIdLabel}>Your Scorten School ID</Text>
                  <Text style={styles.scortenIdSub}>Auto-generated · Unique · Permanent</Text>
                </View>
                <TouchableOpacity
                  style={styles.regenBtn}
                  onPress={() => setSCortenId(generateSchoolSCortenId())}
                >
                  <Icon name="refresh" size={15} color="#059669" />
                </TouchableOpacity>
              </View>

              <View style={styles.scortenIdValueRow}>
                <Text style={styles.scortenIdValue}>{scortenId}</Text>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => {
                    Clipboard.setString(scortenId);
                    Alert.alert('Copied!', `${scortenId} copied to clipboard.`);
                  }}
                >
                  <Icon name="copy-outline" size={16} color="#059669" />
                  <Text style={styles.copyBtnText}> Copy</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.scortenIdNote}>
                📌 Save this ID — schools and teachers can find you using it on Scorten.
              </Text>
            </View>

            <View style={styles.sectionLabel}>
              <Icon name="school-outline" size={15} color={COLORS.textMuted} />
              <Text style={styles.sectionLabelText}> School Information</Text>
            </View>
            <View style={styles.card}>
              <Field label="School / Institution Name *" value={schoolName} onChange={setSchoolName}
                placeholder="e.g. Delhi Public School" icon="business-outline" autoCapitalize="words"
                error={touched && !schoolName ? 'School name is required' : null} />

              <Field label="Affiliation / Registration Number *" value={affNo} onChange={setAffNo}
                placeholder="e.g. 2730001" icon="id-card-outline" keyboardType="default"
                error={touched && !isValidAffNo(affNo) ? 'Enter a valid affiliation number (min 5 chars)' : null} />

              <Field label="City / District *" value={city} onChange={setCity}
                placeholder="e.g. New Delhi" icon="location-outline" autoCapitalize="words"
                error={touched && !city ? 'City is required' : null} />

              <Field label="Principal / Contact Person Name" value={principalName} onChange={setPrincipalName}
                placeholder="e.g. Dr. Ramesh Kumar" icon="person-outline" autoCapitalize="words" />

              <Field label="Contact Phone (optional)" value={phone} onChange={setPhone}
                placeholder="10-digit mobile number" icon="call-outline" keyboardType="number-pad"
                error={phoneErr} />

              {/* Board Selector */}
              <View style={f.group}>
                <Text style={f.label}>Board / Curriculum *</Text>
                <View style={styles.boardRow}>
                  {BOARDS.map(b => (
                    <TouchableOpacity
                      key={b}
                      style={[styles.boardChip, board === b && styles.boardChipOn]}
                      onPress={() => setBoard(b)}
                    >
                      {board === b && <Icon name="checkmark" size={12} color={COLORS.primary} />}
                      <Text style={[styles.boardText, board === b && styles.boardTextOn]}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.sectionLabel}>
              <Icon name="lock-closed-outline" size={15} color={COLORS.textMuted} />
              <Text style={styles.sectionLabelText}> Account Credentials</Text>
            </View>
            <View style={styles.card}>
              <Field label="Official School Email *" value={email} onChange={(v: string) => setEmail(v)}
                placeholder="principal@school.edu.in" icon="mail-outline" keyboardType="email-address"
                error={emailErr} />
              <Field label="Password *" value={password} onChange={setPassword}
                placeholder="Min 8 chars, 1 uppercase, 1 number" icon="lock-closed-outline"
                secure={!showPass} onToggleSecure={() => setShowPass(!showPass)} error={passErr} />
              <PasswordStrength password={password} />
              <Field label="Confirm Password *" value={confirmPassword} onChange={setConfirmPassword}
                placeholder="Repeat password" icon="lock-closed-outline"
                secure={!showConfirm} onToggleSecure={() => setShowConfirm(!showConfirm)} error={confirmErr} />
            </View>
          </>
        ) : (
          /* ── TEACHER FORM ── */
          <>
            <View style={styles.sectionLabel}>
              <Icon name="person-outline" size={15} color={COLORS.textMuted} />
              <Text style={styles.sectionLabelText}> Personal Information</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.nameRow}>
                <View style={{ flex: 1 }}>
                  <Field label="First Name *" value={firstName} onChange={setFirstName}
                    placeholder="First name" icon="person-outline" autoCapitalize="words"
                    error={touched && !firstName ? 'Required' : null} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Last Name *" value={lastName} onChange={setLastName}
                    placeholder="Last name" icon="person-outline" autoCapitalize="words"
                    error={touched && !lastName ? 'Required' : null} />
                </View>
              </View>
              <Field label="Mobile Number (optional)" value={phone} onChange={setPhone}
                placeholder="10-digit number" icon="call-outline" keyboardType="number-pad"
                error={phoneErr} />
            </View>

            <View style={styles.sectionLabel}>
              <Icon name="lock-closed-outline" size={15} color={COLORS.textMuted} />
              <Text style={styles.sectionLabelText}> Account Credentials</Text>
            </View>
            <View style={styles.card}>
              <Field label="Email Address *" value={email} onChange={setEmail}
                placeholder="your@email.com" icon="mail-outline" keyboardType="email-address"
                error={emailErr} />
              <Field label="Password *" value={password} onChange={setPassword}
                placeholder="Min 8 chars, 1 uppercase, 1 number" icon="lock-closed-outline"
                secure={!showPass} onToggleSecure={() => setShowPass(!showPass)} error={passErr} />
              <PasswordStrength password={password} />
              <Field label="Confirm Password *" value={confirmPassword} onChange={setConfirmPassword}
                placeholder="Repeat password" icon="lock-closed-outline"
                secure={!showConfirm} onToggleSecure={() => setShowConfirm(!showConfirm)} error={confirmErr} />
            </View>
          </>
        )}

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.7}>
          <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
            {agreed && <Icon name="checkmark" size={14} color="#FFF" />}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {touched && !agreed && (
          <Text style={styles.termsErr}>Please accept the terms to continue</Text>
        )}

        {/* Submit */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <TouchableOpacity
            style={[styles.submitBtn, isSchool && styles.submitBtnSchool, !canSubmit && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.submitBtnText}>
                  {isSchool ? ' Register School' : ' Create Account'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 28,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  heroCenter: { alignItems: 'center' },
  heroBrand: {
    width: 72, height: 72, borderRadius: 22, backgroundColor: '#FFFFFF20',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    borderWidth: 2, borderColor: '#FFFFFF40',
  },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 10, textAlign: 'center' },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full,
  },
  rolePillText: { fontSize: 13, fontWeight: '800', color: COLORS.primary },

  scroll: { padding: SPACING.screen },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.xl, padding: 14, marginBottom: 14,
    borderWidth: 1.5, borderColor: COLORS.error + '40',
  },
  errorBannerText: { flex: 1, fontSize: 14, color: COLORS.error, fontWeight: '600' },

  sectionLabel: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 10, marginTop: 4,
  },
  sectionLabelText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  nameRow: { flexDirection: 'row', gap: 10 },

  boardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  boardChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.full,
    paddingHorizontal: 13, paddingVertical: 8, borderWidth: 1.5, borderColor: COLORS.border,
  },
  boardChipOn: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  boardText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  boardTextOn: { color: COLORS.primary, fontWeight: '700' },

  termsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 7,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkboxOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  termsLink: { color: COLORS.primary, fontWeight: '700' },
  termsErr: { fontSize: 12, color: COLORS.error, marginBottom: 12, marginLeft: 2 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, marginTop: 16, marginBottom: 20,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  submitBtnSchool: { backgroundColor: '#059669', shadowColor: '#059669' },
  btnDisabled: { backgroundColor: COLORS.primaryLight, shadowOpacity: 0.1, elevation: 2 },
  submitBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },

  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 15, color: COLORS.textSecondary },
  loginLink: { fontSize: 15, color: COLORS.primary, fontWeight: '800' },

  // ─── Scorten ID Card ────────────────────────────────────────────────────────
  scortenIdCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  scortenIdTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  scortenIdIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scortenIdLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 2,
  },
  scortenIdSub: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '500',
  },
  regenBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#059669',
  },
  scortenIdValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 8,
  },
  scortenIdValue: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 1.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#059669',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  scortenIdNote: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
    fontWeight: '500',
  },
});
