import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_AI_SESSIONS = [
  {
    id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', score: 94,
    status: 'completed', duration: '18 min', date: 'Today, 10:30 AM',
    strengths: ['Strong subject knowledge', 'Excellent communication'],
    flags: [],
  },
  {
    id: '2', name: 'Rahul Desai', role: 'Physics Teacher', score: 78,
    status: 'in_progress', duration: '—', date: 'In Progress',
    strengths: [], flags: [],
  },
  {
    id: '3', name: 'Anjali Patel', role: 'English Teacher', score: 65,
    status: 'completed', duration: '22 min', date: 'Yesterday, 3:00 PM',
    strengths: ['Creative teaching approach'],
    flags: ['Hesitation on classroom management Q'],
  },
  {
    id: '4', name: 'Neha Gupta', role: 'Chemistry Teacher', score: 91,
    status: 'scheduled', duration: '—', date: 'Tomorrow, 11:00 AM',
    strengths: [], flags: [],
  },
];

const STATUS_CONFIG: any = {
  completed: { label: 'Completed', color: COLORS.success, bg: COLORS.successBg, icon: '✅' },
  in_progress: { label: 'In Progress', color: '#F59E0B', bg: '#FFFBEB', icon: '⏳' },
  scheduled: { label: 'Scheduled', color: '#6366F1', bg: '#EEF2FF', icon: '📅' },
};

function SessionCard({ session, onPress }: any) {
  const cfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.completed;
  const scoreColor = session.score >= 85 ? COLORS.success : session.score >= 70 ? '#F59E0B' : COLORS.error;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 24 }}>👩‍🏫</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{session.name}</Text>
          <Text style={styles.role}>{session.role}</Text>
          <Text style={styles.date}>{cfg.icon} {session.date}</Text>
        </View>
        {session.status === 'completed' && (
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{session.score}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        {session.duration !== '—' && (
          <Text style={styles.duration}>⏱️ {session.duration}</Text>
        )}
        {session.status === 'completed' && (
          <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
            <Text style={styles.viewBtnText}>View Report →</Text>
          </TouchableOpacity>
        )}
      </View>

      {session.strengths.length > 0 && (
        <View style={styles.strengthsBox}>
          <Text style={styles.strengthsLabel}>AI Strengths:</Text>
          {session.strengths.map((s: string, i: number) => (
            <Text key={i} style={styles.strengthItem}>• {s}</Text>
          ))}
        </View>
      )}

      {session.flags.length > 0 && (
        <View style={styles.flagsBox}>
          <Text style={styles.flagsLabel}>⚠️ Flags:</Text>
          {session.flags.map((f: string, i: number) => (
            <Text key={i} style={styles.flagItem}>• {f}</Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

export function AIInterviewManageScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Completed', 'In Progress', 'Scheduled'];

  const filtered = MOCK_AI_SESSIONS.filter(s => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return s.status === 'completed';
    if (activeTab === 'In Progress') return s.status === 'in_progress';
    if (activeTab === 'Scheduled') return s.status === 'scheduled';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Interviews</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: '4', color: COLORS.primary },
          { label: 'Done', value: '2', color: COLORS.success },
          { label: 'Pending', value: '2', color: '#F59E0B' },
          { label: 'Avg Score', value: '82', color: '#8B5CF6' },
        ].map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <FlatList
        horizontal
        data={tabs}
        keyExtractor={t => t}
        contentContainerStyle={styles.tabList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, activeTab === item && styles.tabActive]}
            onPress={() => setActiveTab(item)}
          >
            <Text style={[styles.tabText, activeTab === item && styles.tabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => {}}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🤖</Text>
            <Text style={styles.emptyTitle}>No AI interviews yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.primaryBg,
  },
  backArrow: { fontSize: 32, color: COLORS.text, width: 40 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },

  statsRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: SPACING.screen, paddingBottom: 16,
    backgroundColor: COLORS.primaryBg,
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  tabList: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },

  list: { padding: SPACING.screen, paddingTop: 0 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  role: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  date: { fontSize: 12, color: COLORS.textMuted },
  scoreCircle: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 2.5, alignItems: 'center', justifyContent: 'center',
  },
  scoreText: { fontSize: 18, fontWeight: '800' },

  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 12, fontWeight: '700' },
  duration: { fontSize: 12, color: COLORS.textMuted },
  viewBtn: { flex: 1, alignItems: 'flex-end' },
  viewBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  strengthsBox: { marginTop: 12, backgroundColor: COLORS.successBg, borderRadius: RADIUS.md, padding: 10 },
  strengthsLabel: { fontSize: 12, fontWeight: '700', color: COLORS.successDark, marginBottom: 4 },
  strengthItem: { fontSize: 12, color: COLORS.successDark, lineHeight: 20 },

  flagsBox: { marginTop: 8, backgroundColor: COLORS.errorBg, borderRadius: RADIUS.md, padding: 10 },
  flagsLabel: { fontSize: 12, fontWeight: '700', color: COLORS.error, marginBottom: 4 },
  flagItem: { fontSize: 12, color: COLORS.error, lineHeight: 20 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
});
