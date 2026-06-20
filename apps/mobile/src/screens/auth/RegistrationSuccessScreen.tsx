import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Animated, Clipboard, Alert, Share, ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { clearSuccessScreen } from '../../store/slices/authSlice';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function RegistrationSuccessScreen() {
  const dispatch = useDispatch<any>();
  const { lastRegisteredSCortenId, user } = useSelector((s: RootState) => s.auth);

  const scortenId  = lastRegisteredSCortenId || 'SCH-2026-XXXXX';
  const schoolName = (user as any)?.schoolName || 'Your School';

  const [copied, setCopied] = useState(false);

  // ── Entrance Animations ────────────────────────────────────────────────────
  const heroFade   = useRef(new Animated.Value(0)).current;
  const heroScale  = useRef(new Animated.Value(0.8)).current;
  const cardSlide  = useRef(new Animated.Value(60)).current;
  const cardFade   = useRef(new Animated.Value(0)).current;
  const idPulse    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Step 1: Hero bounces in
    Animated.parallel([
      Animated.timing(heroFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(heroScale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
    ]).start(() => {
      // Step 2: Card slides up
      Animated.parallel([
        Animated.timing(cardSlide, { toValue: 0,  duration: 450, useNativeDriver: true }),
        Animated.timing(cardFade,  { toValue: 1,  duration: 450, useNativeDriver: true }),
      ]).start(() => {
        // Step 3: ID pulses once to draw attention
        Animated.sequence([
          Animated.timing(idPulse, { toValue: 1.06, duration: 200, useNativeDriver: true }),
          Animated.timing(idPulse, { toValue: 1,    duration: 200, useNativeDriver: true }),
          Animated.timing(idPulse, { toValue: 1.04, duration: 150, useNativeDriver: true }),
          Animated.timing(idPulse, { toValue: 1,    duration: 150, useNativeDriver: true }),
        ]).start();
      });
    });
  }, []);

  const handleCopy = () => {
    Clipboard.setString(scortenId);
    setCopied(true);
    Alert.alert(
      '✅ Copied to Clipboard',
      `Your Scorten ID: ${scortenId}\n\nShare this with teachers so they can find and apply to your school.`,
    );
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Find ${schoolName} on Scorten App!\n\n🏫 Scorten School ID: ${scortenId}\n\nDownload Scorten to connect with verified teachers.`,
        title: `${schoolName} — Scorten School ID`,
      });
    } catch {}
  };

  // Dispatch clearSuccessScreen → sets isAuthenticated=true → RootNavigator routes to SchoolApp
  const handleGoToDashboard = () => {
    dispatch(clearSuccessScreen());
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#059669" barStyle="light-content" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <Animated.View style={[styles.heroContent, { opacity: heroFade, transform: [{ scale: heroScale }] }]}>
          <View style={styles.successRing}>
            <View style={styles.successCircle}>
              <Icon name="checkmark" size={52} color="#FFF" />
            </View>
          </View>
          <Text style={styles.heroTitle}>Registration Complete!</Text>
          <Text style={styles.heroSub}>
            Welcome to Scorten,{'\n'}
            <Text style={{ fontWeight: '900' }}>{schoolName}</Text>
          </Text>
        </Animated.View>
      </View>

      {/* ── SCROLLABLE BODY ───────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlide }] }}>

          {/* ── YOUR SCORTEN ID CARD ───────────────────────────────────────── */}
          <View style={styles.idCard}>

            {/* Card Header */}
            <View style={styles.idCardHeader}>
              <View style={styles.shieldBox}>
                <Icon name="shield-checkmark" size={26} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.idCardTitle}>Your Scorten School ID</Text>
                <Text style={styles.idCardSub}>Unique · Permanent · Verified</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark-circle" size={14} color="#059669" />
                <Text style={styles.verifiedText}> Verified</Text>
              </View>
            </View>

            {/* ── THE ID VALUE ── */}
            <Animated.View style={[styles.idBox, { transform: [{ scale: idPulse }] }]}>
              <Text style={styles.idLabel}>SCORTEN ID</Text>
              <Text style={styles.idValue} selectable>{scortenId}</Text>
              <View style={styles.idDots}>
                {scortenId.split('').map((ch, i) => (
                  <Text key={i} style={[styles.idChar, ch === '-' && styles.idDash]}>{ch}</Text>
                ))}
              </View>
            </Animated.View>

            {/* Action Buttons */}
            <View style={styles.idActions}>
              <TouchableOpacity
                style={[styles.copyBtn, copied && styles.copyBtnDone]}
                onPress={handleCopy}
                activeOpacity={0.85}
              >
                <Icon
                  name={copied ? 'checkmark-circle' : 'copy-outline'}
                  size={19}
                  color={copied ? '#059669' : '#059669'}
                />
                <Text style={styles.copyBtnText}>{copied ? ' Copied!' : ' Copy ID'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
                <Icon name="share-social-outline" size={19} color="#FFF" />
                <Text style={styles.shareBtnText}> Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── HOW TO USE ─────────────────────────────────────────────────── */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>How to use your Scorten ID</Text>
            {[
              { icon: 'search',           color: '#7B61FF', bg: '#EDE9FF', text: 'Teachers search this ID to find and apply directly to your school' },
              { icon: 'lock-closed',      color: '#059669', bg: '#ECFDF5', text: 'This ID is permanent and tied to your school forever — it cannot change' },
              { icon: 'clipboard',        color: '#F59E0B', bg: '#FFFBEB', text: 'Save it in your official school records and HR system' },
              { icon: 'share-social',     color: '#3B82F6', bg: '#EFF6FF', text: 'Print it on your noticeboard or share on WhatsApp to attract teachers' },
            ].map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: item.bg }]}>
                  <Icon name={item.icon} size={17} color={item.color} />
                </View>
                <Text style={styles.infoText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* ── WARNING ────────────────────────────────────────────────────── */}
          <View style={styles.warningCard}>
            <Icon name="camera-outline" size={22} color="#92400E" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.warningTitle}>📸 Take a Screenshot Now</Text>
              <Text style={styles.warningText}>
                Save this ID before continuing. You can also find it anytime in your School Dashboard settings.
              </Text>
            </View>
          </View>

          {/* ── CONTINUE BUTTON ────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleGoToDashboard}
            activeOpacity={0.88}
          >
            <Icon name="home" size={20} color="#FFF" />
            <Text style={styles.continueBtnText}> Go to School Dashboard</Text>
            <Icon name="arrow-forward" size={18} color="#FFFFFF99" />
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0FDF4' },

  // Hero
  hero: {
    backgroundColor: '#059669',
    paddingTop: 56, paddingBottom: 36, paddingHorizontal: SPACING.screen,
    alignItems: 'center',
  },
  heroContent: { alignItems: 'center' },
  successRing: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#FFFFFF20', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, borderWidth: 3, borderColor: '#FFFFFF40',
  },
  successCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#FFFFFF30', alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 8, textAlign: 'center' },
  heroSub:   { fontSize: 15, color: '#D1FAE5', textAlign: 'center', lineHeight: 22 },

  // Body
  body: { padding: SPACING.screen },

  // ID Card
  idCard: {
    backgroundColor: '#FFF', borderRadius: RADIUS['2xl'], padding: 18, marginBottom: 14,
    borderWidth: 2, borderColor: '#059669',
    shadowColor: '#059669', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 10,
  },
  idCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  shieldBox: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: '#059669',
    alignItems: 'center', justifyContent: 'center',
  },
  idCardTitle: { fontSize: 16, fontWeight: '900', color: '#064E3B', marginBottom: 2 },
  idCardSub:   { fontSize: 12, color: '#065F46', fontWeight: '500' },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: '#059669',
  },
  verifiedText: { fontSize: 12, fontWeight: '700', color: '#059669' },

  // ID Box
  idBox: {
    backgroundColor: '#F0FDF4', borderRadius: RADIUS.xl,
    paddingVertical: 20, paddingHorizontal: 16, marginBottom: 14,
    alignItems: 'center',
    borderWidth: 2, borderColor: '#059669', borderStyle: 'dashed',
  },
  idLabel: {
    fontSize: 10, fontWeight: '800', color: '#059669',
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
  },
  idValue: {
    fontSize: 30, fontWeight: '900', color: '#059669',
    letterSpacing: 3, textAlign: 'center', marginBottom: 4,
  },
  idDots: { flexDirection: 'row' },
  idChar:  { fontSize: 10, color: '#6EE7B7', fontWeight: '700', letterSpacing: 1.5 },
  idDash:  { color: '#A7F3D0' },

  // Action Buttons
  idActions: { flexDirection: 'row', gap: 10 },
  copyBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#D1FAE5', borderRadius: RADIUS.xl, paddingVertical: 14,
    borderWidth: 1.5, borderColor: '#059669',
  },
  copyBtnDone: { backgroundColor: '#ECFDF5' },
  copyBtnText: { fontSize: 14, fontWeight: '800', color: '#059669' },
  shareBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#059669', borderRadius: RADIUS.xl, paddingVertical: 14,
    shadowColor: '#059669', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  shareBtnText: { fontSize: 14, fontWeight: '800', color: '#FFF' },

  // Info Card
  infoCard: {
    backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  infoCardTitle: { fontSize: 13, fontWeight: '800', color: COLORS.text, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.6 },
  infoRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  infoIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, paddingTop: 8 },

  // Warning
  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FEF3C7', borderRadius: RADIUS.xl, padding: 16, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#F59E0B',
  },
  warningTitle: { fontSize: 13, fontWeight: '800', color: '#92400E', marginBottom: 4 },
  warningText:  { fontSize: 12, color: '#92400E', lineHeight: 19 },

  // Continue
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#059669', borderRadius: RADIUS.xl, paddingVertical: 18,
    shadowColor: '#059669', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },
  continueBtnText: { fontSize: 17, fontWeight: '900', color: '#FFF' },
});
