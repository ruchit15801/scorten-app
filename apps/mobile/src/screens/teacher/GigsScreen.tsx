import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, TextInput,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const GIGS = [
  { id: '1', title: 'Online Math Tutor (Grade 8-10)', rate: '₹500/hr', posted: '2 days ago', status: 'active', bookings: 5 },
  { id: '2', title: 'CBSE Science Coaching', rate: '₹600/hr', posted: '1 week ago', status: 'active', bookings: 2 },
  { id: '3', title: 'JEE Mathematics Prep', rate: '₹800/hr', posted: '2 weeks ago', status: 'paused', bookings: 8 },
];

function GigCard({ gig, onEdit }: any) {
  return (
    <View style={styles.gigCard}>
      <View style={styles.gigTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.gigTitle}>{gig.title}</Text>
          <Text style={styles.gigRate}>{gig.rate}</Text>
          <Text style={styles.gigPosted}>Posted {gig.posted}</Text>
        </View>
        <View style={[styles.statusBadge, gig.status === 'paused' && { backgroundColor: COLORS.backgroundAlt }]}>
          <Text style={[styles.statusText, gig.status === 'paused' && { color: COLORS.textMuted }]}>
            {gig.status === 'active' ? '🟢 Active' : '⏸️ Paused'}
          </Text>
        </View>
      </View>

      <View style={styles.gigDivider} />

      <View style={styles.gigFooter}>
        <Text style={styles.bookingsText}>
          <Text style={{ color: COLORS.primary, fontWeight: '800' }}>{gig.bookings}</Text> Bookings
        </Text>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pauseBtn}>
          <Text style={styles.pauseBtnText}>{gig.status === 'active' ? 'Pause' : 'Activate'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function GigsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>My Gigs</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateGig')}>
          <Text style={styles.createBtnText}>+ New Gig</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Active Gigs', value: '2', color: COLORS.success },
          { label: 'Total Bookings', value: '15', color: COLORS.primary },
          { label: 'This Month', value: '₹24K', color: '#8B5CF6' },
        ].map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={GIGS}
        keyExtractor={g => g.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <GigCard gig={item} onEdit={() => {}} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📌</Text>
            <Text style={styles.emptyTitle}>No gigs yet</Text>
            <Text style={styles.emptySub}>Create your first tutoring gig to start earning</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CreateGig')}>
              <Text style={styles.emptyBtnText}>Create First Gig</Text>
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
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  createBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full },
  createBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: SPACING.screen, paddingBottom: 20,
    backgroundColor: COLORS.primaryBg,
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },

  list: { padding: SPACING.screen },
  gigCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  gigTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  gigTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  gigRate: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  gigPosted: { fontSize: 12, color: COLORS.textMuted },
  statusBadge: { backgroundColor: COLORS.successBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 12, fontWeight: '700', color: COLORS.successDark },
  gigDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: 12 },
  gigFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bookingsText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  editBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primary },
  editBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  pauseBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.md, backgroundColor: COLORS.backgroundAlt },
  pauseBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24, textAlign: 'center', paddingHorizontal: 32 },
  emptyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: RADIUS.xl },
  emptyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
