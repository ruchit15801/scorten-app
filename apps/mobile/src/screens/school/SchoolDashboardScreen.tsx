import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Clipboard, Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const CANDIDATES = [
  { id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', score: 94, city: 'Delhi', exp: '5 yrs' },
  { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', score: 88, city: 'Mumbai', exp: '8 yrs' },
  { id: '3', name: 'Anjali Patel', role: 'English Teacher', score: 91, city: 'Ahmedabad', exp: '3 yrs' },
];

const PIPELINE = [
  { label: 'Applied', count: 48, color: COLORS.primary },
  { label: 'AI Screened', count: 31, color: '#8B5CF6' },
  { label: 'Shortlisted', count: 12, color: '#F59E0B' },
  { label: 'Interviewing', count: 5, color: '#10B981' },
  { label: 'Offered', count: 2, color: '#22C55E' },
];

export function SchoolDashboardScreen({ navigation }: any) {
  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.schoolAvatar}>
              <Icon name="school" size={28} color="#FFF" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerGreet}>Welcome back</Text>
              <Text style={styles.headerName} numberOfLines={1}>
                {(user as any)?.schoolName || (user?.firstName ? `${user.firstName}'s School` : 'Delhi Public School')}
              </Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Icon name="notifications-outline" size={22} color="#FFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Scorten ID strip */}
          <TouchableOpacity
            style={styles.scortenIdStrip}
            onPress={() => {
              const id = (user as any)?.scortenId || 'SCH-2026-XXXXX';
              Clipboard.setString(id);
              Alert.alert('Copied!', `Scorten ID ${id} copied.`);
            }}
          >
            <Icon name="shield-checkmark" size={15} color="#D1FAE5" />
            <Text style={styles.scortenIdStripText}>
              Scorten ID: <Text style={styles.scortenIdStripValue}>{(user as any)?.scortenId || 'SCH-2026-XXXXX'}</Text>
            </Text>
            <Icon name="copy-outline" size={13} color="#D1FAE5" />
          </TouchableOpacity>

          {/* Stats row inline in header */}
          <View style={styles.headerStats}>
            {[
              { label: 'Active Jobs', value: 12, icon: 'briefcase-outline' },
              { label: 'Applicants', value: 48, icon: 'people-outline' },
              { label: 'Interviews', value: 5, icon: 'mic-outline' },
              { label: 'Hired', value: 3, icon: 'trophy-outline' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.headerStatItem}>
                  <Text style={styles.headerStatValue}>{s.value}</Text>
                  <Text style={styles.headerStatLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Post job CTA */}
          <TouchableOpacity
            style={styles.postJobBtn}
            onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
            activeOpacity={0.88}
          >
            <Icon name="add" size={20} color={COLORS.primary} />
            <Text style={styles.postJobText}> Post a New Job</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>

          {/* ── AI BANNER ── */}
          <TouchableOpacity
            style={styles.aiBanner}
            onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
            activeOpacity={0.88}
          >
            <View style={styles.aiIconBox}>
              <Icon name="sparkles" size={26} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>AI-Powered Hiring</Text>
              <Text style={styles.aiSub}>Auto-screen candidates · Save 20 hrs/week</Text>
            </View>
            <View style={styles.aiArrow}>
              <Icon name="chevron-forward" size={18} color={COLORS.primary} />
            </View>
          </TouchableOpacity>

          {/* ── HIRING PIPELINE ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Hiring Pipeline</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Candidates')} style={styles.seeAllRow}>
                <Text style={styles.seeAll}>Manage</Text>
                <Icon name="chevron-forward" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {PIPELINE.map((stage, i) => (
              <View key={stage.label} style={styles.pipelineItem}>
                <View style={styles.pipelineIndicator}>
                  <View style={[styles.pipelineDot, { backgroundColor: stage.color }]} />
                  {i < PIPELINE.length - 1 && (
                    <View style={[styles.pipelineConnector, { backgroundColor: stage.color + '40' }]} />
                  )}
                </View>
                <Text style={styles.pipelineLabel}>{stage.label}</Text>
                <View style={[styles.pipelineBadge, { backgroundColor: stage.color + '18' }]}>
                  <Text style={[styles.pipelineCount, { color: stage.color }]}>{stage.count}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── TOP CANDIDATES ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Top AI-Matched Candidates</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Candidates')} style={styles.seeAllRow}>
                <Text style={styles.seeAll}>View All</Text>
                <Icon name="chevron-forward" size={14} color={COLORS.primary} />
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
                  <Icon name="person" size={22} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.candidateName}>{c.name}</Text>
                  <View style={styles.candidateMeta}>
                    <Icon name="briefcase-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.candidateMetaText}> {c.role} · {c.city}</Text>
                  </View>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreNum}>{c.score}</Text>
                  <Text style={styles.scoreLbl}>AI</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── QUICK ACTIONS ── */}
          <View style={styles.quickGrid}>
            {[
              { icon: 'search-outline', label: 'Find Teachers', color: COLORS.primary, bg: COLORS.primaryBg, onPress: () => navigation.navigate('Candidates', { screen: 'CandidateSearch' }) },
              { icon: 'mic-outline', label: 'AI Interviews', color: '#10B981', bg: '#ECFDF5', onPress: () => navigation.navigate('Candidates') },
              { icon: 'stats-chart', label: 'Analytics', color: '#8B5CF6', bg: '#F3F0FF', onPress: () => navigation.navigate('Dashboard') },
            ].map(a => (
              <TouchableOpacity key={a.label} style={[styles.quickCard, { backgroundColor: a.bg }]} onPress={a.onPress} activeOpacity={0.8}>
                <Icon name={a.icon} size={26} color={a.color} />
                <Text style={[styles.quickLabel, { color: a.color }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
        activeOpacity={0.87}
      >
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 0,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  schoolAvatar: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  headerGreet: { fontSize: 12, color: '#FFFFFFAA', marginBottom: 2 },
  headerName: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF20',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 10, right: 10,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF',
  },

  headerStats: { flexDirection: 'row', paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#FFFFFF20' },
  headerStatItem: { flex: 1, alignItems: 'center' },
  headerStatValue: { fontSize: 20, fontWeight: '900', color: '#FFF', marginBottom: 2 },
  headerStatLabel: { fontSize: 10, color: '#FFFFFFAA', fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: 1, backgroundColor: '#FFFFFF30', marginVertical: 4 },

  postJobBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', borderRadius: RADIUS.xl, paddingVertical: 14, marginBottom: 0,
  },
  postJobText: { fontSize: 15, fontWeight: '800', color: COLORS.primary },

  body: { paddingHorizontal: SPACING.screen, paddingTop: 16 },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16,
    marginBottom: 14, borderWidth: 1.5, borderColor: COLORS.primary + '30',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  aiIconBox: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  aiTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 3 },
  aiSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  aiArrow: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  seeAllRow: { flexDirection: 'row', alignItems: 'center' },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  pipelineItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 4 },
  pipelineIndicator: { width: 14, alignItems: 'center' },
  pipelineDot: { width: 14, height: 14, borderRadius: 7 },
  pipelineConnector: { width: 2, height: 22, marginTop: 2 },
  pipelineLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text, lineHeight: 14 },
  pipelineBadge: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: RADIUS.full },
  pipelineCount: { fontSize: 13, fontWeight: '800' },

  candidateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  candidateAvatar: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  candidateName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  candidateMeta: { flexDirection: 'row', alignItems: 'center' },
  candidateMetaText: { fontSize: 12, color: COLORS.textMuted },
  scoreBox: {
    alignItems: 'center', backgroundColor: COLORS.successBg,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.md,
  },
  scoreNum: { fontSize: 16, fontWeight: '900', color: COLORS.successDark },
  scoreLbl: { fontSize: 9, color: COLORS.success, fontWeight: '700', textTransform: 'uppercase' },

  quickGrid: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  quickCard: {
    flex: 1, borderRadius: RADIUS.xl, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border, gap: 8,
  },
  quickLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },

  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },

  // Scorten ID strip
  scortenIdStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFFFF18', borderRadius: RADIUS.lg,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 14,
    borderWidth: 1, borderColor: '#FFFFFF30',
  },
  scortenIdStripText: { flex: 1, fontSize: 12, color: '#FFFFFFBB', fontWeight: '600' },
  scortenIdStripValue: { fontWeight: '900', color: '#FFF', letterSpacing: 0.8 },
});
