import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { useTeachers } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS = ['All', 'Math', 'Physics', 'Chemistry', 'English', 'Computer', 'Hindi', 'Science'];
const EXP_FILTERS = ['Any', '0–2 yr', '3–5 yr', '6–10 yr', '10+ yr'];

const MOCK = [
  { _id: '1', firstName: 'Priya',  lastName: 'Sharma',  subjects: ['Mathematics'], city: 'Delhi',     exp: 5,  score: 94, open: true,  board: 'CBSE' },
  { _id: '2', firstName: 'Rahul',  lastName: 'Desai',   subjects: ['Physics'],     city: 'Mumbai',    exp: 8,  score: 88, open: false, board: 'CBSE' },
  { _id: '3', firstName: 'Anjali', lastName: 'Patel',   subjects: ['English'],     city: 'Ahmedabad', exp: 3,  score: 91, open: true,  board: 'ICSE' },
  { _id: '4', firstName: 'Rohit',  lastName: 'Mishra',  subjects: ['Chemistry'],   city: 'Pune',      exp: 6,  score: 85, open: true,  board: 'CBSE' },
  { _id: '5', firstName: 'Sonal',  lastName: 'Joshi',   subjects: ['Computer Science'], city: 'Surat', exp: 4, score: 79, open: false, board: 'CBSE' },
  { _id: '6', firstName: 'Vikram', lastName: 'Singh',   subjects: ['Mathematics'], city: 'Jaipur',    exp: 10, score: 92, open: true,  board: 'CBSE' },
];

function TeacherCard({ t, onPress, onContact }: any) {
  const scoreColor = t.score >= 88 ? COLORS.success : t.score >= 74 ? COLORS.warning : COLORS.error;
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={styles.cardRow}>
          <View style={styles.avatar}>
            <Icon name="person" size={24} color={COLORS.primary} />
            {t.open && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{t.firstName} {t.lastName}</Text>
            <Text style={styles.subj}>{t.subjects?.[0]} · {t.board}</Text>
            <View style={styles.metaRow}>
              <Icon name="location-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.meta}> {t.city}</Text>
              <Text style={styles.metaDot}> · </Text>
              <Icon name="time-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.meta}> {t.exp} yrs</Text>
            </View>
          </View>
          <View style={[styles.scoreBox, { borderColor: scoreColor + '40', backgroundColor: scoreColor + '12' }]}>
            <Text style={[styles.scoreNum, { color: scoreColor }]}>{t.score}</Text>
            <Text style={[styles.scoreLbl, { color: scoreColor }]}>AI</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.cardFoot}>
        <View style={[styles.openChip, { backgroundColor: t.open ? COLORS.successBg : COLORS.backgroundAlt }]}>
          <View style={[styles.openDot, { backgroundColor: t.open ? COLORS.success : COLORS.textMuted }]} />
          <Text style={[styles.openText, { color: t.open ? COLORS.success : COLORS.textMuted }]}>
            {t.open ? 'Open to Work' : 'Not Active'}
          </Text>
        </View>
        <TouchableOpacity style={styles.contactBtn} onPress={onContact}>
          <Icon name="mail-outline" size={14} color={COLORS.primary} />
          <Text style={styles.contactBtnText}> Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewProfileBtn} onPress={onPress}>
          <Icon name="eye-outline" size={14} color={COLORS.primary} />
          <Text style={styles.contactBtnText}> Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function TeacherSearchScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [expFilter, setExpFilter] = useState('Any');
  const { data: apiTeachers } = useTeachers({ subject: subject !== 'All' ? subject : undefined });

  const all = apiTeachers?.length ? apiTeachers : MOCK;
  const filtered = all.filter((t: any) => {
    const s = !search || `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) || t.subjects?.some((x: string) => x.toLowerCase().includes(search.toLowerCase()));
    const sub = subject === 'All' || t.subjects?.some((x: string) => x.toLowerCase().includes(subject.toLowerCase()));
    let exp = true;
    if (expFilter !== 'Any') {
      const yrs = t.exp || t.experienceYears || 0;
      if (expFilter === '0–2 yr') exp = yrs <= 2;
      else if (expFilter === '3–5 yr') exp = yrs >= 3 && yrs <= 5;
      else if (expFilter === '6–10 yr') exp = yrs >= 6 && yrs <= 10;
      else if (expFilter === '10+ yr') exp = yrs > 10;
    }
    return s && sub && exp;
  });

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher Search</Text>
        <Text style={styles.headerSub}>{filtered.length} teachers available</Text>
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

      {/* Subject chips */}
      <View style={styles.filterSection}>
        <FlatList
          data={SUBJECTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={x => x}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, subject === item && styles.chipOn]}
              onPress={() => setSubject(item)}
            >
              <Text style={[styles.chipText, subject === item && styles.chipTextOn]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <FlatList
          data={EXP_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={x => x}
          contentContainerStyle={[styles.chipsRow, { paddingTop: 0 }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, expFilter === item && styles.chipOn]}
              onPress={() => setExpFilter(item)}
            >
              <Text style={[styles.chipText, expFilter === item && styles.chipTextOn]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t: any) => t._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <TeacherCard
            t={item}
            onPress={() => navigation.navigate('CandidateProfile', { candidate: { name: `${item.firstName} ${item.lastName}`, role: item.subjects?.[0], score: item.score, city: item.city, exp: `${item.exp || item.experienceYears} yrs` } })}
            onContact={() => navigation.navigate('Messages')}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="people-outline" size={52} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No teachers found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 2 },
  headerSub: { fontSize: 13, color: '#FFFFFFBB', marginBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF', borderRadius: RADIUS.xl, paddingHorizontal: 14, paddingVertical: 2 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 13 },

  filterSection: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  chipsRow: { paddingHorizontal: SPACING.screen, paddingVertical: 10, gap: 8 },
  chip: { backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: COLORS.border },
  chipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  chipTextOn: { color: '#FFF' },

  list: { padding: SPACING.screen },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 52, height: 52, borderRadius: 15, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  subj: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  meta: { fontSize: 11, color: COLORS.textMuted },
  metaDot: { fontSize: 11, color: COLORS.textMuted },
  scoreBox: { width: 52, height: 52, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 17, fontWeight: '900' },
  scoreLbl: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },

  cardFoot: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  openChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  openDot: { width: 6, height: 6, borderRadius: 3 },
  openText: { fontSize: 11, fontWeight: '700' },
  contactBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryBg, marginLeft: 'auto' as any },
  viewProfileBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.backgroundAlt },
  contactBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
});
