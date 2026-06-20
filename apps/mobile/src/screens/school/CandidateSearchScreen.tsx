import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS = ['All', 'Math', 'Physics', 'English', 'Hindi', 'Science', 'Computer'];

const MOCK = [
  { id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', exp: '5 yrs', score: 94, city: 'Delhi', status: 'Available', open: true },
  { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', exp: '8 yrs', score: 88, city: 'Mumbai', status: 'Interviewing', open: false },
  { id: '3', name: 'Anjali Patel', role: 'English Teacher', exp: '3 yrs', score: 91, city: 'Ahmedabad', status: 'Available', open: true },
  { id: '4', name: 'Rohit Mishra', role: 'Chemistry Teacher', exp: '6 yrs', score: 85, city: 'Pune', status: 'Available', open: true },
  { id: '5', name: 'Sonal Joshi', role: 'Computer Science', exp: '4 yrs', score: 79, city: 'Surat', status: 'Available', open: false },
];

const STATUS_COLOR: any = {
  Available: COLORS.success,
  Interviewing: COLORS.warning,
  Hired: COLORS.primary,
};

function CandidateCard({ item, onPress }: any) {
  const scoreColor = item.score >= 88 ? COLORS.success : item.score >= 75 ? COLORS.warning : COLORS.error;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardRow}>
        <View style={styles.avatar}>
          <Icon name="person" size={24} color={COLORS.primary} />
          {item.open && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardRole}>{item.role}</Text>
          <View style={styles.cardMeta}>
            <Icon name="location-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}> {item.city}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Icon name="time-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}> {item.exp}</Text>
          </View>
        </View>
        <View style={styles.scoreWrap}>
          <View style={[styles.scoreBadge, { borderColor: scoreColor, backgroundColor: scoreColor + '12' }]}>
            <Text style={[styles.scoreNum, { color: scoreColor }]}>{item.score}</Text>
            <Text style={[styles.scoreLabel, { color: scoreColor }]}>AI</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLOR[item.status] || COLORS.textMuted) + '18' }]}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[item.status] || COLORS.textMuted }]} />
          <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] || COLORS.textMuted }]}>{item.status}</Text>
        </View>
        <Text style={styles.viewLink}>View Profile →</Text>
      </View>
    </TouchableOpacity>
  );
}

export function CandidateSearchScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = MOCK.filter(c => {
    const s = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    const sub = subject === 'All' || c.role.toLowerCase().includes(subject.toLowerCase());
    const open = !openOnly || c.open;
    return s && sub && open;
  });

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Candidates</Text>
        <Text style={styles.headerSub}>{filtered.length} teachers found</Text>

        <View style={styles.searchBar}>
          <Icon name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, subject..."
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

      {/* Filter Chips + Toggle */}
      <View style={styles.filtersArea}>
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
        <TouchableOpacity
          style={[styles.openToggle, openOnly && styles.openToggleActive]}
          onPress={() => setOpenOnly(!openOnly)}
        >
          <Icon name="flash" size={14} color={openOnly ? '#FFF' : COLORS.textSecondary} />
          <Text style={[styles.openToggleText, openOnly && { color: '#FFF' }]}> Open to Work</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CandidateCard
            item={item}
            onPress={() => navigation.navigate('CandidateProfile', { candidate: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="people-outline" size={52} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No candidates found</Text>
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
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 2 },
  headerSub: { fontSize: 13, color: '#FFFFFFBB', marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF', borderRadius: RADIUS.xl,
    paddingHorizontal: 14, paddingVertical: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 13 },

  filtersArea: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  chipsRow: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  chip: {
    backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  openToggle: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.screen, marginBottom: 12, alignSelf: 'flex-start',
    backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: COLORS.border,
  },
  openToggleActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  openToggleText: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },

  list: { padding: SPACING.screen },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success,
    borderWidth: 2, borderColor: COLORS.surface,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  cardRole: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  metaDot: { fontSize: 11, color: COLORS.textMuted, paddingHorizontal: 4 },
  scoreWrap: {},
  scoreBadge: {
    width: 52, height: 52, borderRadius: 14, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreNum: { fontSize: 17, fontWeight: '900' },
  scoreLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },

  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10,
  },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '700' },
  viewLink: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textSecondary },
});
