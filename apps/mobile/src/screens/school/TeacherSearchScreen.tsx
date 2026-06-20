import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_TEACHERS = [
  { id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', score: 94, exp: '5 yrs', city: 'Delhi', board: 'CBSE', isOpen: true, premium: true },
  { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', score: 88, exp: '8 yrs', city: 'Mumbai', board: 'ICSE', isOpen: true, premium: false },
  { id: '3', name: 'Anjali Patel', role: 'English Teacher', score: 76, exp: '3 yrs', city: 'Ahmedabad', board: 'CBSE', isOpen: false, premium: false },
  { id: '4', name: 'Neha Gupta', role: 'Chemistry Teacher', score: 91, exp: '6 yrs', city: 'Jaipur', board: 'State', isOpen: true, premium: true },
  { id: '5', name: 'Arun Singh', role: 'Science Teacher', score: 82, exp: '4 yrs', city: 'Pune', board: 'CBSE', isOpen: true, premium: false },
  { id: '6', name: 'Kavya Nair', role: 'History Teacher', score: 96, exp: '9 yrs', city: 'Chennai', board: 'CBSE', isOpen: true, premium: true },
];

const SUBJECT_FILTERS = ['All', 'Mathematics', 'Science', 'English', 'Physics', 'Chemistry'];

export function TeacherSearchScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = MOCK_TEACHERS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.role.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subject === 'All' || t.role.toLowerCase().includes(subject.toLowerCase());
    const matchesOpen = !openOnly || t.isOpen;
    return matchesSearch && matchesSubject && matchesOpen;
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Find Teachers</Text>
        <Text style={styles.subtitle}>{filtered.length} teachers available</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchArea}>
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, subject, city..."
            placeholderTextColor={COLORS.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: COLORS.textMuted, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, openOnly && styles.toggleBtnActive]}
            onPress={() => setOpenOnly(!openOnly)}
          >
            <Text style={[styles.toggleText, openOnly && styles.toggleTextActive]}>
              🟢 Open to Work
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subject scroll */}
      <FlatList
        horizontal
        data={SUBJECT_FILTERS}
        keyExtractor={s => s}
        contentContainerStyle={styles.subjectList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.subjectChip, subject === item && styles.subjectChipActive]}
            onPress={() => setSubject(item)}
          >
            <Text style={[styles.subjectText, subject === item && styles.subjectTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CandidateProfile', { candidate: item })}
          >
            <View style={styles.cardTop}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 26 }}>👩‍🏫</Text>
                </View>
                {item.isOpen && <View style={styles.onlineDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.premium && <Text style={styles.premiumBadge}>⭐ Premium</Text>}
                </View>
                <Text style={styles.role}>{item.role}</Text>
                <Text style={styles.meta}>📍 {item.city} • {item.exp} • {item.board}</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreText}>{item.score}</Text>
                <Text style={styles.scoreLabel}>AI Score</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              {item.isOpen && (
                <View style={styles.openBadge}>
                  <Text style={styles.openText}>Open to Work</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.inviteBtn}
                onPress={() => navigation.navigate('CandidateProfile', { candidate: item })}
              >
                <Text style={styles.inviteText}>View Profile →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No teachers found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 12,
    backgroundColor: COLORS.primaryBg,
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },

  searchArea: { backgroundColor: COLORS.primaryBg, paddingBottom: 16, paddingHorizontal: SPACING.screen },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    paddingHorizontal: 16, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 12 },
  filterRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  toggleBtnActive: { backgroundColor: COLORS.successBg, borderColor: COLORS.success },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  toggleTextActive: { color: COLORS.successDark },

  subjectList: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  subjectChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  subjectChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  subjectText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  subjectTextActive: { color: '#FFF' },

  list: { padding: SPACING.screen, paddingTop: 0 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  premiumBadge: { fontSize: 11, color: '#F59E0B', fontWeight: '700' },
  role: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  meta: { fontSize: 12, color: COLORS.textMuted },
  scoreBox: {
    alignItems: 'center', backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.lg,
  },
  scoreText: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  scoreLabel: { fontSize: 10, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase' },

  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  openBadge: {
    backgroundColor: COLORS.successBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  openText: { fontSize: 12, color: COLORS.successDark, fontWeight: '700' },
  inviteBtn: { flex: 1, alignItems: 'flex-end' },
  inviteText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary },
});
