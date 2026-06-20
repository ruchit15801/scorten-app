import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SESSIONS = [
  { id: '1', name: 'Priya Sharma', subject: 'Mathematics', score: 88, status: 'completed', date: '2 hrs ago', answers: 8 },
  { id: '2', name: 'Rahul Desai', subject: 'Physics', score: null, status: 'pending', date: 'Invited 1d ago', answers: 0 },
  { id: '3', name: 'Anjali Patel', subject: 'English', score: 75, status: 'completed', date: 'Yesterday', answers: 8 },
];

export function AIInterviewManageScreen({ navigation, route }: any) {
  const jobId = route.params?.jobId || '1';
  const [tab, setTab] = useState<'all' | 'pending' | 'done'>('all');

  const filtered = SESSIONS.filter(s => {
    if (tab === 'pending') return s.status === 'pending';
    if (tab === 'done') return s.status === 'completed';
    return true;
  });

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>AI Interview Manager</Text>
          <Text style={styles.headerSub}>Automate your screening process</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Invite', 'Select candidates to invite for AI interview')}>
          <Icon name="add" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total Invited', value: 3, color: COLORS.primary },
          { label: 'Completed', value: 2, color: COLORS.success },
          { label: 'Pending', value: 1, color: COLORS.warning },
          { label: 'Avg Score', value: '82', color: '#8B5CF6' },
        ].map((s, i) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['all', 'pending', 'done'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'all' ? 'All' : t === 'pending' ? 'Pending' : 'Completed'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map(s => (
          <View key={s.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardAvatar}>
                <Icon name="person" size={22} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{s.name}</Text>
                <View style={styles.cardMeta}>
                  <Icon name="book-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.cardMetaText}> {s.subject} · {s.date}</Text>
                </View>
              </View>
              {s.score !== null ? (
                <View style={[styles.scorePill, { backgroundColor: (s.score >= 80 ? COLORS.success : COLORS.warning) + '18' }]}>
                  <Text style={[styles.scoreText, { color: s.score >= 80 ? COLORS.success : COLORS.warning }]}>{s.score}/100</Text>
                </View>
              ) : (
                <View style={[styles.scorePill, { backgroundColor: COLORS.warningBg }]}>
                  <Text style={[styles.scoreText, { color: COLORS.warning }]}>Pending</Text>
                </View>
              )}
            </View>

            {s.status === 'completed' ? (
              <View style={styles.completedStrip}>
                <Icon name="checkmark-circle" size={14} color={COLORS.success} />
                <Text style={styles.completedText}> {s.answers} questions answered · AI analyzed</Text>
                <TouchableOpacity style={styles.viewReportBtn}>
                  <Text style={styles.viewReportText}>Report →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pendingStrip}>
                <Icon name="time-outline" size={14} color={COLORS.warning} />
                <Text style={styles.pendingText}> Waiting for candidate</Text>
                <TouchableOpacity
                  style={styles.remindBtn}
                  onPress={() => Alert.alert('✅', `Reminder sent to ${s.name}`)}
                >
                  <Text style={styles.remindText}>Remind</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* AI Feature Banner */}
        <View style={styles.aiBanner}>
          <Icon name="sparkles" size={24} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.aiBannerTitle}>AI Does the Heavy Lifting</Text>
            <Text style={styles.aiBannerSub}>Candidates answer 8 recorded questions. AI scores communication, confidence, and subject knowledge.</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.screen,
    paddingBottom: 16, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
    borderTopWidth: 1, borderTopColor: '#FFFFFF20',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '900', marginBottom: 2 },
  statLbl: { fontSize: 10, color: '#FFFFFFAA', fontWeight: '600' },

  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screen, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: { paddingVertical: 14, marginRight: 20, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '800' },

  scroll: { padding: SPACING.screen },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardAvatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  cardMetaText: { fontSize: 12, color: COLORS.textMuted },
  scorePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full },
  scoreText: { fontSize: 13, fontWeight: '800' },

  completedStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.md, padding: 10,
  },
  completedText: { flex: 1, fontSize: 12, color: COLORS.successDark, fontWeight: '600' },
  viewReportBtn: {},
  viewReportText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  pendingStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.warningBg, borderRadius: RADIUS.md, padding: 10,
  },
  pendingText: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: '600' },
  remindBtn: { backgroundColor: COLORS.warning, paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full },
  remindText: { fontSize: 11, color: '#FFF', fontWeight: '700' },

  aiBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 16,
    borderWidth: 1, borderColor: COLORS.primary + '30', marginTop: 4,
  },
  aiBannerTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginBottom: 6 },
  aiBannerSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
});
