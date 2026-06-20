import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function ApplicationDetailScreen({ navigation, route }: any) {
  const { app } = route.params || {};
  const job = app?.jobId || {};

  const statusConfig: any = {
    applied: { label: 'Application Submitted', color: '#6366F1', icon: '📩', bg: '#EEF2FF' },
    screening: { label: 'AI Screening in Progress', color: '#8B5CF6', icon: '🤖', bg: '#F3F0FF' },
    interview_scheduled: { label: 'Interview Scheduled', color: '#10B981', icon: '🎙️', bg: '#ECFDF5' },
    interview_completed: { label: 'Interview Completed', color: COLORS.primary, icon: '✅', bg: COLORS.primaryBg },
    offered: { label: 'Offer Received 🎉', color: COLORS.success, icon: '🎊', bg: COLORS.successBg },
    rejected: { label: 'Not Selected', color: COLORS.error, icon: '❌', bg: COLORS.errorBg },
  };

  const status = statusConfig[app?.status] || statusConfig.applied;

  const TIMELINE = [
    { icon: '📩', label: 'Applied', done: true, date: 'Jun 15, 2025' },
    { icon: '🤖', label: 'AI Screening', done: ['screening', 'interview_scheduled', 'interview_completed', 'offered'].includes(app?.status), date: 'Jun 16, 2025' },
    { icon: '🎙️', label: 'Interview', done: ['interview_completed', 'offered'].includes(app?.status), date: app?.status === 'interview_scheduled' ? 'Today, 3:00 PM' : '—' },
    { icon: '🎉', label: 'Offer', done: app?.status === 'offered', date: '—' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backCircle}><Text style={styles.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <Text style={styles.title}>Application Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Job Info Card */}
        <View style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <View style={styles.schoolLogo}>
              <Text style={{ fontSize: 30 }}>🏫</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>{job.title || 'Mathematics Teacher'}</Text>
              <Text style={styles.schoolName}>{job?.schoolId?.schoolName || 'Delhi Public School'}</Text>
              <Text style={styles.location}>📍 {job.city || 'New Delhi'}</Text>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}><Text style={styles.tagText}>💼 {(job.jobType || 'full_time').replace('_', ' ')}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>₹ {((job.salaryMin || 35000) / 1000).toFixed(0)}k - {((job.salaryMax || 50000) / 1000).toFixed(0)}k/mo</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>📚 {job.subjects?.[0] || 'Mathematics'}</Text></View>
          </View>
        </View>

        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: status.bg, borderColor: status.color + '30' }]}>
          <Text style={{ fontSize: 28, marginRight: 12 }}>{status.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, { color: status.color }]}>{status.label}</Text>
            <Text style={styles.statusSub}>Updated Jun 20, 2025</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Timeline</Text>
          {TIMELINE.map((step, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineLine}>
                <View style={[styles.timelineDot, step.done && styles.timelineDotDone]}>
                  <Text style={{ fontSize: 12 }}>{step.done ? '✓' : ''}</Text>
                </View>
                {i < TIMELINE.length - 1 && (
                  <View style={[styles.timelineConnector, step.done && styles.timelineConnectorDone]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineLabel, step.done && { color: COLORS.text }]}>
                  {step.icon} {step.label}
                </Text>
                <Text style={styles.timelineDate}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        {app?.status === 'interview_scheduled' && (
          <TouchableOpacity style={styles.primaryAction} onPress={() => navigation.navigate('AIInterview')}>
            <Text style={styles.primaryActionIcon}>🎙️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryActionTitle}>Start AI Interview</Text>
              <Text style={styles.primaryActionSub}>Ready when you are. Average time: 20 min</Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 18 }}>→</Text>
          </TouchableOpacity>
        )}

        {app?.status === 'offered' && (
          <View style={styles.offerCard}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>🎉</Text>
            <Text style={styles.offerTitle}>Congratulations! You received an offer.</Text>
            <Text style={styles.offerSub}>Please respond within 3 days.</Text>
            <View style={styles.offerBtns}>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={styles.acceptBtnText}>Accept Offer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineBtn}>
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: {},
  backCircle: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  scroll: { padding: SPACING.screen },

  jobCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  jobHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  schoolLogo: {
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center',
  },
  jobTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  schoolName: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 2 },
  location: { fontSize: 13, color: COLORS.textMuted },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },

  statusBanner: {
    flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.xl, padding: 16,
    marginBottom: 20, borderWidth: 1,
  },
  statusTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  statusSub: { fontSize: 13, color: COLORS.textSecondary },

  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 20 },

  timelineRow: { flexDirection: 'row', marginBottom: 8 },
  timelineLine: { alignItems: 'center', marginRight: 16 },
  timelineDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.backgroundAlt, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timelineConnector: { width: 2, height: 32, backgroundColor: COLORS.border, marginTop: 4 },
  timelineConnectorDone: { backgroundColor: COLORS.primary },
  timelineContent: { flex: 1, paddingBottom: 28 },
  timelineLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 2 },
  timelineDate: { fontSize: 12, color: COLORS.textMuted },

  primaryAction: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 20, marginBottom: 20, gap: 16,
  },
  primaryActionIcon: { fontSize: 28 },
  primaryActionTitle: { fontSize: 17, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  primaryActionSub: { fontSize: 13, color: '#FFFFFF99' },

  offerCard: {
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.xl, padding: 24,
    alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.success + '30',
  },
  offerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.successDark, textAlign: 'center', marginBottom: 4 },
  offerSub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  offerBtns: { flexDirection: 'row', gap: 12 },
  acceptBtn: { flex: 1, backgroundColor: COLORS.success, borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: 'center' },
  acceptBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  declineBtn: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  declineBtnText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 15 },
});
