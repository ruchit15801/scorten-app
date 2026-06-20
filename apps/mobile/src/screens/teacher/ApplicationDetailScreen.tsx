import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { useRespondToOffer } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const STATUS_CFG: any = {
  applied:             { label: 'Application Submitted',    color: COLORS.primary, icon: 'document-text-outline', bg: COLORS.primaryBg },
  screening:           { label: 'AI Screening in Progress', color: '#8B5CF6',       icon: 'sparkles',             bg: '#F3F0FF' },
  interview_scheduled: { label: 'Interview Scheduled',      color: COLORS.success,  icon: 'mic-outline',          bg: COLORS.successBg },
  interview_completed: { label: 'Interview Completed',      color: COLORS.primary,  icon: 'eye-outline',          bg: COLORS.primaryBg },
  offered:             { label: 'Offer Received! 🎉',       color: COLORS.success,  icon: 'ribbon',               bg: COLORS.successBg },
  rejected:            { label: 'Not Selected',             color: COLORS.error,    icon: 'close-circle',         bg: COLORS.errorBg },
};

const MOCK_APP = {
  _id: '1',
  status: 'interview_scheduled',
  createdAt: new Date().toISOString(),
  jobId: {
    title: 'Senior Mathematics Teacher',
    city: 'New Delhi',
    jobType: 'full_time',
    salaryMin: 35000,
    salaryMax: 55000,
    subjects: ['Mathematics'],
    board: 'CBSE',
    schoolId: { schoolName: 'Delhi Public School', rating: 4.8 },
  },
};

