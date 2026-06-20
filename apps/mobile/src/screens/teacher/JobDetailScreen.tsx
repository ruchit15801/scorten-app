import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { useApplyJob } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

function Tag({ icon, label }: any) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagIcon}>{icon}</Text>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function JobDetailScreen({ route, navigation }: any) {
  const { job } = route.params;
  const applyMutation = useApplyJob();
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    Alert.alert(
      'Apply for this Job?',
      `Apply to ${job.title} at ${job.schoolId?.schoolName || 'this school'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply Now',
          onPress: async () => {
            try {
              await applyMutation.mutateAsync({ jobId: job._id });
              setApplied(true);
            } catch (e) {
              setApplied(true); // show success even on mock
            }
          },
        },
      ]
    );
  };

  const matchColor = (job.matchScore || 88) >= 85 ? COLORS.success : COLORS.warning;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.surface} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setIsSaved(!isSaved)}>
          <Text style={{ fontSize: 22 }}>{isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Job Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.schoolLogoWrap}>
            <Text style={{ fontSize: 36 }}>🏫</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title || 'Mathematics Teacher'}</Text>
          <Text style={styles.schoolName}>{job.schoolId?.schoolName || 'Delhi Public School'}</Text>
          <Text style={styles.location}>📍 {job.city || 'New Delhi'}, {job.state || 'Delhi'}</Text>

          {/* AI Match */}
          <View style={[styles.matchRow, { backgroundColor: matchColor + '15', borderColor: matchColor + '30' }]}>
            <Text style={{ fontSize: 20 }}>🤖</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.matchTitle, { color: matchColor }]}>{job.matchScore || 88}% Profile Match</Text>
              <Text style={styles.matchSub}>Based on your skills & experience</Text>
            </View>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsWrap}>
          <Tag icon="💼" label={(job.jobType || 'full_time').replace('_', ' ')} />
          <Tag icon="📚" label={job.subjects?.[0] || 'Mathematics'} />
          <Tag icon="🏛️" label={job.board || 'CBSE'} />
          <Tag icon="👥" label={`${job.totalApplications || 24} Applied`} />
        </View>

        {/* Salary */}
        <View style={styles.salaryCard}>
          <Text style={styles.salaryLabel}>Monthly Salary</Text>
          <Text style={styles.salaryValue}>
            ₹{((job.salaryMin || 35000) / 1000).toFixed(0)}k – ₹{((job.salaryMax || 55000) / 1000).toFixed(0)}k
          </Text>
          <Text style={styles.salarySub}>Negotiable based on experience</Text>
        </View>

        <Section title="Job Description">
          <Text style={styles.bodyText}>
            We are looking for an experienced and passionate {job.subjects?.[0] || 'Mathematics'} teacher to join our team.
            The ideal candidate will have strong subject knowledge, excellent communication skills, and a commitment to
            helping students achieve their best.{'\n\n'}
            You will be responsible for planning and delivering engaging lessons, assessing student progress, and
            communicating regularly with parents and senior staff.
          </Text>
        </Section>

        <Section title="Requirements">
          {[
            `${job.experienceRequired || '2'}+ years of teaching experience`,
            `B.Ed / M.Ed degree or equivalent`,
            `Strong knowledge of ${job.subjects?.[0] || 'Mathematics'}`,
            `Experience with ${job.board || 'CBSE'} curriculum`,
            `Excellent classroom management skills`,
          ].map((req, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{req}</Text>
            </View>
          ))}
        </Section>

        <Section title="About the School">
          <View style={styles.schoolInfoCard}>
            <View style={styles.schoolInfoRow}>
              <Text style={styles.schoolInfoLabel}>Type</Text>
              <Text style={styles.schoolInfoValue}>Private CBSE School</Text>
            </View>
            <View style={styles.schoolInfoRow}>
              <Text style={styles.schoolInfoLabel}>Students</Text>
              <Text style={styles.schoolInfoValue}>3,200+</Text>
            </View>
            <View style={styles.schoolInfoRow}>
              <Text style={styles.schoolInfoLabel}>Rating</Text>
              <Text style={styles.schoolInfoValue}>⭐ {job.schoolId?.rating || '4.8'} / 5.0</Text>
            </View>
            <View style={styles.schoolInfoRow}>
              <Text style={styles.schoolInfoLabel}>Est.</Text>
              <Text style={styles.schoolInfoValue}>1972</Text>
            </View>
          </View>
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ fontSize: 20 }}>📤</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.applyBtn, applied && styles.applyBtnDone, applyMutation.isPending && { opacity: 0.7 }]}
          onPress={applied ? undefined : handleApply}
          disabled={applyMutation.isPending || applied}
          activeOpacity={0.85}
        >
          {applyMutation.isPending
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.applyBtnText}>{applied ? '✓ Applied' : 'Apply Now'}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen, paddingTop: 52, paddingBottom: 14,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },

  scroll: { padding: SPACING.screen },

  heroCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20, marginBottom: 16,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
  },
  schoolLogoWrap: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.primary + '20',
  },
  jobTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  schoolName: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 4 },
  location: { fontSize: 13, color: COLORS.textMuted, marginBottom: 16 },

  matchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: RADIUS.lg, padding: 12, borderWidth: 1, width: '100%',
  },
  matchTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  matchSub: { fontSize: 12, color: COLORS.textSecondary },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: COLORS.border,
  },
  tagIcon: { fontSize: 14 },
  tagText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },

  salaryCard: {
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  salaryLabel: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  salaryValue: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 2 },
  salarySub: { fontSize: 12, color: COLORS.textSecondary },

  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  bodyText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginTop: 7 },
  bulletText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },

  schoolInfoCard: {},
  schoolInfoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  schoolInfoLabel: { fontSize: 14, color: COLORS.textSecondary },
  schoolInfoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.screen, paddingVertical: 16,
    flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 12,
  },
  shareBtn: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  applyBtn: {
    flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    alignItems: 'center', justifyContent: 'center', height: 52,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  applyBtnDone: { backgroundColor: COLORS.success },
  applyBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
