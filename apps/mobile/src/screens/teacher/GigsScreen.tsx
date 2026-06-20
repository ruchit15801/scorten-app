import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { useMyGigs } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_GIGS = [
  { _id: '1', title: 'Online Math Tutor for Class 10–12', subject: 'Mathematics', rate: 500, mode: 'Online', status: 'active', orders: 8, rating: 4.9 },
  { _id: '2', title: 'English Grammar & Writing Coach', subject: 'English', rate: 400, mode: 'Online', status: 'active', orders: 5, rating: 4.7 },
  { _id: '3', title: 'JEE/NEET Science Tutoring', subject: 'Physics', rate: 700, mode: 'Both', status: 'paused', orders: 12, rating: 4.8 },
];

const STATUS_CFG: any = {
  active: { color: COLORS.success, label: 'Active', bg: COLORS.successBg },
  paused: { color: COLORS.warning, label: 'Paused', bg: COLORS.warningBg },
  draft:  { color: COLORS.textMuted, label: 'Draft', bg: COLORS.backgroundAlt },
};

function GigCard({ gig, onPress, onToggle }: any) {
  const s = STATUS_CFG[gig.status] || STATUS_CFG.draft;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View style={styles.subjectIcon}>
          <Icon name="book-outline" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.gigTitle} numberOfLines={2}>{gig.title}</Text>
          <Text style={styles.gigSubject}>{gig.subject} · {gig.mode}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
          <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>
      <View style={styles.cardFoot}>
        <View style={styles.rateBox}>
          <Icon name="cash-outline" size={13} color={COLORS.primary} />
          <Text style={styles.rateText}> ₹{gig.rate}/hr</Text>
        </View>
        <View style={styles.ordersBox}>
          <Icon name="checkmark-circle" size={13} color={COLORS.success} />
          <Text style={styles.ordersText}> {gig.orders} orders</Text>
        </View>
        <View style={styles.ratingBox}>
          <Icon name="star" size={13} color="#F59E0B" />
          <Text style={styles.ratingText}> {gig.rating}</Text>
        </View>
        <TouchableOpacity style={styles.pauseBtn} onPress={() => onToggle(gig)}>
          <Icon name={gig.status === 'active' ? 'pause' : 'play'} size={14} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function GigsScreen({ navigation }: any) {
  const { data: apiGigs } = useMyGigs();
  const [gigs, setGigs] = useState(MOCK_GIGS);

  const toggle = (gig: any) => {
    setGigs(prev => prev.map(g => g._id === gig._id ? { ...g, status: g.status === 'active' ? 'paused' : 'active' } : g));
  };

  const activeGigs = gigs.filter(g => g.status === 'active');
  const totalOrders = gigs.reduce((s, g) => s + g.orders, 0);
  const avgRating = (gigs.reduce((s, g) => s + g.rating, 0) / gigs.length).toFixed(1);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Gigs</Text>
          <Text style={styles.headerSub}>Freelance teaching opportunities</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateGig')}>
          <Icon name="add" size={18} color={COLORS.primary} />
          <Text style={styles.createBtnText}> New</Text>
        </TouchableOpacity>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        {[
          { label: 'Active Gigs', val: activeGigs.length, color: COLORS.success },
          { label: 'Total Orders', val: totalOrders, color: COLORS.primary },
          { label: 'Avg Rating', val: avgRating, color: '#F59E0B' },
        ].map((s, i) => (
          <View key={s.label} style={[styles.statItem, i > 0 && styles.statBorder]}>
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={gigs}
        keyExtractor={g => g._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <GigCard
            gig={item}
            onPress={() => Alert.alert(item.title, `₹${item.rate}/hr · ${item.orders} orders completed`)}
            onToggle={toggle}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.newGigBanner} onPress={() => navigation.navigate('CreateGig')}>
            <Icon name="add-circle" size={28} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.newGigTitle}>Create a New Gig</Text>
              <Text style={styles.newGigSub}>Offer your expertise to students & schools</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },
  createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full },
  createBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.primary },

  statsStrip: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    paddingVertical: 14, paddingHorizontal: SPACING.screen,
    borderTopWidth: 1, borderTopColor: '#FFFFFF20',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderLeftColor: '#FFFFFF30' },
  statVal: { fontSize: 20, fontWeight: '900', marginBottom: 2 },
  statLbl: { fontSize: 10, color: '#FFFFFFAA', fontWeight: '600' },

  list: { padding: SPACING.screen },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  subjectIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  gigTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3, lineHeight: 19 },
  gigSubject: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardFoot: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, gap: 10 },
  rateBox: { flexDirection: 'row', alignItems: 'center' },
  rateText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  ordersBox: { flexDirection: 'row', alignItems: 'center' },
  ordersText: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#92400E' },
  pauseBtn: { marginLeft: 'auto' as any, width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center' },

  newGigBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16,
    borderWidth: 1.5, borderColor: COLORS.primary + '30', borderStyle: 'dashed',
  },
  newGigTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  newGigSub: { fontSize: 12, color: COLORS.textSecondary },
});
