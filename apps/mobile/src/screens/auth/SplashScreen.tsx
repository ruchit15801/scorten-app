import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing,
  Dimensions, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

type Props = { navigation: any };

// Owl mascot drawn with React Native primitives
function OwlMascot({ size = 140 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow circle */}
      <View style={{
        position: 'absolute',
        width: size * 1.2, height: size * 1.2,
        borderRadius: size * 0.6,
        backgroundColor: COLORS.primary + '18',
      }} />
      <View style={{
        position: 'absolute',
        width: size, height: size,
        borderRadius: size * 0.5,
        backgroundColor: COLORS.primary + '12',
      }} />

      {/* Graduation cap + book (emoji fallback) */}
      <View style={{
        width: size * 0.75, height: size * 0.75,
        borderRadius: size * 0.375,
        backgroundColor: COLORS.primaryBg,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: size * 0.45 }}>🦉</Text>
      </View>

      {/* Graduation cap */}
      <View style={{
        position: 'absolute', top: size * 0.02,
        width: size * 0.55, height: size * 0.15,
        backgroundColor: COLORS.primary, borderRadius: 4,
        alignItems: 'center',
      }}>
        <View style={{
          width: size * 0.08, height: size * 0.1,
          backgroundColor: COLORS.primary, marginTop: -size * 0.08,
        }} />
      </View>
    </View>
  );
}

export function SplashScreen({ navigation }: Props) {
  const owl1Y = useRef(new Animated.Value(60)).current;
  const owl1Opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(20)).current;
  const btnScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Owl floats up
      Animated.parallel([
        Animated.spring(owl1Y, { toValue: 0, friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(owl1Opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
      // Text fades in
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(textY, { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
      // Button pops
      Animated.spring(btnScale, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
    ]).start(() => {
      // Auto navigate after 2.5s
      setTimeout(() => navigation.replace('Welcome'), 1800);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* BG Decoration circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      {/* Owl mascot */}
      <Animated.View style={[
        styles.owlContainer,
        { opacity: owl1Opacity, transform: [{ translateY: owl1Y }] },
      ]}>
        <OwlMascot size={160} />
      </Animated.View>

      {/* Text */}
      <Animated.View style={[
        styles.textBlock,
        { opacity: textOpacity, transform: [{ translateY: textY }] },
      ]}>
        <Text style={styles.brandName}>Scorten</Text>
        <Text style={styles.tagline}>Where Great Schools,</Text>
        <Text style={styles.taglineBold}>Meet Great Teachers</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    bottom: -80, left: -60,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: COLORS.primary + '10',
  },
  circle2: {
    position: 'absolute',
    top: -40, right: -40,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.primary + '08',
  },
  circle3: {
    position: 'absolute',
    bottom: 80, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.primaryLight + '12',
  },
  owlContainer: {
    marginBottom: 32,
  },
  textBlock: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  taglineBold: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '700',
    marginTop: 2,
  },
});
