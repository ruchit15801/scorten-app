import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, RefreshControl,
} from 'react-native';
import { useJobs } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS = ['All', 'Math', 'English', 'Science', 'Hindi', 'Social', 'Computer'];
const JOB_TYPES = ['All', 'Full Time', 'Part Time', 'Temporary'];

function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, selected && styles.filterChipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function JobCard({ job, onPress, isSaved, onSave }: any) {
  return (
    <TouchableOpacity style={styles.jobCard} onPress={onPress} activeOpacity={0.85}>
      {job.isFeatured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>⭐ Featured</Text>
        </View>
      )}

      <View style={styles.jobTop}>
        <View style={styles.schoolLogo}>
          <Text style={{ fontSize: 26 }}>🏫</Text>
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.schoolName}>{job.schoolId?.schoolName || 'School'}</Text>
          <Text style={styles.location}>📍 {job.city}, {job.state}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(job._id)}>
            <Text style={{ fontSize: 20 }}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          {job.matchScore && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>🤖 {job.matchScore}% Match</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.jobDivider} />

      <View style={styles.jobBottom}>
        <View style={styles.salaryBadge}>
          <Text style={styles.salaryText}>
            ₹{(job.salaryMin / 1000).toFixed(0)}k – ₹{(job.salaryMax / 1000).toFixed(0)}k/mo
          </Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{job.jobType?.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.appsCount}>
          {job.totalApplications || 0} applicants
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const MOCK_JOBS = [
  {
    _id: '1', title: 'Senior Mathematics Teacher', isFeatured: true,
    subjects: ['Mathematics'], city: 'New Delhi', state: 'Delhi',
    jobType: 'full_time', salaryMin: 35000, salaryMax: 55000, matchScore: 95,
    totalApplications: 24, schoolId: { schoolName: 'Delhi Public School', rating: 4.5 },
  },
  {
    _id: '2', title: 'English & Literature Teacher', isFeatured: false,
    subjects: ['English'], city: 'Mumbai', state: 'Maharashtra',
    jobType: 'full_time', salaryMin: 40000, salaryMax: 60000, matchScore: 82,
    totalApplications: 18, schoolId: { schoolName: "St. Xavier's School", rating: 4.8 },
  },
  {
    _id: '3', title: 'Physics Teacher - JEE Focus', isFeatured: true,
    subjects: ['Physics'], city: 'Kota', state: 'Rajasthan',
    jobType: 'full_time', salaryMin: 50000, salaryMax: 80000, matchScore: 88,
    totalApplications: 42, schoolId: { schoolName: 'Allen Career Institute', rating: 4.9 },
  },
  {
    _id: '4', title: 'Primary School Hindi Teacher', isFeatured: false,
    subjects: ['Hindi'], city: 'Ahmedabad', state: 'Gujarat',
    jobType: 'part_time', salaryMin: 20000, salaryMax: 32000, matchScore: 65,
    totalApplications: 9, schoolId: { schoolName: 'Navrachna School', rating: 4.2 },
  },
];

export function JobsScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const filtered = MOCK_JOBS.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase())
      || j.schoolId.schoolName.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === 'All' || j.subjects.includes(selectedSubject);
    return matchSearch && matchSubject;
  });

  const toggleSave = (id: string) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Jobs</Text>
        <Text style={styles.headerSub}>{filtered.length} openings near you</Text>
      </View>

      {/* Search */}
      <View style={styles.searchArea}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.screen, gap: 12, marginBottom: 12 }}>
          <View style={[styles.searchBar, { flex: 1, marginHorizontal: 0, marginBottom: 0 }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, schools..."
              placeholderTextColor={COLORS.inputPlaceholder}
              value={search}
              onChangeText={setSearch}
            />
            {!!search && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={{ fontSize: 18, color: COLORS.textMuted }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('JobFilters')}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Subject filters */}
        <FlatList
          data={SUBJECTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <FilterChip
              label={item}
              selected={selectedSubject === item}
              onPress={() => setSelectedSubject(item)}
            />
          )}
        />
      </View>

      {/* Job List */}
      <FlatList
        data={filtered}
        keyExtractor={j => j._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            isSaved={savedJobs.includes(item._id)}
            onSave={toggleSave}
            onPress={() => navigation.navigate('JobDetail', { jobId: item._id, job: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySub}>Try different filters or search terms</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: COLORS.primaryBg,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  headerSub: { fontSize: 14, color: COLORS.textSecondary },

  searchArea: {
    backgroundColor: COLORS.primaryBg,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, marginHorizontal: SPACING.screen,
    paddingHorizontal: 16, paddingVertical: 4, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 12 },
  filterBtn: { 
    width: 48, height: 48, borderRadius: RADIUS.xl, 
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },

  filterRow: { paddingHorizontal: SPACING.screen, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: '#FFF' },

  list: { padding: SPACING.screen, gap: 0 },

  jobCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  featuredBadge: {
    alignSelf: 'flex-start', backgroundColor: '#FEF3C7',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full, marginBottom: 12,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  featuredText: { fontSize: 12, color: '#92400E', fontWeight: '700' },

  aiBadge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  aiBadgeText: { fontSize: 11, color: '#0369A1', fontWeight: '700' },

  jobTop: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  schoolLogo: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4, lineHeight: 21 },
  schoolName: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  location: { fontSize: 12, color: COLORS.textMuted },
  saveBtn: { padding: 4 },

  jobDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: 12 },

  jobBottom: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  salaryBadge: {
    backgroundColor: COLORS.primaryBg, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  salaryText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  tag: {
    backgroundColor: COLORS.backgroundAlt, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  tagText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500', textTransform: 'capitalize' },
  appsCount: { fontSize: 12, color: COLORS.textMuted, marginLeft: 'auto' as any },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary },
});
