import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { useApplyJob } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

function InfoRow({ icon, label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={16} color={COLORS.textMuted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function JobDetailScreen({ route, navigation }: any) {
  const { job } = route.params;
  const applyMutation = useApplyJob();
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const matchScore = job.matchScore || 88;
  const matchColor = matchScore >= 85 ? COLORS.success : matchScore >= 70 ? COLORS.warning : COLORS.error;

  const handleApply = () => {
    Alert.alert('Apply for this Job?',
      `Apply to ${job.title} at ${job.schoolId?.schoolName || 'this school'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '🚀 Apply Now', onPress: async () => {
          try { await applyMutation.mutateAsync({ jobId: job._id }); } catch (e) {}
          setApplied(true);
        }},
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.surface} barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setIsSaved(!isSaved)}>
          <Icon name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? '#EF4444' : COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HERO */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Icon name="school" size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.heroTitle}>{job.title || 'Mathematics Teacher'}</Text>
          <Text style={styles.heroSchool}>{job.schoolId?.schoolName || 'Delhi Public School'}</Text>
          <View style={styles.heroMeta}>
            <Icon name="location-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.heroMetaText}> {job.city || 'New Delhi'}</Text>
            <Text style={styles.dot}> · </Text>
            <Icon name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.heroMetaText}> {job.jobType?.replace('_', ' ') || 'Full Time'}</Text>
          </View>

          {/* Match Score */}
          <View style={[styles.matchRow, { backgroundColor: matchColor + '12', borderColor: matchColor + '30' }]}>
            <View style={[styles.matchDot, { backgroundColor: matchColor }]} />
            <Text style={[styles.matchTitle, { color: matchColor }]}>🤖 {matchScore}% Profile Match</Text>
            <Text style={[styles.matchSub, { color: matchColor + 'AA' }]}>AI-powered analysis</Text>
          </View>
        </View>

        {/* SALARY + QUICK INFO */}
        <View style={styles.salaryCard}>
          <View style={styles.salaryLeft}>
            <Text style={styles.salaryLabel}>Monthly Salary</Text>
            <Text style={styles.salaryValue}>
              ₹{((job.salaryMin || 35000) / 1000).toFixed(0)}k – ₹{((job.salaryMax || 55000) / 1000).toFixed(0)}k
            </Text>
            <Text style={styles.salarySub}>Negotiable · CBSE Board</Text>
          </View>
          <View style={styles.salaryRight}>
            <Icon name="cash" size={36} color={COLORS.primary} style={{ opacity: 0.5 }} />
          </View>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Job Details</Text>
          <InfoRow icon="briefcase-outline" label="Type" value={(job.jobType || 'full_time').replace('_', ' ')} />
          <InfoRow icon="book-outline" label="Subject" value={job.subjects?.[0] || 'Mathematics'} />
          <InfoRow icon="school-outline" label="Board" value={job.board || 'CBSE'} />
          <InfoRow icon="time-outline" label="Experience" value={`${job.experienceRequired || '2'}+ years`} />
          <InfoRow icon="people-outline" label="Applicants" value={`${job.totalApplications || 24} applied`} />
        </View>

        {/* DESCRIPTION */}
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.bodyText}>
            We are looking for an experienced and passionate {job.subjects?.[0] || 'Mathematics'} teacher to join our team.
            {'\n\n'}The ideal candidate will have strong subject knowledge, excellent communication skills, and a commitment to student success. You will plan engaging lessons, assess student progress, and collaborate with parents and staff.
          </Text>
        </View>

        {/* REQUIREMENTS */}
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Requirements</Text>
          {[
            `${job.experienceRequired || '2'}+ years teaching experience`,
            'B.Ed / M.Ed degree or equivalent',
            `Strong ${job.subjects?.[0] || 'subject'} knowledge`,
            `${job.board || 'CBSE'} curriculum experience`,
            'Excellent classroom management',
          ].map((r, i) => (
            <View key={i} style={styles.reqRow}>
              <View style={styles.reqDot}>
                <Icon name="checkmark-circle" size={16} color={COLORS.success} />
              </View>
              <Text style={styles.reqText}>{r}</Text>
            </View>
          ))}
        </View>

        {/* SCHOOL INFO */}
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>About the School</Text>
          {[
            { icon: 'school-outline', label: 'Type', value: 'Private CBSE School' },
            { icon: 'people-outline', label: 'Students', value: '3,200+' },
            { icon: 'star', label: 'Rating', value: `${job.schoolId?.rating || 4.8} / 5.0` },
            { icon: 'calendar-outline', label: 'Established', value: '1972' },
          ].map(item => (
            <InfoRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shareBtn}>
          <Icon name="share-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.applyBtn, applied && styles.applyBtnDone]}
          onPress={applied ? undefined : handleApply}
          disabled={applyMutation.isPending || applied}
          activeOpacity={0.87}
        >
          {applyMutation.isPending
            ? <ActivityIndicator color="#FFF" />
            : <>
                <Icon name={applied ? 'checkmark-circle' : 'rocket'} size={20} color="#FFF" />
                <Text style={styles.applyBtnText}>{applied ? ' Applied!' : ' Apply Now'}</Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen, paddingTop: 52, paddingBottom: 14,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },

  scroll: { padding: SPACING.screen },

  heroCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20,
    alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 22, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.primary + '20',
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 4 },
  heroSchool: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroMetaText: { fontSize: 13, color: COLORS.textMuted },
  dot: { color: COLORS.textMuted, fontSize: 16 },
  matchRow: {
    flexDirection: 'row', alignItems: 'center', width: '100%',
    borderRadius: RADIUS.lg, padding: 12, borderWidth: 1,
    gap: 10,
  },
  matchDot: { width: 8, height: 8, borderRadius: 4 },
  matchTitle: { fontSize: 14, fontWeight: '800', flex: 1 },
  matchSub: { fontSize: 11 },

  salaryCard: {
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  salaryLeft: {},
  salaryRight: {},
  salaryLabel: { fontSize: 12, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  salaryValue: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 3 },
  salarySub: { fontSize: 12, color: COLORS.textSecondary },

  detailCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 14 },

  infoRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10,
  },
  infoLabel: { width: 90, fontSize: 13, color: COLORS.textSecondary },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text },

  bodyText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  reqRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  reqDot: {},
  reqText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginTop: 1 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.screen, paddingVertical: 14,
    flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 12,
  },
  shareBtn: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  applyBtn: {
    flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, height: 52,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  applyBtnDone: { backgroundColor: COLORS.success },
  applyBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
