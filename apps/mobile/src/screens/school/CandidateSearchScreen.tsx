import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_CANDIDATES = [
  { id: '1', name: 'Priya Sharma', role: 'Mathematics Teacher', experience: '5 Yrs', score: 94, status: 'New' },
  { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', experience: '8 Yrs', score: 88, status: 'Interviewed' },
  { id: '3', name: 'Anjali Patel', role: 'English Teacher', experience: '3 Yrs', score: 76, status: 'Shortlisted' },
];

export function CandidateSearchScreen({ navigation }: any) {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Candidates</Text>
        <Text style={styles.headerSub}>Discover top AI-matched teachers</Text>
      </View>

      <View style={styles.searchArea}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, subject..."
            placeholderTextColor={COLORS.inputPlaceholder}
            value={search} onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ fontSize: 18, color: COLORS.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CandidateProfile', { candidate: item })}
          >
            <View style={styles.cardTop}>
              <View style={styles.avatar}><Text style={{ fontSize: 24 }}>👩‍🏫</Text></View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.role}>{item.role}</Text>
                <Text style={styles.exp}>{item.experience} Exp</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreText}>{item.score}</Text>
                <Text style={styles.scoreLabel}>Match</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.cardBottom}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <Text style={styles.viewLink}>View Profile →</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>👥</Text>
            <Text style={styles.emptyTitle}>No candidates found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 16, backgroundColor: COLORS.primaryBg },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  headerSub: { fontSize: 14, color: COLORS.textSecondary },

  searchArea: { backgroundColor: COLORS.primaryBg, paddingBottom: 20, borderBottomLeftRadius: RADIUS['2xl'], borderBottomRightRadius: RADIUS['2xl'] },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.screen, paddingHorizontal: 16, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 12 },

  list: { padding: SPACING.screen },
  
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  role: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  exp: { fontSize: 12, color: COLORS.textMuted },
  
  scoreBox: { alignItems: 'center', backgroundColor: COLORS.successBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.md },
  scoreText: { fontSize: 16, fontWeight: '800', color: COLORS.successDark },
  scoreLabel: { fontSize: 10, fontWeight: '700', color: COLORS.success, textTransform: 'uppercase' },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
  
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { backgroundColor: COLORS.backgroundAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  viewLink: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
});
