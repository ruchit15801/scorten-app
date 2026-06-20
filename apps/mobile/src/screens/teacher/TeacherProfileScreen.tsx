import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useMyTeacherProfile, useMyApplications } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

function MenuItem({ icon, label, badge, onPress, danger }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconBox, danger && { backgroundColor: COLORS.errorBg }]}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <Text style={[styles.menuLabel, danger && { color: COLORS.error }]}>{label}</Text>
      {badge && (
        <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{badge}</Text></View>
      )}
      <Text style={[styles.menuArrow, danger && { color: COLORS.error }]}>›</Text>
    </TouchableOpacity>
  );
}

export function TeacherProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile, isLoading } = useMyTeacherProfile();
  const { data: applications } = useMyApplications();

  const score = profile?.scortenReputationScore || 72;
  const appliedCount = applications?.length || 5;

  const completeness = profile?.profileCompleteness || 65;

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── PROFILE HERO ── */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 44 }}>👩‍🏫</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
          </View>
          <Text style={styles.heroName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.heroRole}>{profile?.subjects?.join(', ') || 'Mathematics Teacher'}</Text>
          <Text style={styles.heroLocation}>📍 {profile?.city || 'New Delhi'}, {profile?.state || 'Delhi'}</Text>

          {/* Scores Row */}
          <View style={styles.scoresRow}>
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreVal, { color: COLORS.primary }]}>{score}</Text>
              <Text style={styles.scoreLabel}>Scorten Score</Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreVal, { color: COLORS.success }]}>{appliedCount}</Text>
              <Text style={styles.scoreLabel}>Applications</Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreVal, { color: '#F59E0B' }]}>{completeness}%</Text>
              <Text style={styles.scoreLabel}>Complete</Text>
            </View>
          </View>
        </View>

        {/* ── PROFILE COMPLETION ── */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionTitle}>Profile Strength</Text>
            <Text style={[styles.completionPct, { color: completeness >= 80 ? COLORS.success : COLORS.warning }]}>
              {completeness}%
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${completeness}%` }]} />
          </View>
          {completeness < 100 && (
            <TouchableOpacity style={styles.boostBtn} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.boostBtnText}>Boost Your Score →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── QUICK LINKS ── */}
        <View style={styles.menuCard}>
          <Text style={styles.menuCardTitle}>Career Tools</Text>
          <MenuItem icon="📄" label="Build My Resume" onPress={() => navigation.navigate('ResumeTemplates')} />
          <MenuItem icon="🏆" label="Skill Assessments" onPress={() => navigation.navigate('AssessmentsList')} />
          <MenuItem icon="🎥" label="My Portfolio" onPress={() => navigation.navigate('Portfolio')} />
          <MenuItem icon="📌" label="My Gigs" onPress={() => navigation.navigate('Gigs')} />
          <MenuItem icon="📚" label="Courses" onPress={() => navigation.navigate('Courses')} />
        </View>

        <View style={styles.menuCard}>
          <Text style={styles.menuCardTitle}>Account</Text>
          <MenuItem icon="✏️" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
          <MenuItem icon="🔔" label="Notifications" onPress={() => {}} />
          <MenuItem icon="🔒" label="Privacy & Security" onPress={() => {}} />
          <MenuItem icon="❓" label="Help & Support" onPress={() => {}} />
          <MenuItem icon="🚪" label="Logout" danger onPress={() => dispatch(logout())} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 12,
    backgroundColor: COLORS.primaryBg,
  },
  pageTitle: { fontSize: 26, fontWeight: '900', color: COLORS.text },
  editBtn: {
    backgroundColor: COLORS.primary + '15', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  editBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  hero: {
    backgroundColor: COLORS.primaryBg, paddingHorizontal: SPACING.screen, paddingBottom: 28,
    alignItems: 'center',
  },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatar: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.primary + '40',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 14, elevation: 8,
  },
  statusDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: COLORS.surface,
  },
  heroName: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  heroRole: { fontSize: 15, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  heroLocation: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },

  scoresRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: 16, width: width - 48,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreVal: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  scoreLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  scoreDivider: { width: 1, backgroundColor: COLORS.border },

  completionCard: {
    margin: SPACING.screen, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 18,
    borderWidth: 1, borderColor: COLORS.border,
  },
  completionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  completionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  completionPct: { fontSize: 16, fontWeight: '800' },
  progressBg: { height: 8, backgroundColor: COLORS.backgroundAlt, borderRadius: 4, marginBottom: 14 },
  progressFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  boostBtn: { backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.lg, paddingVertical: 10, alignItems: 'center' },
  boostBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  menuCard: {
    marginHorizontal: SPACING.screen, marginBottom: 16, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, padding: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  menuCardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14,
    borderRadius: RADIUS.lg,
  },
  menuIconBox: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  menuBadge: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  menuBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  menuArrow: { fontSize: 22, color: COLORS.textMuted, fontWeight: '300' },
});
