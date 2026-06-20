import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS = ['All', 'Math', 'English', 'Science', 'Hindi', 'Physics', 'Computer'];

const MOCK_JOBS = [
  { _id: '1', title: 'Senior Mathematics Teacher', isFeatured: true, subjects: ['Mathematics'], city: 'New Delhi', state: 'Delhi', jobType: 'full_time', salaryMin: 35000, salaryMax: 55000, matchScore: 95, totalApplications: 24, schoolId: { schoolName: 'Delhi Public School', rating: 4.5 } },
  { _id: '2', title: 'English & Literature Teacher', isFeatured: false, subjects: ['English'], city: 'Mumbai', state: 'Maharashtra', jobType: 'full_time', salaryMin: 40000, salaryMax: 60000, matchScore: 82, totalApplications: 18, schoolId: { schoolName: "St. Xavier's School", rating: 4.8 } },
  { _id: '3', title: 'Physics Teacher – JEE Focus', isFeatured: true, subjects: ['Physics'], city: 'Kota', state: 'Rajasthan', jobType: 'full_time', salaryMin: 50000, salaryMax: 80000, matchScore: 88, totalApplications: 42, schoolId: { schoolName: 'Allen Career Institute', rating: 4.9 } },
  { _id: '4', title: 'Hindi Language Teacher', isFeatured: false, subjects: ['Hindi'], city: 'Ahmedabad', state: 'Gujarat', jobType: 'part_time', salaryMin: 20000, salaryMax: 32000, matchScore: 65, totalApplications: 9, schoolId: { schoolName: 'Navrachna School', rating: 4.2 } },
  { _id: '5', title: 'Computer Science Teacher', isFeatured: false, subjects: ['Computer'], city: 'Bengaluru', state: 'Karnataka', jobType: 'full_time', salaryMin: 45000, salaryMax: 70000, matchScore: 79, totalApplications: 31, schoolId: { schoolName: 'Inventure Academy', rating: 4.7 } },
];

function JobCard({ job, onPress, isSaved, onSave }: any) {
  const matchColor = job.matchScore >= 85 ? COLORS.success : job.matchScore >= 70 ? COLORS.warning : COLORS.textMuted;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {job.isFeatured && (
        <View style={styles.featuredTag}>
          <Icon name="star" size={11} color="#92400E" />
          <Text style={styles.featuredText}> Featured</Text>
        </View>
      )}
      <View style={styles.cardTop}>
        <View style={styles.schoolIcon}>
          <Icon name="school" size={26} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.schoolName}>{job.schoolId?.schoolName}</Text>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}> {job.city}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <TouchableOpacity onPress={() => onSave(job._id)} style={styles.saveBtn}>
            <Icon name={isSaved ? 'heart' : 'heart-outline'} size={20} color={isSaved ? '#EF4444' : COLORS.textMuted} />
          </TouchableOpacity>
          <View style={[styles.matchBadge, { backgroundColor: matchColor + '18' }]}>
            <Text style={[styles.matchText, { color: matchColor }]}>{job.matchScore}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottom}>
        <View style={styles.salaryTag}>
          <Icon name="cash-outline" size={13} color={COLORS.primary} />
          <Text style={styles.salaryText}> ₹{(job.salaryMin / 1000).toFixed(0)}k–₹{(job.salaryMax / 1000).toFixed(0)}k</Text>
        </View>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{job.jobType?.replace('_', ' ')}</Text>
        </View>
        <View style={styles.appsTag}>
          <Icon name="people-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.appsText}> {job.totalApplications}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function JobsScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [saved, setSaved] = useState<string[]>([]);

  const filtered = MOCK_JOBS.filter(j => {
    const s = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.schoolId.schoolName.toLowerCase().includes(search.toLowerCase());
    const sub = subject === 'All' || j.subjects.some(x => x.toLowerCase().includes(subject.toLowerCase()));
    return s && sub;
  });

  const toggleSave = (id: string) => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Find Jobs</Text>
            <Text style={styles.headerSub}>{filtered.length} openings near you</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('JobFilters')}>
            <Icon name="filter-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, schools..."
            placeholderTextColor={COLORS.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Subject Chips */}
      <FlatList
        data={SUBJECTS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i}
        contentContainerStyle={styles.chipsRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, subject === item && styles.chipActive]}
            onPress={() => setSubject(item)}
          >
            <Text style={[styles.chipText, subject === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={j => j._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            isSaved={saved.includes(item._id)}
            onSave={toggleSave}
            onPress={() => navigation.navigate('JobDetail', { jobId: item._id, job: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="search-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySub}>Try different filters</Text>
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
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 20,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 13, color: '#FFFFFFBB', marginTop: 2 },
  filterBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF20',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFFFFF30',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF', borderRadius: RADIUS.xl,
    paddingHorizontal: 14, paddingVertical: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 13 },

  chipsRow: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  chip: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },

  list: { paddingHorizontal: SPACING.screen, paddingBottom: 20 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  featuredTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF3C7', borderRadius: RADIUS.full,
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, marginBottom: 10,
  },
  featuredText: { fontSize: 11, color: '#92400E', fontWeight: '700' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  schoolIcon: {
    width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  jobTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3, lineHeight: 20 },
  schoolName: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: COLORS.textMuted },
  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  saveBtn: { padding: 3, marginBottom: 8 },
  matchBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  matchText: { fontSize: 12, fontWeight: '800' },
  cardDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: 12 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  salaryTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full,
  },
  salaryText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  typeTag: {
    backgroundColor: COLORS.backgroundAlt, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full,
  },
  typeText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', textTransform: 'capitalize' },
  appsTag: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' as any },
  appsText: { fontSize: 12, color: COLORS.textMuted },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textSecondary },
});
