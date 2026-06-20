import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useMyJobs } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK = [
  { id: '1', title: 'Senior Mathematics Teacher',  status: 'active',  candidates: 24, posted: '2d ago',  subject: 'Mathematics', salaryMin: 35000, salaryMax: 55000 },
  { id: '2', title: 'English & Literature Teacher', status: 'active',  candidates: 18, posted: '5d ago',  subject: 'English',     salaryMin: 40000, salaryMax: 60000 },
  { id: '3', title: 'Physics Teacher – JEE',        status: 'active',  candidates: 42, posted: '1w ago',  subject: 'Physics',     salaryMin: 50000, salaryMax: 80000 },
  { id: '4', title: 'Hindi Language Teacher',       status: 'closed',  candidates: 9,  posted: '1mo ago', subject: 'Hindi',       salaryMin: 20000, salaryMax: 32000 },
  { id: '5', title: 'Computer Science Teacher',     status: 'draft',   candidates: 0,  posted: 'Draft',   subject: 'Computer',    salaryMin: 35000, salaryMax: 50000 },
];

const STATUS: any = {
  active: { label: 'Active', color: COLORS.success },
  closed: { label: 'Closed', color: COLORS.error },
  draft:  { label: 'Draft',  color: COLORS.textMuted },
};

const FILTERS = ['All', 'Active', 'Draft', 'Closed'];

const SUBJECT_ICONS: any = {
  Mathematics: '📐', Physics: '⚛️', Chemistry: '🧪', English: '📖',
  Hindi: '🔤', Science: '🔬', Computer: '💻', History: '📜', default: '📚',
};

function JobCard({ job, onPress }: any) {
  const s = STATUS[job.status] || STATUS.active;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View style={styles.subjectIcon}>
          <Text style={{ fontSize: 24 }}>{SUBJECT_ICONS[job.subject] || SUBJECT_ICONS.default}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.cardSubject}>{job.subject}</Text>
          <Text style={styles.cardSalary}>₹{(job.salaryMin / 1000).toFixed(0)}k – ₹{(job.salaryMax / 1000).toFixed(0)}k/mo</Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: s.color + '18' }]}>
          <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>
      <View style={styles.cardFoot}>
        <View style={styles.footLeft}>
          <Icon name="time-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.footText}> {job.posted}</Text>
        </View>
        <View style={styles.footRight}>
          <Icon name="people-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.footText}> {job.candidates} applicants</Text>
        </View>
        {job.status === 'active' && (
          <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
            <Text style={styles.viewBtnText}>Review →</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function SchoolJobsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('All');
  const { data: apiJobs } = useMyJobs();

  const all = (apiJobs?.length ? apiJobs : MOCK);
  const jobs = all.filter((j: any) => filter === 'All' || j.status === filter.toLowerCase());

  const active = all.filter((j: any) => j.status === 'active').length;
  const totalCandidates = all.reduce((s: number, j: any) => s + (j.candidates || 0), 0);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Job Postings</Text>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => navigation.navigate('CreateJob')}
          >
            <Icon name="add" size={18} color={COLORS.primary} />
            <Text style={styles.postBtnText}> Post Job</Text>
          </TouchableOpacity>
        </View>
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total Jobs',  value: all.length,        color: '#FFF'          },
            { label: 'Active',      value: active,            color: '#86EFAC'       },
            { label: 'Candidates',  value: totalCandidates,   color: '#FCD34D'       },
          ].map((s, i) => (
            <View key={s.label} style={[styles.statItem, i > 0 && styles.statBorder]}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(j: any) => j.id || j._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobApplications', { jobId: item.id || item._id, jobTitle: item.title })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="briefcase-outline" size={52} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No jobs here</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CreateJob')}>
              <Icon name="add" size={16} color="#FFF" />
              <Text style={styles.emptyBtnText}> Post First Job</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  postBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 9, borderRadius: RADIUS.full,
  },
  postBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#FFFFFF20', paddingVertical: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderLeftColor: '#FFFFFF30' },
  statVal: { fontSize: 20, fontWeight: '900', marginBottom: 2 },
  statLbl: { fontSize: 10, color: '#FFFFFFAA', fontWeight: '600' },

  filterRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface, paddingHorizontal: SPACING.screen,
    paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundAlt, borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },

  list: { padding: SPACING.screen },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  subjectIcon: {
    width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3, lineHeight: 20 },
  cardSubject: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  cardSalary: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardFoot: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, gap: 6 },
  footLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  footRight: { flexDirection: 'row', alignItems: 'center' },
  footText: { fontSize: 12, color: COLORS.textMuted },
  viewBtn: { marginLeft: 8 },
  viewBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 16 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: RADIUS.xl },
  emptyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
