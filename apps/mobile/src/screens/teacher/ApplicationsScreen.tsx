import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useMyApplications } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const STATUS_CONFIG: any = {
  applied:              { label: 'Applied',            color: COLORS.primary,    icon: 'document-text-outline' },
  screening:            { label: 'AI Screening',       color: '#8B5CF6',          icon: 'sparkles' },
  interview_scheduled:  { label: 'Interview Pending',  color: COLORS.warning,    icon: 'mic-outline' },
  interview_completed:  { label: 'Under Review',       color: COLORS.primary,    icon: 'eye-outline' },
  offered:              { label: 'Offer Received 🎉',  color: COLORS.success,    icon: 'ribbon' },
  rejected:             { label: 'Not Selected',       color: COLORS.error,      icon: 'close-circle' },
};

const MOCK_APPS = [
  { _id: '1', status: 'applied',             createdAt: new Date().toISOString(), jobId: { title: 'English Teacher',        schoolId: { schoolName: "St. Xavier's" },     city: 'Mumbai'     } },
  { _id: '2', status: 'interview_scheduled',  createdAt: new Date().toISOString(), jobId: { title: 'Senior Math Teacher',    schoolId: { schoolName: 'DPS New Delhi' },    city: 'New Delhi'  } },
  { _id: '3', status: 'offered',             createdAt: new Date().toISOString(), jobId: { title: 'Physics Teacher',        schoolId: { schoolName: 'Allen Institute' },  city: 'Kota'       } },
  { _id: '4', status: 'screening',           createdAt: new Date().toISOString(), jobId: { title: 'Computer Science',       schoolId: { schoolName: 'Inventure Academy'}, city: 'Bengaluru'  } },
];

const TABS = [
  { key: 'all',          label: 'All',          statuses: ['applied', 'screening', 'interview_scheduled', 'interview_completed', 'offered', 'rejected'] },
  { key: 'active',       label: 'Active',       statuses: ['applied', 'screening'] },
  { key: 'interviewing', label: 'Interviewing', statuses: ['interview_scheduled', 'interview_completed'] },
  { key: 'offers',       label: 'Offers',       statuses: ['offered'] },
];

function AppCard({ app, navigation }: any) {
  const job = app.jobId || {};
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
  const isInterview = app.status === 'interview_scheduled';
  const isOffer = app.status === 'offered';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ApplicationDetail', { application: app })}
      activeOpacity={0.85}
    >
      <View style={styles.cardTop}>
        <View style={styles.schoolIcon}>
          <Icon name="school" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>{job.title || 'Teacher Position'}</Text>
          <Text style={styles.schoolName}>{job.schoolId?.schoolName || 'School'}</Text>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}> {job.city || 'India'}</Text>
          </View>
        </View>
        <View style={[styles.statusPill, { backgroundColor: cfg.color + '18' }]}>
          <Icon name={cfg.icon} size={13} color={cfg.color} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <View style={[styles.statusBadge, { backgroundColor: cfg.color + '12', borderColor: cfg.color + '30' }]}>
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        {isInterview && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AIInterview')}
          >
            <Icon name="mic" size={14} color="#FFF" />
            <Text style={styles.actionBtnText}> Start Interview</Text>
          </TouchableOpacity>
        )}
        {isOffer && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.success }]}>
            <Icon name="eye-outline" size={14} color="#FFF" />
            <Text style={styles.actionBtnText}> View Offer</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.dateText}>
          {new Date(app.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function ApplicationsScreen({ navigation }: any) {
  const [tab, setTab] = useState('all');
  const { data: applications } = useMyApplications();

  const apps = (applications?.length ? applications : MOCK_APPS).filter((a: any) => {
    const found = TABS.find(t => t.key === tab);
    return found?.statuses.includes(a.status);
  });

  const counts = (applications?.length ? applications : MOCK_APPS).reduce((acc: any, a: any) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as any);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applications</Text>
        <Text style={styles.headerSub}>{(applications?.length ? applications : MOCK_APPS).length} total applications</Text>

        {/* Stats */}
        <View style={styles.headerStats}>
          {[
            { label: 'Active', val: (counts.applied || 0) + (counts.screening || 0), color: COLORS.primary },
            { label: 'Interviews', val: counts.interview_scheduled || 0, color: COLORS.warning },
            { label: 'Offers', val: counts.offered || 0, color: COLORS.success },
          ].map((s, i) => (
            <View key={s.label} style={[styles.headerStat, i > 0 && { borderLeftWidth: 1, borderLeftColor: '#FFFFFF30' }]}>
              <Text style={[styles.headerStatVal, { color: s.color === COLORS.primary ? '#FFF' : s.color }]}>{s.val}</Text>
              <Text style={styles.headerStatLbl}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsRow}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={apps}
        keyExtractor={(a: any) => a._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => <AppCard app={item} navigation={navigation} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="document-text-outline" size={52} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No applications</Text>
            <Text style={styles.emptySub}>Apply to jobs to see them here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 0,
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 2 },
  headerSub: { fontSize: 13, color: '#FFFFFFBB', marginBottom: 16 },
  headerStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#FFFFFF20', paddingVertical: 14 },
  headerStat: { flex: 1, alignItems: 'center', paddingLeft: 0 },
  headerStatVal: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  headerStatLbl: { fontSize: 11, color: '#FFFFFFAA', fontWeight: '600' },

  tabsRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.screen,
  },
  tab: { marginRight: 20, paddingVertical: 14, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '800' },

  list: { padding: SPACING.screen },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  schoolIcon: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  jobTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  schoolName: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: COLORS.textMuted },
  statusPill: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 10 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full,
  },
  actionBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  dateText: { fontSize: 11, color: COLORS.textMuted, marginLeft: 'auto' as any },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textSecondary },
});
