import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const STAGES = [
  { key: 'applied',             label: 'Applied',          count: 48, color: COLORS.primary   },
  { key: 'ai_screened',         label: 'AI Screened',      count: 31, color: '#8B5CF6'         },
  { key: 'shortlisted',         label: 'Shortlisted',      count: 12, color: '#F59E0B'         },
  { key: 'interview_scheduled', label: 'Interview Sent',   count: 8,  color: '#06B6D4'         },
  { key: 'interview_completed', label: 'AI Interviewed',   count: 5,  color: '#3B82F6'         },
  { key: 'offered',             label: 'Offer Extended',   count: 3,  color: COLORS.success    },
  { key: 'hired',               label: 'Hired ✓',          count: 2,  color: '#16A34A'         },
];

const MOCK_CANDIDATES: any = {
  applied: [
    { id: '1', name: 'Priya Sharma', role: 'Math Teacher', city: 'Delhi', score: 94 },
    { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', city: 'Mumbai', score: 88 },
    { id: '3', name: 'Anjali Patel', role: 'English Teacher', city: 'Ahmedabad', score: 76 },
  ],
  ai_screened: [
    { id: '1', name: 'Priya Sharma', role: 'Math Teacher', city: 'Delhi', score: 94 },
    { id: '2', name: 'Rohit Mishra', role: 'Chemistry Teacher', city: 'Pune', score: 85 },
  ],
  shortlisted: [
    { id: '1', name: 'Priya Sharma', role: 'Math Teacher', city: 'Delhi', score: 94 },
  ],
  offered: [
    { id: '1', name: 'Anjali Patel', role: 'English Teacher', city: 'Ahmedabad', score: 91 },
  ],
};

export function HiringPipelineScreen({ navigation }: any) {
  const [activeStage, setActiveStage] = useState('applied');
  const stage = STAGES.find(s => s.key === activeStage) || STAGES[0];
  const candidates = MOCK_CANDIDATES[activeStage] || [];

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Hiring Pipeline</Text>
          <Text style={styles.headerSub}>Track every candidate's journey</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>48 Total</Text>
        </View>
      </View>

      {/* FUNNEL */}
      <View style={styles.funnelCard}>
        <Text style={styles.funnelTitle}>Conversion Funnel</Text>
        {STAGES.map((s, i) => {
          const pct = Math.round((s.count / 48) * 100);
          return (
            <TouchableOpacity
              key={s.key}
              style={[styles.funnelRow, activeStage === s.key && styles.funnelRowActive]}
              onPress={() => setActiveStage(s.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.funnelDot, { backgroundColor: s.color }]} />
              <Text style={[styles.funnelLabel, activeStage === s.key && { color: s.color, fontWeight: '800' }]}>{s.label}</Text>
              <View style={styles.funnelBarWrap}>
                <View style={[styles.funnelBar, { width: `${Math.max(pct, 8)}%` as any, backgroundColor: s.color }]} />
              </View>
              <Text style={[styles.funnelCount, { color: s.color }]}>{s.count}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CANDIDATES IN STAGE */}
      <View style={styles.stageHeader}>
        <Text style={styles.stageTitle}>{stage.label}</Text>
        <View style={[styles.stageBadge, { backgroundColor: stage.color + '18' }]}>
          <Text style={[styles.stageBadgeText, { color: stage.color }]}>{stage.count} candidates</Text>
        </View>
      </View>

      <FlatList
        data={candidates}
        keyExtractor={(c: any) => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => {
          const scoreColor = item.score >= 88 ? COLORS.success : item.score >= 74 ? COLORS.warning : COLORS.error;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Candidates', { screen: 'CandidateProfile', params: { candidate: item } })}
              activeOpacity={0.85}
            >
              <View style={styles.cardAvatar}>
                <Icon name="person" size={22} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{item.name}</Text>
                <View style={styles.cardMeta}>
                  <Icon name="briefcase-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.cardMetaText}> {item.role} · {item.city}</Text>
                </View>
              </View>
              <View style={[styles.scoreBox, { backgroundColor: scoreColor + '14' }]}>
                <Text style={[styles.scoreNum, { color: scoreColor }]}>{item.score}</Text>
                <Text style={[styles.scoreLbl, { color: scoreColor }]}>AI</Text>
              </View>
              <Icon name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="people-outline" size={40} color={COLORS.border} />
            <Text style={styles.emptyText}>No candidates at this stage</Text>
          </View>
        }
      />
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },
  totalBadge: { backgroundColor: '#FFFFFF25', borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 5 },
  totalText: { fontSize: 12, color: '#FFF', fontWeight: '700' },

  funnelCard: {
    backgroundColor: COLORS.surface, marginHorizontal: SPACING.screen, marginTop: 16, marginBottom: 0,
    borderRadius: RADIUS.xl, padding: 16, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  funnelTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  funnelRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7,
    borderRadius: RADIUS.md, paddingHorizontal: 4,
  },
  funnelRowActive: { backgroundColor: COLORS.backgroundAlt },
  funnelDot: { width: 10, height: 10, borderRadius: 5 },
  funnelLabel: { width: 110, fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  funnelBarWrap: { flex: 1, height: 6, backgroundColor: COLORS.backgroundAlt, borderRadius: 3 },
  funnelBar: { height: 6, borderRadius: 3, minWidth: 8 },
  funnelCount: { width: 24, fontSize: 13, fontWeight: '800', textAlign: 'right' },

  stageHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: SPACING.screen, paddingTop: 16, paddingBottom: 8,
  },
  stageTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  stageBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  stageBadgeText: { fontSize: 12, fontWeight: '700' },

  list: { paddingHorizontal: SPACING.screen, paddingBottom: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardAvatar: { width: 46, height: 46, borderRadius: 13, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  cardMetaText: { fontSize: 12, color: COLORS.textMuted },
  scoreBox: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.md, alignItems: 'center' },
  scoreNum: { fontSize: 15, fontWeight: '900' },
  scoreLbl: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },

  empty: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyText: { fontSize: 14, color: COLORS.textMuted },
});