export function ApplicationDetailScreen({ navigation, route }: any) {
  const app = route.params?.application || MOCK_APP;
  const job = app.jobId || {};
  const offerMutation = useRespondToOffer();
  const cfg = STATUS_CFG[app.status] || STATUS_CFG.applied;

  const TIMELINE = [
    { icon: 'document-text-outline', label: 'Applied',       done: true, date: 'Jun 15' },
    { icon: 'sparkles',              label: 'AI Screening',  done: ['screening','interview_scheduled','interview_completed','offered'].includes(app.status), date: 'Jun 16' },
    { icon: 'mic-outline',           label: 'Interview',     done: ['interview_completed','offered'].includes(app.status), date: app.status === 'interview_scheduled' ? 'Today, 3:00 PM' : '—' },
    { icon: 'ribbon',                label: 'Offer',         done: app.status === 'offered', date: '—' },
  ];

  const handleOffer = (action: 'accept' | 'reject') => {
    Alert.alert(action === 'accept' ? 'Accept Offer?' : 'Decline Offer?',
      action === 'accept' ? 'This will notify the school you are accepting.' : 'Are you sure you want to decline?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'accept' ? '✅ Accept' : 'Decline',
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: async () => {
            try { await offerMutation.mutateAsync({ id: app._id, action }); } catch {}
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Job Hero Card */}
        <View style={styles.jobCard}>
          <View style={styles.jobIconBox}>
            <Icon name="school" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.jobTitle}>{job.title || 'Mathematics Teacher'}</Text>
          <Text style={styles.schoolName}>{job.schoolId?.schoolName || 'Delhi Public School'}</Text>
          <View style={styles.jobMetaRow}>
            <Icon name="location-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.jobMeta}> {job.city || 'New Delhi'}</Text>
            <Text style={styles.metaDot}> · </Text>
            <Icon name="star" size={13} color="#F59E0B" />
            <Text style={styles.jobMeta}> {job.schoolId?.rating || 4.8}</Text>
          </View>
          <View style={styles.tagsRow}>
            {[
              { icon: 'briefcase-outline', text: (job.jobType || 'full_time').replace('_', ' ') },
              { icon: 'cash-outline',      text: `₹${((job.salaryMin || 35000)/1000).toFixed(0)}k–₹${((job.salaryMax || 55000)/1000).toFixed(0)}k` },
              { icon: 'book-outline',      text: job.subjects?.[0] || 'Mathematics' },
            ].map(tag => (
              <View key={tag.text} style={styles.tag}>
                <Icon name={tag.icon} size={12} color={COLORS.textSecondary} />
                <Text style={styles.tagText}> {tag.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: cfg.bg, borderColor: cfg.color + '30' }]}>
          <View style={[styles.statusIconBox, { backgroundColor: cfg.color + '20' }]}>
            <Icon name={cfg.icon} size={22} color={cfg.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, { color: cfg.color }]}>{cfg.label}</Text>
            <Text style={styles.statusDate}>Updated {new Date(app.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Application Journey</Text>
          {TIMELINE.map((step, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, step.done && styles.timelineDotDone]}>
                  <Icon name={step.done ? 'checkmark' : step.icon} size={13} color={step.done ? '#FFF' : COLORS.textMuted} />
                </View>
                {i < TIMELINE.length - 1 && (
                  <View style={[styles.connector, step.done && styles.connectorDone]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineLabel, step.done && styles.timelineLabelDone]}>{step.label}</Text>
                <Text style={styles.timelineDate}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions based on status */}
        {app.status === 'interview_scheduled' && (
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AIInterview')}>
            <View style={styles.actionIcon}>
              <Icon name="mic" size={28} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Start AI Interview</Text>
              <Text style={styles.actionSub}>Complete 5 video questions · ~15 minutes</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#FFFFFF80" />
          </TouchableOpacity>
        )}

        {app.status === 'offered' && (
          <View style={styles.offerCard}>
            <Icon name="ribbon" size={44} color={COLORS.success} />
            <Text style={styles.offerTitle}>Congratulations!</Text>
            <Text style={styles.offerSub}>You have received an offer. Please respond within 3 days.</Text>
            <View style={styles.offerBtns}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleOffer('reject')}>
                <Text style={styles.rejectBtnText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => handleOffer('accept')}>
                <Icon name="checkmark-circle" size={18} color="#FFF" />
                <Text style={styles.acceptBtnText}> Accept Offer</Text>
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
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#FFF', marginRight: 40 },

  scroll: { padding: SPACING.screen },

  jobCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20, marginBottom: 14,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
  },
  jobIconBox: {
    width: 72, height: 72, borderRadius: 22, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.primary + '25',
  },
  jobTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 4 },
  schoolName: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  jobMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  jobMeta: { fontSize: 13, color: COLORS.textMuted },
  metaDot: { color: COLORS.textMuted },
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  tag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  tagText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: RADIUS.xl, padding: 14, marginBottom: 14, borderWidth: 1.5,
  },
  statusIconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statusTitle: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  statusDate: { fontSize: 12, color: COLORS.textSecondary },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 16 },

  timelineRow: { flexDirection: 'row', marginBottom: 4 },
  timelineLeft: { alignItems: 'center', width: 40, marginRight: 14 },
  timelineDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.backgroundAlt, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  connector: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 3 },
  connectorDone: { backgroundColor: COLORS.primary },
  timelineContent: { flex: 1, paddingBottom: 24, paddingTop: 4 },
  timelineLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted, marginBottom: 2 },
  timelineLabelDone: { color: COLORS.text, fontWeight: '700' },
  timelineDate: { fontSize: 12, color: COLORS.textMuted },

  actionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 20, marginBottom: 14,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  actionIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  actionSub: { fontSize: 12, color: '#FFFFFFBB' },

  offerCard: {
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.xl, padding: 24,
    alignItems: 'center', gap: 12, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.success + '30',
  },
  offerTitle: { fontSize: 22, fontWeight: '900', color: COLORS.successDark },
  offerSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' },
  offerBtns: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 4 },
  rejectBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  rejectBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.textSecondary },
  acceptBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.success, borderRadius: RADIUS.xl, paddingVertical: 14,
    shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  acceptBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});
