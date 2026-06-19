import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Dimensions, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { useApplyJob } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

function Tag({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagIcon}>{icon}</Text>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

export function JobDetailScreen({ route, navigation }: any) {
  const { job } = route.params;
  const dispatch = useDispatch();
  const applyMutation = useApplyJob();
  const [isSaved, setIsSaved] = useState(false);

  const handleApply = async () => {
    await applyMutation.mutateAsync({ jobId: job._id });
    navigation.navigate('Applications');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backCircle}><Text style={styles.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={styles.backBtn}>
          <View style={styles.backCircle}>
            <Text style={{ fontSize: 20 }}>{isSaved ? '❤️' : '🤍'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ─── Job Hero ────────────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.schoolLogo}>
            <Text style={{ fontSize: 36 }}>🏫</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.schoolName}>{job.schoolId?.schoolName}</Text>
          <Text style={styles.location}>📍 {job.city}, {job.state}</Text>

          <View style={styles.salaryBadge}>
            <Text style={styles.salaryText}>
              ₹{(job.salaryMin / 1000).toFixed(0)}k – ₹{(job.salaryMax / 1000).toFixed(0)}k <Text style={styles.salaryPeriod}>/ month</Text>
            </Text>
          </View>

          {/* AI Match Score Banner */}
          <LinearGradient
            colors={[COLORS.primaryBg, COLORS.backgroundAlt]}
            style={styles.aiMatchBox}
          >
            <View style={styles.aiIconBox}><Text style={styles.aiIcon}>🤖</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiMatchTitle}>Excellent Match</Text>
              <Text style={styles.aiMatchSub}>Your profile matches 92% of the requirements.</Text>
            </View>
          </LinearGradient>
        </View>

        {/* ─── Tags Grid ───────────────────────────────────────────────────── */}
        <View style={styles.tagsGrid}>
          <Tag icon="💼" label={job.jobType?.replace('_', ' ')} />
          <Tag icon="📚" label={job.subjects?.join(', ')} />
          <Tag icon="🎓" label="B.Ed Required" />
          <Tag icon="⏱️" label="Min. 3 Yrs Exp." />
        </View>

        {/* ─── Description ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>
            We are looking for an experienced and passionate {job.title} to join our faculty at {job.schoolId?.schoolName}. 
            The ideal candidate should have a deep understanding of the subject matter and the ability to inspire students.
            {'\n\n'}
            You will be responsible for preparing lesson plans, evaluating student performance, and creating an engaging learning environment.
          </Text>
        </View>

        {/* ─── Requirements ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {[
            'Bachelor’s degree in Education or relevant subject.',
            'Minimum 3 years of teaching experience.',
            'Excellent communication and presentation skills.',
            'Familiarity with modern teaching methods and technology.',
          ].map((req, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ─── Fixed Apply Bottom Bar ──────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.applyBtn, applyMutation.isPending && styles.btnDisabled]}
          activeOpacity={0.85}
          onPress={handleApply}
          disabled={applyMutation.isPending}
        >
          {applyMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.applyBtnText}>Apply Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen,
    paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.primaryBg,
  },
  backBtn: {},
  backCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  scroll: { paddingBottom: 100 },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: RADIUS['2xl'], borderBottomRightRadius: RADIUS['2xl'],
    padding: SPACING.screen,
    paddingTop: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
    marginBottom: 20,
  },
  schoolLogo: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  jobTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 4 },
  schoolName: { fontSize: 16, color: COLORS.primary, fontWeight: '600', marginBottom: 6 },
  location: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 },
  
  salaryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full, marginBottom: 20,
  },
  salaryText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  salaryPeriod: { fontSize: 13, fontWeight: '500', opacity: 0.8 },

  aiMatchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: RADIUS.xl, width: '100%',
    borderWidth: 1, borderColor: COLORS.border,
  },
  aiIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  aiIcon: { fontSize: 24 },
  aiMatchTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  aiMatchSub: { fontSize: 12, color: COLORS.textSecondary },

  tagsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    paddingHorizontal: SPACING.screen, marginBottom: 24,
  },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  tagIcon: { fontSize: 16 },
  tagText: { fontSize: 13, fontWeight: '600', color: COLORS.text, textTransform: 'capitalize' },

  section: { paddingHorizontal: SPACING.screen, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },
  
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginTop: 8 },
  bulletText: { flex: 1, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screen, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 10,
  },
  applyBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingVertical: 18, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.7 },
  applyBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
