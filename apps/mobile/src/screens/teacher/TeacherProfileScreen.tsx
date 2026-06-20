import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useMyTeacherProfile, useMyApplications } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

interface MenuItemProps {
  icon: string;
  label: string;
  sub?: string;
  badge?: string | number;
  onPress: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, sub, badge, onPress, danger }: MenuItemProps) {
  return (
    <TouchableOpacity style={menu.item} onPress={onPress} activeOpacity={0.7}>
      <View style={[menu.iconBox, danger && { backgroundColor: '#FEE2E2' }]}>
        <Icon name={icon} size={20} color={danger ? COLORS.error : COLORS.primary} />
      </View>
      <View style={menu.itemText}>
        <Text style={[menu.label, danger && { color: COLORS.error }]}>{label}</Text>
        {sub && <Text style={menu.sub}>{sub}</Text>}
      </View>
      {badge !== undefined && (
        <View style={menu.badge}>
          <Text style={menu.badgeText}>{badge}</Text>
        </View>
      )}
      <Icon name="chevron-forward" size={18} color={danger ? COLORS.error : COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const menu = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: RADIUS.lg },
  iconBox: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  itemText: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 1 },
  sub: { fontSize: 12, color: COLORS.textMuted },
  badge: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 2, marginRight: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
});

export function TeacherProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const { data: applications } = useMyApplications();

  const score = profile?.scortenReputationScore || 72;
  const completeness = profile?.profileCompleteness || 72;
  const appliedCount = applications?.length || 5;

  const scoreColor = score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.error;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HERO HEADER ── */}
        <View style={styles.heroHeader}>
          <View style={styles.headerTopRow}>
            <Text style={styles.pageTitle}>Profile</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
              <Icon name="create-outline" size={16} color={COLORS.primary} />
              <Text style={styles.editBtnText}> Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroRow}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Icon name="person" size={44} color={COLORS.primary} />
              </View>
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroName} numberOfLines={1}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.heroSubjects}>
                {profile?.subjects?.join(', ') || 'Mathematics Teacher'}
              </Text>
              <View style={styles.heroMetaRow}>
                <Icon name="location-outline" size={13} color={COLORS.textMuted} />
                <Text style={styles.heroCityText}> {profile?.city || 'New Delhi'}</Text>
              </View>
            </View>

            {/* Score Ring */}
            <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}</Text>
              <Text style={styles.scoreLbl}>Score</Text>
            </View>
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            {[
              { label: 'Applications', value: appliedCount, icon: 'briefcase-outline' },
              { label: 'Interviews', value: 2, icon: 'mic-outline' },
              { label: 'Profile', value: `${completeness}%`, icon: 'trending-up' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{s.value}</Text>
                  <Text style={styles.statLbl}>{s.label}</Text>
                </View>
                {i < 2 && <View style={styles.statDiv} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── COMPLETION BAR ── */}
        <View style={styles.completionCard}>
          <View style={styles.completionRow}>
            <View>
              <Text style={styles.completionTitle}>Profile Strength</Text>
              <Text style={styles.completionSub}>Add demo video to boost visibility</Text>
            </View>
            <Text style={[styles.completionPct, { color: completeness >= 80 ? COLORS.success : COLORS.warning }]}>
              {completeness}%
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${completeness}%` as any }]} />
          </View>
          <TouchableOpacity style={styles.boostBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="rocket" size={14} color={COLORS.primary} />
            <Text style={styles.boostText}> Complete Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── CAREER TOOLS ── */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Career Tools</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="document-text-outline" label="Build AI Resume" sub="Generate in seconds" onPress={() => navigation.navigate('ResumeTemplates')} />
            <View style={styles.divider} />
            <MenuItem icon="trophy-outline" label="Skill Assessments" sub="Earn verified badges" onPress={() => navigation.navigate('AssessmentsList')} />
            <View style={styles.divider} />
            <MenuItem icon="videocam-outline" label="My Portfolio" sub="Showcase your work" onPress={() => navigation.navigate('Portfolio')} />
            <View style={styles.divider} />
            <MenuItem icon="briefcase-outline" label="My Gigs" sub="Freelance opportunities" onPress={() => navigation.navigate('Gigs')} />
            <View style={styles.divider} />
            <MenuItem icon="book-outline" label="Browse Courses" sub="Upskill yourself" onPress={() => navigation.navigate('Courses')} />
          </View>
        </View>

        {/* ── ACCOUNT ── */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="create-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
            <View style={styles.divider} />
            <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="lock-closed-outline" label="Privacy & Security" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="log-out-outline" label="Logout" danger onPress={() => dispatch(logout())} />
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  heroHeader: {
    backgroundColor: COLORS.primary, paddingTop: 52,
    paddingHorizontal: SPACING.screen, paddingBottom: 0,
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
  },
  headerTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  pageTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF25', paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: '#FFFFFF40',
  },
  editBtnText: { fontSize: 13, color: '#FFF', fontWeight: '700' },

  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#FFFFFF60',
  },
  onlineDot: {
    position: 'absolute', bottom: 3, right: 3,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#10B981', borderWidth: 2, borderColor: COLORS.primary,
  },
  heroInfo: { flex: 1 },
  heroName: { fontSize: 19, fontWeight: '800', color: '#FFF', marginBottom: 3 },
  heroSubjects: { fontSize: 13, color: '#FFFFFFBB', marginBottom: 4 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center' },
  heroCityText: { fontSize: 12, color: '#FFFFFFAA' },

  scoreCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#FFFFFF20', borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreNum: { fontSize: 20, fontWeight: '900' },
  scoreLbl: { fontSize: 9, color: '#FFFFFFAA', fontWeight: '700', textTransform: 'uppercase' },

  statsStrip: {
    flexDirection: 'row', backgroundColor: '#FFFFFF15',
    borderRadius: 0, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#FFFFFF20',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '900', color: '#FFF', marginBottom: 2 },
  statLbl: { fontSize: 11, color: '#FFFFFFBB', fontWeight: '600' },
  statDiv: { width: 1, backgroundColor: '#FFFFFF30' },

  completionCard: {
    backgroundColor: COLORS.surface, marginHorizontal: SPACING.screen, marginTop: 16, marginBottom: 0,
    borderRadius: RADIUS.xl, padding: 16, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  completionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  completionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  completionSub: { fontSize: 12, color: COLORS.textSecondary },
  completionPct: { fontSize: 17, fontWeight: '900' },
  track: { height: 6, backgroundColor: COLORS.backgroundAlt, borderRadius: 3, marginBottom: 12 },
  fill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  boostBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.md,
    paddingVertical: 10, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  boostText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  menuSection: { marginHorizontal: SPACING.screen, marginTop: 16 },
  menuTitle: {
    fontSize: 12, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 70 },
});
