import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function CandidateProfileScreen({ navigation, route }: any) {
  const candidate = route.params?.candidate || {
    name: 'Priya Sharma', role: 'Senior Mathematics Teacher',
    exp: '5 yrs', city: 'New Delhi', board: 'CBSE', score: 94,
    education: 'M.Sc Mathematics, B.Ed – Gujarat University',
    subjects: ['Mathematics', 'Statistics'],
    languages: ['English', 'Hindi', 'Gujarati'],
  };

  const scoreColor = candidate.score >= 85 ? COLORS.success : candidate.score >= 70 ? '#F59E0B' : COLORS.error;
  const scoreLabel = candidate.score >= 85 ? 'Excellent' : candidate.score >= 70 ? 'Good' : 'Average';

  const handleShortlist = () => Alert.alert('✅ Shortlisted', `${candidate.name} has been shortlisted.`);
  const handleScheduleInterview = () => Alert.alert('🎙️ Interview Scheduled', `AI interview link sent to ${candidate.name}.`);
  const handleReject = () =>
    Alert.alert('Reject Candidate', `Are you sure you want to reject ${candidate.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => navigation.goBack() },
    ]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidate Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={{ fontSize: 20 }}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 44 }}>👩‍🏫</Text>
            </View>
          </View>
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.role}>{candidate.role}</Text>
          <Text style={styles.meta}>📍 {candidate.city || candidate.location} · {candidate.exp}</Text>

          {/* Action buttons */}
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.msgBtn} onPress={() => navigation.navigate('Messages')}>
              <Text style={styles.msgBtnText}>💬 Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resumeBtn}>
              <Text style={styles.resumeBtnText}>📄 Resume</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Score */}
        <View style={[styles.scoreCard, { borderColor: scoreColor + '30', backgroundColor: scoreColor + '08' }]}>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreNum, { color: scoreColor }]}>{candidate.score}</Text>
            <Text style={[styles.scoreOutOf, { color: scoreColor }]}>/100</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={[styles.scoreTitle, { color: scoreColor }]}>🤖 AI Assessment Score</Text>
            <Text style={styles.scoreGrade}>{scoreLabel} Match for this Role</Text>
            <View style={styles.scoreBars}>
              {[
                { label: 'Subject Knowledge', val: 96 },
                { label: 'Communication', val: 88 },
                { label: 'Experience', val: 82 },
              ].map(bar => (
                <View key={bar.label} style={styles.scoreBarRow}>
                  <Text style={styles.scoreBarLabel}>{bar.label}</Text>
                  <View style={styles.scoreBarBg}>
                    <View style={[styles.scoreBarFill, { width: `${bar.val}%`, backgroundColor: scoreColor }]} />
                  </View>
                  <Text style={[styles.scoreBarVal, { color: scoreColor }]}>{bar.val}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Teaching Details</Text>
          {[
            { icon: '📚', label: 'Subjects', value: (candidate.subjects || ['Mathematics']).join(', ') },
            { icon: '🏛️', label: 'Board', value: candidate.board || 'CBSE' },
            { icon: '🎓', label: 'Education', value: candidate.education || 'B.Ed, M.Sc Mathematics' },
            { icon: '⏳', label: 'Experience', value: candidate.exp || '5 Years' },
            { icon: '🗣️', label: 'Languages', value: (candidate.languages || ['English', 'Hindi']).join(', ') },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>{item.icon}</Text>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* AI Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.cardTitle}>🤖 AI Insights</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>✅ Strengths</Text>
            {['Deep subject knowledge in Mathematics', 'Excellent communication skills', '5+ years in CBSE curriculum'].map((s, i) => (
              <Text key={i} style={styles.insightItem}>• {s}</Text>
            ))}
          </View>
          <View style={[styles.insightBox, { backgroundColor: COLORS.warningBg || '#FFFBEB', borderColor: COLORS.warning + '30' }]}>
            <Text style={[styles.insightTitle, { color: COLORS.warning }]}>⚠️ Consider Asking About</Text>
            {['Online teaching experience', 'JEE/Competitive exam prep'].map((s, i) => (
              <Text key={i} style={[styles.insightItem, { color: '#92400E' }]}>• {s}</Text>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
          <Text style={styles.rejectBtnText}>✗ Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interviewBtn} onPress={handleScheduleInterview}>
          <Text style={styles.interviewBtnText}>🎙️ AI Interview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortlistBtn} onPress={handleShortlist}>
          <Text style={styles.shortlistBtnText}>✓ Shortlist</Text>
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
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 24,
    alignItems: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
  },
  avatarWrap: { marginBottom: 14 },
  avatar: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.primary + '30',
  },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  role: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  meta: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  heroActions: { flexDirection: 'row', gap: 12, width: '100%' },
  msgBtn: {
    flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingVertical: 13, alignItems: 'center',
  },
  msgBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  resumeBtn: {
    flex: 1, backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.xl,
    paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  resumeBtnText: { color: COLORS.text, fontWeight: '700', fontSize: 15 },

  scoreCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 16, borderRadius: RADIUS.xl,
    padding: 16, marginBottom: 16, borderWidth: 1.5,
  },
  scoreCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  scoreNum: { fontSize: 22, fontWeight: '900' },
  scoreOutOf: { fontSize: 11, fontWeight: '600' },
  scoreInfo: { flex: 1 },
  scoreTitle: { fontSize: 13, fontWeight: '800', marginBottom: 2 },
  scoreGrade: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 },
  scoreBars: { gap: 6 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreBarLabel: { fontSize: 11, color: COLORS.textMuted, width: 100 },
  scoreBarBg: { flex: 1, height: 4, backgroundColor: COLORS.backgroundAlt, borderRadius: 2 },
  scoreBarFill: { height: 4, borderRadius: 2 },
  scoreBarVal: { fontSize: 11, fontWeight: '700', width: 24, textAlign: 'right' },

  detailCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 18,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  detailLabel: { width: 90, fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  detailValue: { flex: 1, fontSize: 13, color: COLORS.text, fontWeight: '600' },

  insightCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 18,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, gap: 12,
  },
  insightBox: {
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.lg, padding: 12,
    borderWidth: 1, borderColor: COLORS.success + '30',
  },
  insightTitle: { fontSize: 13, fontWeight: '800', color: COLORS.successDark, marginBottom: 8 },
  insightItem: { fontSize: 13, color: COLORS.successDark, lineHeight: 20 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.screen,
    paddingVertical: 14, flexDirection: 'row', gap: 10,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  rejectBtn: {
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: RADIUS.xl,
    backgroundColor: COLORS.errorBg, borderWidth: 1, borderColor: COLORS.error + '30',
    alignItems: 'center', justifyContent: 'center',
  },
  rejectBtnText: { color: COLORS.error, fontWeight: '700', fontSize: 14 },
  interviewBtn: {
    flex: 1, backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  interviewBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  shortlistBtn: {
    flex: 1, backgroundColor: COLORS.success, borderRadius: RADIUS.xl,
    paddingVertical: 14, alignItems: 'center',
    shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  shortlistBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});
