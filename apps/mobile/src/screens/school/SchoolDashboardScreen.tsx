import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const CANDIDATES = [
  { id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', score: 94, city: 'Delhi', exp: '5 yrs' },
  { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', score: 88, city: 'Mumbai', exp: '8 yrs' },
  { id: '3', name: 'Anjali Patel', role: 'English Teacher', score: 91, city: 'Ahmedabad', exp: '3 yrs' },
];

const STATS = [
  { icon: '💼', value: '12', label: 'Active Jobs', color: COLORS.primary },
  { icon: '👥', value: '48', label: 'Applicants', color: '#10B981' },
  { icon: '🎙️', value: '5', label: 'Interviews', color: '#F59E0B' },
  { icon: '🎉', value: '3', label: 'Hired', color: '#8B5CF6' },
];

const PIPELINE = [
  { label: 'Applied', count: 48, color: COLORS.primary },
  { label: 'AI Screened', count: 31, color: '#8B5CF6' },
  { label: 'Shortlisted', count: 12, color: '#F59E0B' },
  { label: 'Interview', count: 5, color: '#10B981' },
  { label: 'Offered', count: 2, color: '#22C55E' },
];

export function SchoolDashboardScreen({ navigation }: any) {
  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── GRADIENT HEADER (manual) ── */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.schoolAvatar}>
              <Text style={{ fontSize: 26 }}>🏫</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerWelcome}>Welcome back</Text>
              <Text style={styles.headerName}>Delhi Public School</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Quick post job */}
          <TouchableOpacity
            style={styles.postJobBtn}
            onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
          >
            <Text style={styles.postJobBtnText}>+ Post a New Job</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

          {/* ── STATS GRID ── */}
          <View style={styles.statsGrid}>
            {STATS.map(stat => (
              <View key={stat.label} style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: stat.color + '18' }]}>
                  <Text style={{ fontSize: 22 }}>{stat.icon}</Text>
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* ── AI BANNER ── */}
          <TouchableOpacity
            style={styles.aiBanner}
            onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
            activeOpacity={0.85}
          >
            <View style={styles.aiIconBox}>
              <Text style={{ fontSize: 30 }}>🤖</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>AI-Powered Hiring</Text>
              <Text style={styles.aiSub}>Auto-screen candidates with Scorten AI. Save 20 hrs/week.</Text>
            </View>
            <View style={styles.aiArrowBtn}>
              <Text style={{ color: COLORS.primary, fontWeight: '800', fontSize: 16 }}>→</Text>
            </View>
          </TouchableOpacity>

          {/* ── HIRING PIPELINE ── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hiring Pipeline</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Candidates')}>
                <Text style={styles.seeAll}>Manage →</Text>
              </TouchableOpacity>
            </View>
            {PIPELINE.map((stage, i) => (
              <View key={stage.label} style={styles.pipelineRow}>
                <View style={styles.pipelineLeft}>
                  <View style={[styles.pipelineDot, { backgroundColor: stage.color }]} />
                  {i < PIPELINE.length - 1 && <View style={[styles.pipelineConnector, { backgroundColor: stage.color + '40' }]} />}
                </View>
                <Text style={styles.pipelineLabel}>{stage.label}</Text>
                <View style={[styles.pipelineBadge, { backgroundColor: stage.color + '18' }]}>
                  <Text style={[styles.pipelineCount, { color: stage.color }]}>{stage.count}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── TOP CANDIDATES ── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top AI-Scored Candidates</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Candidates')}>
                <Text style={styles.seeAll}>View All →</Text>
              </TouchableOpacity>
            </View>
            {CANDIDATES.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.candidateRow}
                onPress={() => navigation.navigate('Candidates', { screen: 'CandidateProfile', params: { candidate: c } })}
                activeOpacity={0.8}
              >
                <View style={styles.candidateAvatar}>
                  <Text style={{ fontSize: 22 }}>👩‍🏫</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.candidateName}>{c.name}</Text>
                  <Text style={styles.candidateRole}>{c.role} · {c.city}</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreNum}>{c.score}</Text>
                  <Text style={styles.scoreLabel}>Score</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── QUICK ACTIONS ── */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: COLORS.primaryBg }]}
              onPress={() => navigation.navigate('Candidates', { screen: 'CandidateSearch' })}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>🔍</Text>
              <Text style={[styles.quickActionText, { color: COLORS.primary }]}>Find Teachers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: '#F0FDF4' }]}
              onPress={() => navigation.navigate('Candidates')}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>🤖</Text>
              <Text style={[styles.quickActionText, { color: '#065F46' }]}>AI Interviews</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: '#FFFBEB' }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>⚙️</Text>
              <Text style={[styles.quickActionText, { color: '#92400E' }]}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 56, paddingHorizontal: SPACING.screen, paddingBottom: 36,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  schoolAvatar: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  headerWelcome: { fontSize: 13, color: '#FFFFFFAA', marginBottom: 2 },
  headerName: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  notifBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFFFFF20',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 10, right: 10,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF',
  },
  postJobBtn: {
    backgroundColor: '#FFFFFF20', borderRadius: RADIUS.xl, borderWidth: 1,
    borderColor: '#FFFFFF40', paddingVertical: 14, alignItems: 'center',
  },
  postJobBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  content: { paddingHorizontal: SPACING.screen, marginTop: -20 },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20,
  },
  statCard: {
    width: (width - 48 - 36) / 4,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  statIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 20,
    borderWidth: 1.5, borderColor: COLORS.primary + '30',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
  },
  aiIconBox: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  aiTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  aiSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  aiArrowBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },

  sectionCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 18,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  pipelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 4 },
  pipelineLeft: { width: 16, alignItems: 'center' },
  pipelineDot: { width: 14, height: 14, borderRadius: 7 },
  pipelineConnector: { width: 2, height: 24, marginTop: 2 },
  pipelineLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text, paddingTop: 1 },
  pipelineBadge: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: RADIUS.full },
  pipelineCount: { fontSize: 14, fontWeight: '800' },

  candidateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  candidateAvatar: {
    width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  candidateName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  candidateRole: { fontSize: 12, color: COLORS.textSecondary },
  scoreBox: {
    alignItems: 'center', backgroundColor: COLORS.successBg, borderRadius: RADIUS.md,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  scoreNum: { fontSize: 16, fontWeight: '900', color: COLORS.successDark },
  scoreLabel: { fontSize: 9, color: COLORS.success, fontWeight: '700', textTransform: 'uppercase' },

  quickActionsRow: { flexDirection: 'row', gap: 12, marginTop: 4, marginBottom: 8 },
  quickAction: {
    flex: 1, borderRadius: RADIUS.xl, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  quickActionText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },

  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },
  fabText: { fontSize: 30, color: '#FFF', fontWeight: '300', lineHeight: 34 },
});
