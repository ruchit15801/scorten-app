import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Image,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');
type Props = { navigation: any };

// Illustrated role card component matching Figma
function RoleCard({
  title, subtitle, description, illustration,
  selected, onPress, borderColor,
}: {
  title: string;
  subtitle: string;
  description: string;
  illustration: string;
  selected: boolean;
  onPress: () => void;
  borderColor: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.roleCard,
        selected && { borderColor, borderWidth: 2 },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Illustration area */}
      <View style={[styles.illustrationBox, { backgroundColor: COLORS.backgroundAlt }]}>
        <Text style={styles.illustration}>{illustration}</Text>
      </View>

      {/* Text */}
      <View style={styles.roleText}>
        <Text style={styles.roleSubtitle}>{subtitle}</Text>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>

      {/* Selection indicator */}
      <View style={[
        styles.radioOuter,
        selected && { borderColor },
      ]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: borderColor }]} />}
      </View>
    </TouchableOpacity>
  );
}

export function RoleSelectScreen({ navigation }: Props) {
  const [selected, setSelected] = React.useState<'teacher' | 'school' | null>(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    navigation.navigate('Register', { role: selected });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backCircle}>
            <Text style={styles.backArrow}>‹</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Choose your role</Text>
          <Text style={styles.subtitle}>
            Tell us who you are, so we can guide you better.
          </Text>
        </View>
      </View>

      {/* Role Cards */}
      <View style={styles.cardsArea}>
        <RoleCard
          title="I'm a Teacher."
          subtitle="Teacher"
          description="I want to work."
          illustration="👩‍🏫"
          selected={selected === 'teacher'}
          onPress={() => setSelected('teacher')}
          borderColor={COLORS.primary}
        />
        <RoleCard
          title="Join as School."
          subtitle="School"
          description="I want to hire."
          illustration="🏫"
          selected={selected === 'school'}
          onPress={() => setSelected('school')}
          borderColor={COLORS.primary}
        />
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: SPACING.screen,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  backBtn: { marginTop: 4 },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backArrow: { fontSize: 24, color: COLORS.text, lineHeight: 28 },
  headerText: { flex: 1 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  cardsArea: {
    flex: 1,
    paddingHorizontal: SPACING.screen,
    gap: 16,
  },
  roleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS['2xl'],
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  illustrationBox: {
    width: 100,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  illustration: { fontSize: 50 },
  roleText: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  roleSubtitle: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },

  footer: {
    paddingHorizontal: SPACING.screen,
    paddingBottom: 40,
    paddingTop: 20,
  },
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
  continueBtnDisabled: {
    backgroundColor: COLORS.primaryBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
