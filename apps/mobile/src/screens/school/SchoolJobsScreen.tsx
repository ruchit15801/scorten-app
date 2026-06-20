import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useMyJobs } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_JOBS = [
  { id: '1', title: 'Senior Mathematics Teacher', status: 'active', candidates: 24, posted: '2d ago', subject: 'Mathematics', salaryMin: 35000, salaryMax: 55000 },
  { id: '2', title: 'English & Literature Teacher', status: 'active', candidates: 18, posted: '5d ago', subject: 'English', salaryMin: 40000, salaryMax: 60000 },
  { id: '3', title: 'Physics Teacher – JEE', status: 'active', candidates: 42, posted: '1w ago', subject: 'Physics', salaryMin: 50000, salaryMax: 80000 },
  { id: '4', title: 'Hindi Language Teacher', status: 'closed', candidates: 9, posted: '1m ago', subject: 'Hindi', salaryMin: 20000, salaryMax: 32000 },
  { id: '5', title: 'Computer Science Teacher', status: 'draft', candidates: 0, posted: 'Draft', subject: 'Computer Science', salaryMin: 35000, salaryMax: 50000 },
];

const STATUS_CFG: any = {
  active: { label: 'Active', color: COLORS.success, bg: COLORS.successBg },
  closed: { label: 'Closed', color: COLORS.error, bg: COLORS.errorBg },
  draft: { label: 'Draft', color: COLORS.textMuted, bg: COLORS.backgroundAlt },
};

const FILTER_TABS = ['All', 'Active', 'Draft', 'Closed'];

function JobCard({ job, onPress }: any) {
  const status = STATUS_CFG[job.status] || STATUS_CFG.active;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View style={styles.subjectIcon}>
          <Text style={{ fontSize: 22 }}>📚</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.jobSubject}>{job.subject}</Text>
          <Text style={styles.jobSalary}>₹{(job.salaryMin / 1000).toFixed(0)}k – ₹{(job.salaryMax / 1000).toFixed(0)}k/mo</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerInfo}>🕐 Posted {job.posted}</Text>
        <View style={styles.candidatesBadge}>
          <Text style={styles.candidatesText}>👥 {job.candidates} candidates</Text>
        </View>
        {job.status === 'active' && (
          <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
            <Text style={styles.viewBtnText}>View →</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function SchoolJobsScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All');
  const { data: apiJobs } = useMyJobs();

  const jobs = (apiJobs?.length ? apiJobs : MOCK_JOBS).filter((j: any) => {
    if (activeFilter === 'All') return true;
    return j.status === activeFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Postings</Text>
        <TouchableOpacity style={styles.postBtn} onPress={() => navigation.navigate('CreateJob')}>
          <Text style={styles.postBtnText}>+ Post Job</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.miniStats}>
        {[
          { label: 'Total Jobs', value: MOCK_JOBS.length, color: COLORS.primary },
          { label: 'Active', value: MOCK_JOBS.filter(j => j.status === 'active').length, color: COLORS.success },
          { label: 'Total Candidates', value: MOCK_JOBS.reduce((a, j) => a + j.candidates, 0), color: '#8B5CF6' },
        ].map(s => (
          <View key={s.label} style={styles.miniStatItem}>
            <Text style={[styles.miniStatVal, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.miniStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter tabs */}
      <FlatList
        horizontal
        data={FILTER_TABS}
        keyExtractor={t => t}
        contentContainerStyle={styles.filterRow}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === item && styles.filterTabActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[styles.filterTabText, activeFilter === item && styles.filterTabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={jobs}
        keyExtractor={(j: any) => j.id || j._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobApplications', { jobId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📭</Text>
            <Text style={styles.emptyTitle}>No jobs in this category</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CreateJob')}>
              <Text style={styles.emptyBtnText}>Post Your First Job</Text>
            </TouchableOpacity>
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
  headerTitle: { fontSize: 26, fontWeight: '900', color: COLORS.text },
  postBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  postBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  miniStats: {
    flexDirection: 'row', backgroundColor: COLORS.primaryBg,
    paddingHorizontal: SPACING.screen, paddingBottom: 20,
  },
  miniStatItem: { flex: 1, alignItems: 'center' },
  miniStatVal: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  miniStatLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  filterRow: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  filterTab: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  filterTabTextActive: { color: '#FFF' },

  list: { padding: SPACING.screen, paddingTop: 0 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  subjectIcon: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  jobTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2, lineHeight: 20 },
  jobSubject: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  jobSalary: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700' },

  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footerInfo: { fontSize: 12, color: COLORS.textMuted, flex: 1 },
  candidatesBadge: { backgroundColor: COLORS.backgroundAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  candidatesText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  viewBtn: {},
  viewBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
  emptyBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingHorizontal: 28, paddingVertical: 14 },
  emptyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
