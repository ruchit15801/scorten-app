import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useMyTeacherProfile, useMyApplications, useJobs } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_JOBS = [
  { _id: '1', title: 'Senior Mathematics Teacher', city: 'New Delhi', jobType: 'full_time', salaryMin: 35000, matchScore: 95, schoolId: { schoolName: 'Delhi Public School' }, subjects: ['Mathematics'], isFeatured: true },
  { _id: '2', title: 'English & Literature Teacher', city: 'Mumbai', jobType: 'full_time', salaryMin: 40000, matchScore: 82, schoolId: { schoolName: "St. Xavier's School" }, subjects: ['English'], isFeatured: false },
  { _id: '3', title: 'Physics Teacher – JEE Focus', city: 'Kota', jobType: 'full_time', salaryMin: 50000, matchScore: 88, schoolId: { schoolName: 'Allen Career Institute' }, subjects: ['Physics'], isFeatured: true },
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.error;
  return (
    <View style={ring.wrap}>
      <View style={[ring.outer, { borderColor: color }]}>
        <View style={ring.inner}>
          <Text style={[ring.score, { color }]}>{score}</Text>
          <Text style={ring.label}>Score</Text>
        </View>
      </View>
      <Text style={ring.brand}>Scorten Score</Text>
    </View>
  );
}

const ring = StyleSheet.create({
  wrap: { alignItems: 'center' },
  outer: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 4, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 8,
  },
  inner: { alignItems: 'center' },
  score: { fontSize: 24, fontWeight: '900', lineHeight: 28 },
  label: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  brand: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, fontWeight: '600' },
});

function QuickCard({ icon, label, count, color, onPress }: any) {
  return (
    <TouchableOpacity style={[qc.card, { borderTopColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={qc.icon}>{icon}</Text>
      {count !== undefined && (
        <View style={[qc.badge, { backgroundColor: color + '20' }]}>
          <Text style={[qc.badgeNum, { color }]}>{count}</Text>
        </View>
      )}
      <Text style={qc.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const qc = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16,
    borderTopWidth: 3, gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  icon: { fontSize: 28 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  badgeNum: { fontSize: 14, fontWeight: '800' },
  label: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', lineHeight: 16 },
});

function JobCard({ job, onPress }: any) {
  return (
    <TouchableOpacity style={jc.card} onPress={onPress} activeOpacity={0.85}>
      {job.isFeatured && (
        <View style={jc.featuredBadge}><Text style={jc.featuredText}>⭐ Featured</Text></View>
      )}
      <View style={jc.row}>
        <View style={jc.schoolLogo}><Text style={{ fontSize: 22 }}>🏫</Text></View>
        <View style={jc.info}>
          <Text style={jc.title} numberOfLines={1}>{job.title}</Text>
          <Text style={jc.school}>{job.schoolId?.schoolName}</Text>
          <Text style={jc.loc}>📍 {job.city}</Text>
        </View>
        <View>
          <View style={jc.matchBadge}>
            <Text style={jc.matchText}>🤖 {job.matchScore}%</Text>
          </View>
          <Text style={jc.salary}>₹{(job.salaryMin / 1000).toFixed(0)}k+</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const jc = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  featuredBadge: { backgroundColor: '#FEF3C7', borderRadius: RADIUS.full, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, marginBottom: 10 },
  featuredText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  schoolLogo: { width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  school: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  loc: { fontSize: 12, color: COLORS.textMuted },
  matchBadge: { backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 4 },
  matchText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  salary: { fontSize: 13, fontWeight: '700', color: COLORS.primary, textAlign: 'right' },
});

export function HomeScreen({ navigation }: any) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const { data: applications } = useMyApplications();

  const score = profile?.scortenReputationScore || 72;
  const appliedCount = applications?.filter((a: any) => ['applied', 'screening'].includes(a.status))?.length ?? 3;
  const interviewCount = applications?.filter((a: any) => a.status?.includes('interview'))?.length ?? 1;
  const offersCount = applications?.filter((a: any) => a.status === 'offered')?.length ?? 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user?.firstName || 'Teacher'}</Text>
            <Text style={styles.headerSub}>Ready to find your dream school?</Text>

            {!user?.isProfileComplete && (
              <TouchableOpacity style={styles.completeBanner} onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}>
                <Text style={styles.completeBannerText}>Complete profile → 3x more views</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScoreRing score={score} />
        </View>

        {/* ── QUICK ACTIONS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <QuickCard icon="💼" label="Applied Jobs" count={appliedCount} color={COLORS.primary} onPress={() => navigation.navigate('Applications')} />
            <QuickCard icon="🎙️" label="AI Interview" count={interviewCount} color="#10B981" onPress={() => navigation.navigate('Applications')} />
            <QuickCard icon="🎉" label="Offers" count={offersCount} color="#F59E0B" onPress={() => navigation.navigate('Applications')} />
            <QuickCard icon="🏆" label="Skill Tests" color="#8B5CF6" onPress={() => navigation.navigate('Profile', { screen: 'AssessmentsList' })} />
          </View>
        </View>

        {/* ── AI RESUME BANNER ── */}
        <TouchableOpacity style={styles.aiBanner} onPress={() => navigation.navigate('Profile', { screen: 'ResumeTemplates' })} activeOpacity={0.88}>
          <Text style={styles.aiIcon}>🤖</Text>
          <View style={styles.aiTextWrap}>
            <Text style={styles.aiTitle}>AI Resume Builder</Text>
            <Text style={styles.aiSub}>Let AI craft your perfect teacher resume in seconds</Text>
          </View>
          <View style={styles.aiBtn}><Text style={styles.aiBtnText}>Try Free →</Text></View>
        </TouchableOpacity>

        {/* ── JOBS FOR YOU ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Jobs For You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {MOCK_JOBS.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onPress={() => navigation.navigate('Jobs', { screen: 'JobDetail', params: { jobId: job._id, job } })}
            />
          ))}
        </View>

        {/* ── PROFILE COMPLETENESS ── */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardHeader}>
            <Text style={styles.profileCardTitle}>Profile Strength</Text>
            <Text style={styles.profileScore}>72%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '72%' }]} />
          </View>
          <Text style={styles.profileTip}>Add your demo video to reach 90%+ and get 4x more interview calls</Text>
          <TouchableOpacity style={styles.profileAction} onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}>
            <Text style={styles.profileActionText}>Complete Profile →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primaryBg, paddingHorizontal: SPACING.screen,
    paddingTop: 56, paddingBottom: 28,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  headerLeft: { flex: 1, paddingRight: 16 },
  greeting: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500', marginBottom: 4 },
  userName: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
  completeBanner: {
    backgroundColor: COLORS.primary + '15', borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  completeBannerText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  section: { paddingHorizontal: SPACING.screen, marginTop: 24 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  aiBanner: {
    margin: SPACING.screen, marginTop: 20,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  aiIcon: { fontSize: 34 },
  aiTextWrap: { flex: 1 },
  aiTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  aiSub: { fontSize: 12, color: '#FFFFFFBB', lineHeight: 18 },
  aiBtn: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.full },
  aiBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  profileCard: {
    margin: SPACING.screen, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  profileCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  profileCardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  profileScore: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  progressBg: { height: 8, backgroundColor: COLORS.backgroundAlt, borderRadius: 4, marginBottom: 12 },
  progressFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  profileTip: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 16 },
  profileAction: { backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.lg, paddingVertical: 12, alignItems: 'center' },
  profileActionText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
