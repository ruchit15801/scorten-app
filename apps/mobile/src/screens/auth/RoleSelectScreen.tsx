import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { height } = Dimensions.get('window');

const ROLES = [
  {
    key: 'teacher',
    title: "I'm a Teacher",
    subtitle: 'Find jobs, build portfolio, grow your career',
    icon: 'person',
    accentColor: COLORS.primary,
    features: ['Browse school jobs', 'AI-powered interviews', 'Resume builder', 'Skill certifications'],
    bg: COLORS.primaryBg,
  },
  {
    key: 'school',
    title: 'I Represent a School',
    subtitle: 'Post jobs, hire verified teachers with AI screening',
    icon: 'business',
    accentColor: '#059669',
    features: ['Post teaching jobs', 'AI candidate screening', 'Manage applications', 'Direct messaging'],
    bg: '#ECFDF5',
  },
];

export function RoleSelectScreen({ navigation }: any) {
  const [selected, setSelected] = useState<'teacher' | 'school' | null>(null);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    navigation.navigate('Register', { role: selected });
  };

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.brand}>
            <Icon name="school" size={28} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>Join Scorten</Text>
          <Text style={styles.headerSub}>Choose how you want to use the app</Text>
        </View>
      </View>

      {/* ROLE CARDS */}
      <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
        {ROLES.map(role => {
          const isOn = selected === role.key;
          return (
            <TouchableOpacity
              key={role.key}
              style={[
                styles.card,
                isOn && { borderColor: role.accentColor, borderWidth: 2, backgroundColor: role.bg },
              ]}
              onPress={() => setSelected(role.key as any)}
              activeOpacity={0.88}
            >
              {/* Icon + Selection */}
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: role.accentColor + '20' }]}>
                  <Icon name={role.icon} size={32} color={role.accentColor} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[styles.roleTitle, isOn && { color: role.accentColor }]}>{role.title}</Text>
                  <Text style={styles.roleSub}>{role.subtitle}</Text>
                </View>
                {/* Radio */}
                <View style={[styles.radio, isOn && { borderColor: role.accentColor }]}>
                  {isOn && <View style={[styles.radioFill, { backgroundColor: role.accentColor }]} />}
                </View>
              </View>

              {/* Feature List */}
              <View style={[styles.featureList, isOn && { opacity: 1 }]}>
                {role.features.map(ft => (
                  <View key={ft} style={styles.featureItem}>
                    <Icon name="checkmark-circle" size={15} color={isOn ? role.accentColor : COLORS.textMuted} />
                    <Text style={[styles.featureText, isOn && { color: COLORS.text }]}>{ft}</Text>
                  </View>
                ))}
              </View>

              {isOn && (
                <View style={[styles.selectedBadge, { backgroundColor: role.accentColor }]}>
                  <Icon name="checkmark" size={12} color="#FFF" />
                  <Text style={styles.selectedBadgeText}> Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Continue */}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            !selected && styles.continueBtnOff,
            selected === 'school' && styles.continueBtnSchool,
          ]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.88}
        >
          <Icon name="arrow-forward" size={20} color="#FFF" />
          <Text style={styles.continueBtnText}>
            {selected === 'teacher'
              ? ' Continue as Teacher'
              : selected === 'school'
              ? ' Continue as School'
              : ' Select a role to continue'}
          </Text>
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 28,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  headerCenter: { alignItems: 'center' },
  brand: {
    width: 68, height: 68, borderRadius: 20, backgroundColor: '#FFFFFF20',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    borderWidth: 2, borderColor: '#FFFFFF40',
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  headerSub: { fontSize: 13, color: '#FFFFFFBB' },

  content: { flex: 1, padding: SPACING.screen },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS['2xl'],
    padding: 16, marginBottom: 14,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4,
    position: 'relative', overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconBox: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  roleTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  roleSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioFill: { width: 12, height: 12, borderRadius: 6 },

  featureList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, opacity: 0.6 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 5, width: '47%' },
  featureText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },

  selectedBadge: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  selectedBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, marginTop: 8, marginBottom: 20,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  continueBtnOff: { backgroundColor: COLORS.primaryLight, shadowOpacity: 0.1, elevation: 2 },
  continueBtnSchool: { backgroundColor: '#059669', shadowColor: '#059669' },
  continueBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },

  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 15, color: COLORS.textSecondary },
  loginLink: { fontSize: 15, color: COLORS.primary, fontWeight: '800' },
});
