import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useMyTeacherProfile, useMyApplications } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const MOCK_JOBS = [
  { _id: '1', title: 'Senior Mathematics Teacher', city: 'New Delhi', jobType: 'full_time', salaryMin: 35000, matchScore: 95, schoolId: { schoolName: 'Delhi Public School' }, subjects: ['Mathematics'], isFeatured: true },
  { _id: '2', title: 'English & Literature Teacher', city: 'Mumbai', jobType: 'full_time', salaryMin: 40000, matchScore: 82, schoolId: { schoolName: "St. Xavier's School" }, subjects: ['English'], isFeatured: false },
  { _id: '3', title: 'Physics Teacher – JEE Focus', city: 'Kota', jobType: 'full_time', salaryMin: 50000, matchScore: 88, schoolId: { schoolName: 'Allen Career Institute' }, subjects: ['Physics'], isFeatured: true },
];

export function HomeScreen({ navigation }: any) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const { data: applications } = useMyApplications();

  const score = profile?.scortenReputationScore || 72;
  const completeness = profile?.profileCompleteness || 72;
  const appliedCount = applications?.filter((a: any) => ['applied', 'screening'].includes(a.status))?.length ?? 3;
  const interviewCount = applications?.filter((a: any) => a.status?.includes('interview'))?.length ?? 1;
  const offersCount = applications?.filter((a: any) => a.status === 'offered')?.length ?? 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.firstName || 'Teacher'} {user?.lastName || ''}
          </Text>
          <Text style={styles.headerSub}>Ready to find your dream school?</Text>
        </View>
        {/* Score Ring */}
        <TouchableOpacity
          style={styles.scoreRing}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.85}
        >
          <Text style={styles.scoreNum}>{score}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── PROFILE COMPLETE BANNER ── */}
        {completeness < 100 && (
          <TouchableOpacity
            style={styles.completeBanner}
            onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}
            activeOpacity={0.88}
          >
            <View style={styles.completeBannerLeft}>
              <Icon name="flash" size={20} color="#FFF" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.completeBannerTitle}>Complete your profile</Text>
                <Text style={styles.completeBannerSub}>Get 3x more interview calls</Text>
              </View>
            </View>
            <View style={styles.completePill}>
              <Text style={styles.completePillText}>{completeness}%</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── STATS ROW ── */}
        <View style={styles.statsRow}>
          {[
            { icon: 'briefcase-outline', label: 'Applied', count: appliedCount, color: COLORS.primary, bg: COLORS.primaryBg, nav: 'Applications' },
            { icon: 'mic-outline', label: 'Interviews', count: interviewCount, color: '#10B981', bg: '#ECFDF5', nav: 'Applications' },
            { icon: 'ribbon', label: 'Offers', count: offersCount, color: '#F59E0B', bg: '#FFFBEB', nav: 'Applications' },
            { icon: 'trophy-outline', label: 'Tests', count: null, color: '#8B5CF6', bg: '#F3F0FF', nav: 'Profile' },
          ].map(stat => (
            <TouchableOpacity
              key={stat.label}
              style={[styles.statCard, { borderTopColor: stat.color }]}
              onPress={() => navigation.navigate(stat.nav as any)}
              activeOpacity={0.82}
            >
              <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                <Icon name={stat.icon} size={20} color={stat.color} />
              </View>
              {stat.count !== null && (
                <Text style={[styles.statCount, { color: stat.color }]}>{stat.count}</Text>
              )}
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── AI RESUME BANNER ── */}
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => navigation.navigate('Profile', { screen: 'ResumeTemplates' })}
          activeOpacity={0.88}
        >
          <View style={styles.aiIconBox}>
            <Icon name="sparkles" size={26} color="#FFF" />
          </View>
          <View style={styles.aiTextBlock}>
            <Text style={styles.aiTitle}>AI Resume Builder</Text>
            <Text style={styles.aiSub}>Create your perfect resume in 60 seconds</Text>
          </View>
          <View style={styles.aiChevron}>
            <Icon name="chevron-forward" size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* ── JOBS FOR YOU ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Jobs For You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')} style={styles.seeAllBtn}>
              <Text style={styles.seeAll}>See All</Text>
              <Icon name="chevron-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {MOCK_JOBS.map(job => (
            <TouchableOpacity
              key={job._id}
              style={styles.jobCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Jobs', { screen: 'JobDetail', params: { jobId: job._id, job } })}
            >
              {job.isFeatured && (
                <View style={styles.featuredTag}>
                  <Icon name="star" size={11} color="#92400E" />
                  <Text style={styles.featuredText}> Featured</Text>
                </View>
              )}
              <View style={styles.jobRow}>
                <View style={styles.schoolIcon}>
                  <Icon name="school" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.jobSchool}>{job.schoolId?.schoolName}</Text>
                  <View style={styles.jobMetaRow}>
                    <Icon name="location-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.jobMeta}> {job.city}  ·  </Text>
                    <Icon name="cash-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.jobMeta}> ₹{(job.salaryMin / 1000).toFixed(0)}k+/mo</Text>
                  </View>
                </View>
                <View style={styles.matchBox}>
                  <Text style={styles.matchNum}>{job.matchScore}%</Text>
                  <Text style={styles.matchLabel}>Match</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── PROFILE STRENGTH ── */}
        <View style={styles.strengthCard}>
          <View style={styles.strengthHeader}>
            <View>
              <Text style={styles.strengthTitle}>Profile Strength</Text>
              <Text style={styles.strengthSub}>Add demo video to reach 90%+</Text>
            </View>
            <Text style={[styles.strengthPct, { color: completeness >= 80 ? COLORS.success : COLORS.warning }]}>
              {completeness}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${completeness}%` as any }]} />
          </View>
          <View style={styles.strengthItems}>
            {[
              { label: 'Profile Photo', done: true },
              { label: 'Subject Tags', done: true },
              { label: 'Demo Video', done: false },
              { label: 'Skill Test', done: false },
            ].map(item => (
              <View key={item.label} style={styles.strengthItem}>
                <Icon
                  name={item.done ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={16}
                  color={item.done ? COLORS.success : COLORS.border}
                />
                <Text style={[styles.strengthItemText, !item.done && { color: COLORS.textMuted }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.boostBtn} onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}>
            <Icon name="rocket" size={16} color={COLORS.primary} />
            <Text style={styles.boostBtnText}> Boost My Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 32,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  headerLeft: { flex: 1, paddingRight: 16 },
  greeting: { fontSize: 13, color: '#FFFFFFAA', fontWeight: '500', marginBottom: 2 },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -0.5, marginBottom: 2 },
  headerSub: { fontSize: 13, color: '#FFFFFFBB' },

  scoreRing: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#FFFFFF25', borderWidth: 2.5, borderColor: '#FFFFFF60',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreNum: { fontSize: 22, fontWeight: '900', color: '#FFF', lineHeight: 26 },
  scoreLabel: { fontSize: 10, color: '#FFFFFFAA', fontWeight: '700', textTransform: 'uppercase' },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingHorizontal: SPACING.screen, paddingBottom: 24 },

  completeBanner: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
  },
  completeBannerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  completeBannerTitle: { fontSize: 14, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  completeBannerSub: { fontSize: 12, color: '#FFFFFFBB' },
  completePill: { backgroundColor: '#FFFFFF25', borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 5 },
  completePillText: { color: '#FFF', fontWeight: '800', fontSize: 13 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 12,
    borderTopWidth: 3, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  statIconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statCount: { fontSize: 18, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700', textTransform: 'uppercase' },

  aiBanner: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 20, borderWidth: 1.5, borderColor: COLORS.primary + '30',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  aiIconBox: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  aiTextBlock: { flex: 1 },
  aiTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 3 },
  aiSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  aiChevron: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },

  section: { marginBottom: 16 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginRight: 2 },

  jobCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  featuredTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF3C7', alignSelf: 'flex-start',
    borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 10,
  },
  featuredText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  schoolIcon: {
    width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  jobSchool: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  jobMetaRow: { flexDirection: 'row', alignItems: 'center' },
  jobMeta: { fontSize: 11, color: COLORS.textMuted },
  matchBox: {
    alignItems: 'center', backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.md,
  },
  matchNum: { fontSize: 15, fontWeight: '900', color: COLORS.primary },
  matchLabel: { fontSize: 9, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase' },

  strengthCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 18,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  strengthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  strengthTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  strengthSub: { fontSize: 12, color: COLORS.textSecondary },
  strengthPct: { fontSize: 18, fontWeight: '900' },
  progressTrack: { height: 6, backgroundColor: COLORS.backgroundAlt, borderRadius: 3, marginBottom: 14 },
  progressBar: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  strengthItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  strengthItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  strengthItemText: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  boostBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.lg,
    paddingVertical: 12, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  boostBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
