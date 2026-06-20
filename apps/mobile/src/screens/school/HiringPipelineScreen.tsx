import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const PIPELINE_STAGES = [
  { key: 'applied', label: 'Applied', icon: '📩', color: '#6366F1', count: 24 },
  { key: 'screening', label: 'AI Screening', icon: '🤖', color: '#8B5CF6', count: 18 },
  { key: 'shortlisted', label: 'Shortlisted', icon: '⭐', color: '#F59E0B', count: 11 },
  { key: 'interview_scheduled', label: 'Interview', icon: '🎙️', color: '#10B981', count: 6 },
  { key: 'offered', label: 'Offered', icon: '🎉', color: '#22C55E', count: 2 },
  { key: 'rejected', label: 'Rejected', icon: '❌', color: COLORS.error, count: 4 },
];

const MOCK_CANDIDATES: any = {
  applied: [
    { id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', score: 94, exp: '5 yrs', board: 'CBSE', city: 'Delhi' },
    { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', score: 88, exp: '8 yrs', board: 'ICSE', city: 'Mumbai' },
    { id: '3', name: 'Anjali Patel', role: 'English Teacher', score: 76, exp: '3 yrs', board: 'CBSE', city: 'Ahmedabad' },
  ],
  screening: [
    { id: '4', name: 'Neha Gupta', role: 'Chemistry Teacher', score: 91, exp: '6 yrs', board: 'State', city: 'Jaipur' },
    { id: '5', name: 'Amit Kumar', role: 'Math Teacher', score: 85, exp: '4 yrs', board: 'CBSE', city: 'Pune' },
  ],
  shortlisted: [
    { id: '6', name: 'Sunita Reddy', role: 'Biology Teacher', score: 89, exp: '7 yrs', board: 'ICSE', city: 'Hyderabad' },
  ],
  interview_scheduled: [
    { id: '7', name: 'Arun Singh', role: 'Geography Teacher', score: 82, exp: '5 yrs', board: 'CBSE', city: 'Kolkata' },
  ],
  offered: [
    { id: '8', name: 'Kavya Nair', role: 'History Teacher', score: 96, exp: '9 yrs', board: 'CBSE', city: 'Chennai' },
  ],
  rejected: [
    { id: '9', name: 'Vikram Das', role: 'Computer Science', score: 62, exp: '1 yr', board: 'State', city: 'Lucknow' },
  ],
};

function StageCard({ stage, isSelected, onPress, count }: any) {
  return (
    <TouchableOpacity
      style={[styles.stageCard, isSelected && { borderColor: stage.color, borderWidth: 2 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.stageIconWrap, { backgroundColor: stage.color + '15' }]}>
        <Text style={{ fontSize: 22 }}>{stage.icon}</Text>
      </View>
      <View style={[styles.stageBadge, { backgroundColor: stage.color }]}>
        <Text style={styles.stageCount}>{count}</Text>
      </View>
      <Text style={[styles.stageLabel, isSelected && { color: stage.color }]} numberOfLines={1}>{stage.label}</Text>
    </TouchableOpacity>
  );
}

function CandidateCard({ candidate, stageColor, navigation }: any) {
  return (
    <TouchableOpacity
      style={styles.candidateCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Candidates', { screen: 'CandidateProfile', params: { candidate } })}
    >
      <View style={styles.cardRow}>
        <View style={styles.cAvatar}>
          <Text style={{ fontSize: 24 }}>👩‍🏫</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cName}>{candidate.name}</Text>
          <Text style={styles.cRole}>{candidate.role}</Text>
          <Text style={styles.cMeta}>{candidate.city} • {candidate.board} • {candidate.exp}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: stageColor + '15' }]}>
          <Text style={[styles.scoreText, { color: stageColor }]}>{candidate.score}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function HiringPipelineScreen({ navigation }: any) {
  const [selectedStage, setSelectedStage] = useState('applied');
  const activeStage = PIPELINE_STAGES.find(s => s.key === selectedStage)!;
  const candidates = MOCK_CANDIDATES[selectedStage] || [];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Hiring Pipeline</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.totalBar}>
        <Text style={styles.totalText}>Total Applications</Text>
        <Text style={styles.totalCount}>65</Text>
      </View>

      <FlatList
        horizontal
        data={PIPELINE_STAGES}
        keyExtractor={s => s.key}
        contentContainerStyle={styles.stageList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <StageCard
            stage={item}
            count={item.count}
            isSelected={selectedStage === item.key}
            onPress={() => setSelectedStage(item.key)}
          />
        )}
      />

      <View style={styles.divider} />

      <View style={styles.sectionHeader}>
        <View style={[styles.stageDot, { backgroundColor: activeStage.color }]} />
        <Text style={styles.sectionTitle}>{activeStage.label}</Text>
        <Text style={styles.sectionCount}>{candidates.length} candidates</Text>
      </View>

      <FlatList
        data={candidates}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CandidateCard
            candidate={item}
            stageColor={activeStage.color}
            navigation={navigation}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>{activeStage.icon}</Text>
            <Text style={styles.emptyTitle}>No candidates in this stage</Text>
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
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },

  totalBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.screen, paddingVertical: 14,
    backgroundColor: COLORS.primaryBg,
  },
  totalText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '500' },
  totalCount: { fontSize: 22, fontWeight: '800', color: COLORS.primary },

  stageList: { paddingHorizontal: SPACING.screen, paddingVertical: 16, gap: 12 },
  stageCard: {
    width: 80, alignItems: 'center', padding: 10,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, position: 'relative',
  },
  stageIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  stageBadge: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.surface,
  },
  stageCount: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  stageLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },

  divider: { height: 1, backgroundColor: COLORS.border },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: SPACING.screen, paddingVertical: 14,
  },
  stageDot: { width: 12, height: 12, borderRadius: 6 },
  sectionTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: COLORS.text },
  sectionCount: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },

  list: { padding: SPACING.screen, paddingTop: 0 },
  candidateCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cAvatar: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center',
  },
  cName: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  cRole: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  cMeta: { fontSize: 12, color: COLORS.textMuted },
  scoreBox: { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: RADIUS.lg },
  scoreText: { fontSize: 18, fontWeight: '800' },
  scoreLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
});
