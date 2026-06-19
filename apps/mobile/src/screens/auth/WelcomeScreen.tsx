import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');
type Props = { navigation: any };

export function WelcomeScreen({ navigation }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Purple wave at top */}
      <View style={styles.topWave} />

      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slideY }] }]}>
        {/* Owl + logo area */}
        <View style={styles.heroArea}>
          <View style={styles.owlCircle}>
            <Text style={styles.owlEmoji}>🦉</Text>
          </View>
          <Text style={styles.logoText}>Scorten</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>Where Great Schools,</Text>
        <Text style={styles.headlineAccent}>Meet Great Teachers</Text>

        <Text style={styles.subtitle}>
          The smarter way to hire, teach, and grow — powered by AI.
        </Text>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('RoleSelect')}
          >
            <Text style={styles.primaryBtnText}>Get Started →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryBtnText}>Already have an account? <Text style={styles.linkText}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: COLORS.primaryBg,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.screen,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  owlCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 16,
  },
  owlEmoji: { fontSize: 70 },
  logoText: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  headlineAccent: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
    paddingHorizontal: 10,
  },
  btnGroup: {
    gap: 14,
  },
  primaryBtn: {
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
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
