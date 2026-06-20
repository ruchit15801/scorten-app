import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function CandidateProfileScreen({ navigation, route }: any) {
  const c = route.params?.candidate || {
    name: 'Priya Sharma', role: 'Senior Mathematics Teacher',
    exp: '5 yrs', city: 'New Delhi', board: 'CBSE', score: 94,
    education: 'M.Sc Mathematics, B.Ed – DU', subjects: ['Mathematics', 'Statistics'], languages: ['English', 'Hindi'],
  };

  const scoreColor = c.score >= 85 ? COLORS.success : c.score >= 70 ? COLORS.warning : COLORS.error;
  const scoreLabel = c.score >= 85 ? 'Excellent' : c.score >= 70 ? 'Good' : 'Average';

  const BARS = [
    { label: 'Subject Knowledge', val: 96 },
    { label: 'Communication', val: 88 },
    { label: 'Experience Match', val: 82 },
    { label: 'Cultural Fit', val: 91 },
  ];

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* ── HERO HEADER ── */}
      <View style={styles.heroHeader}>
        <View style={styles.heroHeaderNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Icon name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.heroHeaderTitle}>Candidate Profile</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="share-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroRow}>
          <View style={styles.avatar}>
            <Icon name="person" size={44} color={COLORS.primary} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{c.name}</Text>
            <Text style={styles.heroRole}>{c.role}</Text>
            <View style={styles.heroMeta}>
              <Icon name="location-outline" size={13} color="#FFFFFFAA" />
              <Text style={styles.heroMetaText}> {c.city || c.location}</Text>
              <Text style={styles.heroDot}> · </Text>
              <Icon name="time-outline" size={13} color="#FFFFFFAA" />
              <Text style={styles.heroMetaText}> {c.exp}</Text>
            </View>
          </View>
        </View>

        {/* Action row */}
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroMsgBtn} onPress={() => navigation.navigate('Messages')}>
            <Icon name="chatbubbles-outline" size={16} color={COLORS.primary} />
            <Text style={styles.heroMsgText}> Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroResumeBtn}>
            <Icon name="document-text-outline" size={16} color="#FFF" />
            <Text style={styles.heroResumeText}> View Resume</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* AI SCORE */}
        <View style={[styles.scoreCard, { borderColor: scoreColor + '30', backgroundColor: scoreColor + '08' }]}>
          <View style={styles.scoreLeft}>
            <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{c.score}</Text>
              <Text style={[styles.scoreOutOf, { color: scoreColor }]}>/100</Text>
            </View>
            <Text style={[styles.scoreGrade, { color: scoreColor }]}>{scoreLabel}</Text>
          </View>
          <View style={styles.scoreRight}>
            <Text style={[styles.scoreSectionTitle, { color: scoreColor }]}>🤖 AI Assessment Score</Text>
            {BARS.map(bar => (
              <View key={bar.label} style={styles.barRow}>
                <Text style={styles.barLabel}>{bar.label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${bar.val}%` as any, backgroundColor: scoreColor }]} />
                </View>
                <Text style={[styles.barVal, { color: scoreColor }]}>{bar.val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Teaching Details</Text>
          {[
            { icon: 'book-outline', label: 'Subjects', value: (c.subjects || ['Mathematics']).join(', ') },
            { icon: 'school-outline', label: 'Board', value: c.board || 'CBSE' },
            { icon: 'ribbon', label: 'Education', value: c.education || 'B.Ed, M.Sc Mathematics' },
            { icon: 'time-outline', label: 'Experience', value: c.exp || '5 Years' },
            { icon: 'chatbubbles-outline', label: 'Languages', value: (c.languages || ['English', 'Hindi']).join(', ') },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Icon name={item.icon} size={16} color={COLORS.textMuted} />
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* AI INSIGHTS */}
        <View style={styles.insightCard}>
          <Text style={styles.cardTitle}>🤖 AI Insights</Text>
          <View style={styles.insightBlock}>
            <View style={styles.insightHeaderRow}>
              <Icon name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.insightTitle}> Strengths</Text>
            </View>
            {['Deep subject knowledge in Mathematics', 'Excellent communication skills', '5+ years in CBSE curriculum'].map((s, i) => (
              <View key={i} style={styles.insightItem}>
                <View style={styles.insightBullet} />
                <Text style={styles.insightText}>{s}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.insightBlock, { backgroundColor: '#FFFBEB', borderColor: COLORS.warning + '30' }]}>
            <View style={styles.insightHeaderRow}>
              <Icon name="information-circle" size={16} color={COLORS.warning} />
              <Text style={[styles.insightTitle, { color: '#92400E' }]}> Ask About</Text>
            </View>
            {['Online teaching experience', 'JEE/Competitive exam preparation'].map((s, i) => (
              <View key={i} style={styles.insightItem}>
                <View style={[styles.insightBullet, { backgroundColor: COLORS.warning }]} />
                <Text style={[styles.insightText, { color: '#92400E' }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ACTION FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => Alert.alert('Reject', `Reject ${c.name}?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Reject', style: 'destructive', onPress: () => navigation.goBack() }])}
        >
          <Icon name="close" size={18} color={COLORS.error} />
          <Text style={styles.rejectText}> Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interviewBtn} onPress={() => Alert.alert('✅', `AI interview link sent to ${c.name}`)}>
          <Icon name="mic-outline" size={18} color={COLORS.primary} />
          <Text style={styles.interviewText}> AI Interview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortlistBtn} onPress={() => Alert.alert('✅ Shortlisted', `${c.name} has been shortlisted!`)}>
          <Icon name="checkmark" size={18} color="#FFF" />
          <Text style={styles.shortlistText}> Shortlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  heroHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 0,
  },
  heroHeaderNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center',
  },
  heroHeaderTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatar: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF60',
  },
  heroInfo: { flex: 1 },
  heroName: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 3 },
  heroRole: { fontSize: 13, color: '#FFFFFFBB', fontWeight: '600', marginBottom: 6 },
  heroMeta: { flexDirection: 'row', alignItems: 'center' },
  heroMetaText: { fontSize: 12, color: '#FFFFFFAA' },
  heroDot: { color: '#FFFFFFAA' },
  heroActions: { flexDirection: 'row', gap: 10, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#FFFFFF20', paddingTop: 14 },
  heroMsgBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', borderRadius: RADIUS.xl, paddingVertical: 12,
  },
  heroMsgText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  heroResumeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF25', borderRadius: RADIUS.xl, paddingVertical: 12,
    borderWidth: 1, borderColor: '#FFFFFF40',
  },
  heroResumeText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  scroll: { padding: SPACING.screen },

  scoreCard: {
    flexDirection: 'row', gap: 14, borderRadius: RADIUS.xl, padding: 14,
    marginBottom: 12, borderWidth: 1.5,
  },
  scoreLeft: { alignItems: 'center', width: 70 },
  scoreCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  scoreNum: { fontSize: 20, fontWeight: '900' },
  scoreOutOf: { fontSize: 10, fontWeight: '600' },
  scoreGrade: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  scoreRight: { flex: 1 },
  scoreSectionTitle: { fontSize: 13, fontWeight: '800', marginBottom: 10 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  barLabel: { fontSize: 10, color: COLORS.textMuted, width: 90 },
  barTrack: { flex: 1, height: 4, backgroundColor: COLORS.backgroundAlt, borderRadius: 2 },
  barFill: { height: 4, borderRadius: 2 },
  barVal: { fontSize: 11, fontWeight: '800', width: 22, textAlign: 'right' },

  detailCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  detailLabel: { width: 90, fontSize: 13, color: COLORS.textSecondary },
  detailValue: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text },

  insightCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border, gap: 12,
  },
  insightBlock: {
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.lg, padding: 12,
    borderWidth: 1, borderColor: COLORS.success + '30',
  },
  insightHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  insightTitle: { fontSize: 13, fontWeight: '800', color: COLORS.successDark },
  insightItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  insightBullet: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.success },
  insightText: { fontSize: 13, color: COLORS.successDark, flex: 1, lineHeight: 18 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.screen, paddingVertical: 12,
    flexDirection: 'row', gap: 10,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 12,
  },
  rejectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 14, paddingVertical: 14, borderRadius: RADIUS.xl,
    backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: COLORS.error + '30',
  },
  rejectText: { fontSize: 14, fontWeight: '700', color: COLORS.error },
  interviewBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, paddingVertical: 14,
    borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  interviewText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  shortlistBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.success, borderRadius: RADIUS.xl, paddingVertical: 14,
    shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  shortlistText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
});
