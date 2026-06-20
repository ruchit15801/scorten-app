import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_APPLICATIONS = [
  {
    id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', score: 94,
    status: 'shortlisted', appliedDate: '2 days ago', city: 'Delhi',
    exp: '5 yrs', board: 'CBSE', aiInterview: 'completed',
  },
  {
    id: '2', name: 'Rahul Desai', role: 'Physics Teacher', score: 88,
    status: 'applied', appliedDate: '3 days ago', city: 'Mumbai',
    exp: '8 yrs', board: 'ICSE', aiInterview: 'pending',
  },
  {
    id: '3', name: 'Anjali Patel', role: 'English Teacher', score: 76,
    status: 'interview_scheduled', appliedDate: '5 days ago', city: 'Ahmedabad',
    exp: '3 yrs', board: 'CBSE', aiInterview: 'scheduled',
  },
  {
    id: '4', name: 'Neha Gupta', role: 'Chemistry Teacher', score: 91,
    status: 'offered', appliedDate: '1 week ago', city: 'Jaipur',
    exp: '6 yrs', board: 'State', aiInterview: 'completed',
  },
];

const STATUS_CONFIG: any = {
  applied: { label: 'Applied', color: '#6366F1', bg: '#EEF2FF' },
  shortlisted: { label: 'Shortlisted', color: '#F59E0B', bg: '#FFFBEB' },
  interview_scheduled: { label: 'Interview', color: '#10B981', bg: '#ECFDF5' },
  offered: { label: 'Offered', color: COLORS.success, bg: COLORS.successBg },
  rejected: { label: 'Rejected', color: COLORS.error, bg: COLORS.errorBg },
};

const AI_CONFIG: any = {
  completed: { label: 'AI Done ✓', color: COLORS.success },
  pending: { label: 'AI Pending', color: COLORS.warning },
  scheduled: { label: 'AI Scheduled', color: COLORS.info },
};

const FILTER_TABS = ['All', 'New', 'Shortlisted', 'Interview', 'Offered'];

export function JobApplicationsScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = MOCK_APPLICATIONS.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'New') return a.status === 'applied';
    if (activeFilter === 'Shortlisted') return a.status === 'shortlisted';
    if (activeFilter === 'Interview') return a.status === 'interview_scheduled';
    if (activeFilter === 'Offered') return a.status === 'offered';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Applicants</Text>
          <Text style={styles.subtitle}>{MOCK_APPLICATIONS.length} total applications</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        horizontal
        data={FILTER_TABS}
        keyExtractor={t => t}
        contentContainerStyle={styles.filterList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === item && styles.filterTabActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={a => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.applied;
          const ai = AI_CONFIG[item.aiInterview] || AI_CONFIG.pending;
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Candidates', { screen: 'CandidateProfile', params: { candidate: item } })}
            >
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 24 }}>👩‍🏫</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.role}>{item.role}</Text>
                  <Text style={styles.meta}>{item.city} • {item.exp} • {item.board}</Text>
                </View>
                <View style={[styles.scoreBadge, { backgroundColor: '#F0FDF4' }]}>
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
                <Text style={[styles.aiText, { color: ai.color }]}>{ai.label}</Text>
                <Text style={styles.dateText}>{item.appliedDate}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📭</Text>
            <Text style={styles.emptyTitle}>No applications</Text>
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
  backBtn: { width: 40 },
  backArrow: { fontSize: 32, color: COLORS.text },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary },

  filterList: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },

  list: { padding: SPACING.screen },
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
  meta: { fontSize: 12, color: COLORS.textMuted },
  scoreBadge: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.lg },
  scoreText: { fontSize: 18, fontWeight: '800', color: COLORS.successDark },

  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 12, fontWeight: '700' },
  aiText: { fontSize: 12, fontWeight: '600' },
  dateText: { flex: 1, textAlign: 'right', fontSize: 12, color: COLORS.textMuted },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
});
