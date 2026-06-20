import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useJobApplications } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_APPS = [
  { _id: '1', status: 'applied', teacherId: { firstName: 'Priya', lastName: 'Sharma', subjects: ['Mathematics'] }, scortenReputationScore: 94, city: 'Delhi', exp: '5 yrs', createdAt: new Date().toISOString() },
  { _id: '2', status: 'interview_scheduled', teacherId: { firstName: 'Rahul', lastName: 'Desai', subjects: ['Physics'] }, scortenReputationScore: 88, city: 'Mumbai', exp: '8 yrs', createdAt: new Date().toISOString() },
  { _id: '3', status: 'screening', teacherId: { firstName: 'Anjali', lastName: 'Patel', subjects: ['English'] }, scortenReputationScore: 76, city: 'Ahmedabad', exp: '3 yrs', createdAt: new Date().toISOString() },
  { _id: '4', status: 'offered', teacherId: { firstName: 'Sonal', lastName: 'Joshi', subjects: ['Science'] }, scortenReputationScore: 91, city: 'Surat', exp: '6 yrs', createdAt: new Date().toISOString() },
];

const STATUS_CFG: any = {
  applied:             { label: 'Applied',       color: COLORS.primary,   icon: 'document-text-outline' },
  screening:           { label: 'AI Screening',  color: '#8B5CF6',         icon: 'sparkles' },
  interview_scheduled: { label: 'Interviewing',  color: COLORS.warning,   icon: 'mic-outline' },
  offered:             { label: 'Offer Sent',    color: COLORS.success,   icon: 'ribbon' },
  rejected:            { label: 'Rejected',      color: COLORS.error,     icon: 'close-circle' },
};

const TABS = ['All', 'Applied', 'Screening', 'Interview', 'Offered'];

function AppCard({ app, onPress }: any) {
  const t = app.teacherId || {};
  const name = `${t.firstName || 'Candidate'} ${t.lastName || ''}`;
  const subj = t.subjects?.[0] || 'Teacher';
  const cfg = STATUS_CFG[app.status] || STATUS_CFG.applied;
  const score = app.scortenReputationScore || 80;
  const scoreColor = score >= 88 ? COLORS.success : score >= 72 ? COLORS.warning : COLORS.error;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardRow}>
        <View style={styles.avatar}>
          <Icon name="person" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subj}>{subj}</Text>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}> {app.city || 'India'}  ·  {app.exp || '3 yrs'}</Text>
          </View>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '14', borderColor: scoreColor + '30' }]}>
          <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}</Text>
          <Text style={[styles.scoreLbl, { color: scoreColor }]}>AI</Text>
        </View>
      </View>
      <View style={styles.cardFoot}>
        <View style={[styles.statusChip, { backgroundColor: cfg.color + '14' }]}>
          <Icon name={cfg.icon} size={12} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}> {cfg.label}</Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(app.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </Text>
        <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
          <Text style={styles.viewBtnText}>Review →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function JobApplicationsScreen({ route, navigation }: any) {
  const { jobId, jobTitle } = route.params || { jobId: '1', jobTitle: 'Mathematics Teacher' };
  const [tab, setTab] = useState('All');
  const { data: apiApps } = useJobApplications(jobId);

  const all = apiApps?.length ? apiApps : MOCK_APPS;
  const filtered = all.filter((a: any) => {
    if (tab === 'All') return true;
    if (tab === 'Applied') return a.status === 'applied';
    if (tab === 'Screening') return a.status === 'screening';
    if (tab === 'Interview') return a.status?.includes('interview');
    if (tab === 'Offered') return a.status === 'offered';
    return true;
  });

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{jobTitle || 'Applications'}</Text>
          <Text style={styles.headerSub}>{all.length} candidates · {filtered.length} shown</Text>
        </View>
        <TouchableOpacity style={styles.aiBtn} onPress={() => navigation.navigate('AIInterviewManage', { jobId })}>
          <Icon name="sparkles" size={16} color={COLORS.primary} />
          <Text style={styles.aiBtnText}> AI Screen</Text>
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(a: any) => a._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <AppCard
            app={item}
            onPress={() => navigation.navigate('Candidates', { screen: 'CandidateProfile', params: { candidate: { name: `${item.teacherId?.firstName} ${item.teacherId?.lastName}`, role: item.teacherId?.subjects?.[0], score: item.scortenReputationScore, city: item.city, exp: item.exp } } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="people-outline" size={52} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No applications yet</Text>
            <Text style={styles.emptySub}>Candidates will appear here</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },
  aiBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.full,
  },
  aiBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screen, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: { paddingVertical: 14, marginRight: 18, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '800' },

  list: { padding: SPACING.screen },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  subj: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  scoreBadge: { width: 48, height: 48, borderRadius: 13, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 16, fontWeight: '900' },
  scoreLbl: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  cardFoot: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, gap: 8 },
  statusChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 11, fontWeight: '700' },
  dateText: { fontSize: 11, color: COLORS.textMuted, flex: 1 },
  viewBtn: {},
  viewBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textSecondary },
});
