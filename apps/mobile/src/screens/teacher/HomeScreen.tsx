import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';
import { useMyTeacherProfile, useMyApplications } from '../../hooks/useQueries';

const { width } = Dimensions.get('window');

// ─── Score Ring Component ─────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  return (
    <View style={ring.container}>
      <View style={ring.outer}>
        <View style={ring.inner}>
          <Text style={ring.score}>{score}</Text>
          <Text style={ring.label}>Score</Text>
        </View>
      </View>
      <Text style={ring.brand}>Scorten Score</Text>
    </View>
  );
}

const ring = StyleSheet.create({
  container: { alignItems: 'center' },
  outer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.primaryBg,
    borderWidth: 4, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  inner: { alignItems: 'center' },
  score: { fontSize: 26, fontWeight: '800', color: COLORS.primary, lineHeight: 30 },
  label: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  brand: { fontSize: 12, color: COLORS.textMuted, marginTop: 8, fontWeight: '600' },
});

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickCard({
  icon, label, count, color, onPress,
}: { icon: string; label: string; count?: number; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[qc.card, { borderTopColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={qc.icon}>{icon}</Text>
      {count !== undefined && (
        <View style={[qc.badge, { backgroundColor: color + '20' }]}>
          <Text style={[qc.badgeText, { color }]}>{count}</Text>
        </View>
      )}
      <Text style={qc.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const qc = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    gap: 8,
  },
  icon: { fontSize: 26 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  badgeText: { fontSize: 13, fontWeight: '700' },
  label: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600', lineHeight: 18 },
});

// ─── Job Card (horizontal) ────────────────────────────────────────────────────
function JobCard({ job, onPress }: { job: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={jc.card} onPress={onPress} activeOpacity={0.85}>
      <View style={jc.top}>
        <View style={jc.schoolAvatar}>
          <Text style={{ fontSize: 22 }}>🏫</Text>
        </View>
        <View style={jc.info}>
          <Text style={jc.title} numberOfLines={1}>{job.title || 'Math Teacher - Grade 9-12'}</Text>
          <Text style={jc.school} numberOfLines={1}>{job.schoolId?.schoolName || 'Delhi Public School'}</Text>
        </View>
        <View style={jc.salaryBadge}>
          <Text style={jc.salary}>₹{((job.salaryMin || 30000) / 1000).toFixed(0)}k</Text>
        </View>
      </View>
      <View style={jc.tags}>
        <View style={jc.tag}><Text style={jc.tagText}>📍 {job.city || 'New Delhi'}</Text></View>
        <View style={jc.tag}><Text style={jc.tagText}>💼 {job.jobType?.replace('_', ' ') || 'Full Time'}</Text></View>
        <View style={jc.tag}><Text style={jc.tagText}>📚 {job.subjects?.[0] || 'Mathematics'}</Text></View>
      </View>
    </TouchableOpacity>
  );
}

const jc = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  schoolAvatar: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  school: { fontSize: 13, color: COLORS.textSecondary },
  salaryBadge: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  salary: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  tagText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
});

// ─── Main Home Screen ─────────────────────────────────────────────────────────
const MOCK_JOBS = [
  { _id: '1', title: 'Mathematics Teacher', subjects: ['Mathematics'], city: 'New Delhi', jobType: 'full_time', salaryMin: 35000, schoolId: { schoolName: 'Delhi Public School' } },
  { _id: '2', title: 'English Teacher - Secondary', subjects: ['English'], city: 'Mumbai', jobType: 'full_time', salaryMin: 40000, schoolId: { schoolName: 'St. Xavier\'s School' } },
  { _id: '3', title: 'Science Teacher - Gr. 8-10', subjects: ['Science'], city: 'Bangalore', jobType: 'part_time', salaryMin: 28000, schoolId: { schoolName: 'Kendriya Vidyalaya' } },
];

export function HomeScreen({ navigation }: any) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const { data: applications } = useMyApplications();

  const score = profile?.scortenReputationScore || 72;
  const appliedCount = applications?.filter((a: any) => a.status === 'applied')?.length || 0;
  const interviewCount = applications?.filter((a: any) => a.status?.includes('interview'))?.length || 0;

  const firstName = user?.firstName || 'Teacher';

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.name}>{firstName}</Text>
            <Text style={styles.subtext}>Ready to find your dream school?</Text>
          </View>

          {/* Score Ring */}
          <ScoreRing score={score} />
        </View>

        {/* ─── Profile Completion Banner ─────────────────────────────────── */}
        {!user?.isProfileComplete && (
          <TouchableOpacity
            style={styles.completionBanner}
            onPress={() => navigation.navigate('OnboardingStep1')}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.bannerTitle}>Complete your profile</Text>
              <Text style={styles.bannerSub}>Get 3x more job views with a complete profile</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>60%</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ─── Quick Actions ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <QuickCard
              icon="💼" label="Applied Jobs" count={appliedCount}
              color={COLORS.primary}
              onPress={() => navigation.navigate('Applications')}
            />
            <QuickCard
              icon="🤖" label="AI Interview" count={interviewCount}
              color="#10B981"
              onPress={() => navigation.navigate('Applications', { screen: 'AIInterview' })}
            />
            <QuickCard
              icon="📝" label="Build Resume"
              color="#F59E0B"
              onPress={() => navigation.navigate('Profile', { screen: 'ResumeBuilder' })}
            />
            <QuickCard
              icon="🎓" label="Skill Tests"
              color="#8B5CF6"
              onPress={() => navigation.navigate('Profile', { screen: 'SkillTests' })}
            />
          </View>
        </View>

        {/* ─── Featured Jobs ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jobs For You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {MOCK_JOBS.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onPress={() => navigation.navigate('Jobs', {
                screen: 'JobDetail',
                params: { jobId: job._id },
              })}
            />
          ))}
        </View>

        {/* ─── AI Features Banner ────────────────────────────────────────── */}
        <View style={styles.aiBanner}>
          <Text style={styles.aiIcon}>🤖</Text>
          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>Try AI Resume Builder</Text>
            <Text style={styles.aiSub}>Let AI create your perfect teacher resume</Text>
          </View>
          <TouchableOpacity
            style={styles.aiBtn}
            onPress={() => navigation.navigate('Profile', { screen: 'ResumeBuilder' })}
          >
            <Text style={styles.aiBtnText}>Try Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: SPACING.screen,
    paddingTop: 56,
    paddingBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerLeft: { flex: 1, paddingRight: 20 },
  greeting: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtext: { fontSize: 13, color: COLORS.textSecondary },

  completionBanner: {
    margin: SPACING.screen,
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '30',
    borderStyle: 'dashed',
  },
  bannerTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  bannerSub: { fontSize: 13, color: COLORS.textSecondary },
  progressCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primaryBg,
    borderWidth: 3, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  progressText: { fontSize: 13, fontWeight: '800', color: COLORS.primary },

  section: {
    paddingHorizontal: SPACING.screen,
    marginTop: 24,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    marginBottom: 4,
  },

  aiBanner: {
    margin: SPACING.screen,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  aiIcon: { fontSize: 32 },
  aiText: { flex: 1 },
  aiTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  aiSub: { fontSize: 13, color: '#FFFFFF99' },
  aiBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  aiBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
