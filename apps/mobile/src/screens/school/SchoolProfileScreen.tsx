import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function SchoolProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>School Profile</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.schoolLogo}>
            <Text style={{ fontSize: 52 }}>🏫</Text>
          </View>
          <Text style={styles.schoolName}>Delhi Public School</Text>
          <Text style={styles.schoolType}>CBSE · Private · K-12</Text>
          <Text style={styles.schoolLocation}>📍 New Delhi, Delhi</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => {}}>
            <Text style={styles.editBtnText}>Edit School Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: '👨‍🏫', label: 'Teachers', value: '120' },
            { icon: '🎓', label: 'Students', value: '3,200' },
            { icon: '💼', label: 'Active Jobs', value: '5' },
            { icon: '⭐', label: 'Rating', value: '4.8' },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>School Details</Text>
          {[
            { label: 'Established', value: '1972' },
            { label: 'Board', value: 'CBSE' },
            { label: 'Type', value: 'Private' },
            { label: 'Principal', value: 'Dr. Anita Sharma' },
            { label: 'Email', value: 'hr@dps.edu.in' },
            { label: 'Phone', value: '+91 98765 43210' },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Hiring settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hiring Settings</Text>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🤖</Text>
            <Text style={styles.menuText}>AI Interview Settings</Text>
            <Text style={styles.menuArrow}>›</Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuText}>Job Templates</Text>
            <Text style={styles.menuArrow}>›</Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notification Preferences</Text>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
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
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  scroll: { padding: SPACING.screen },

  hero: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 24,
    alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  schoolLogo: {
    width: 90, height: 90, borderRadius: 24, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    borderWidth: 2, borderColor: COLORS.primary + '30',
  },
  schoolName: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  schoolType: { fontSize: 14, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  schoolLocation: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  editBtn: {
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.full,
    paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  editBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  detailRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { width: 110, fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  detailValue: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '600' },

  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  menuArrow: { fontSize: 22, color: COLORS.textMuted },

  logoutBtn: {
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.xl, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.borderError + '30',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.error },
});
