import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

function MenuItem({ icon, label, sub, onPress, danger, badge }: any) {
  return (
    <TouchableOpacity style={s.item} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.iconBox, danger && { backgroundColor: '#FEE2E2' }]}>
        <Icon name={icon} size={20} color={danger ? COLORS.error : COLORS.primary} />
      </View>
      <View style={s.textWrap}>
        <Text style={[s.label, danger && { color: COLORS.error }]}>{label}</Text>
        {sub && <Text style={s.sub}>{sub}</Text>}
      </View>
      {badge && (
        <View style={s.badge}><Text style={s.badgeText}>{badge}</Text></View>
      )}
      <Icon name="chevron-forward" size={18} color={danger ? COLORS.error : COLORS.textMuted} />
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: RADIUS.lg },
  iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  textWrap: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 1 },
  sub: { fontSize: 12, color: COLORS.textMuted },
  badge: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
});

export function SchoolProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  const STATS = [
    { label: 'Jobs Posted', value: '12', color: COLORS.primary },
    { label: 'Hired', value: '3', color: COLORS.success },
    { label: 'AI Screened', value: '48', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <Text style={styles.pageTitle}>School</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Icon name="create-outline" size={16} color="#FFF" />
              <Text style={styles.editBtnText}> Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroMain}>
            <View style={styles.logoBox}>
              <Icon name="school" size={38} color={COLORS.primary} />
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>Delhi Public School</Text>
              <View style={styles.heroMeta}>
                <Icon name="location-outline" size={13} color="#FFFFFFAA" />
                <Text style={styles.heroMetaText}> New Delhi, Delhi</Text>
              </View>
              <View style={styles.heroMeta}>
                <Icon name="school-outline" size={13} color="#FFFFFFAA" />
                <Text style={styles.heroMetaText}> CBSE · Est. 1972</Text>
              </View>
            </View>
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <View style={styles.stripDiv} />}
                <View style={styles.stripItem}>
                  <Text style={styles.stripValue}>{stat.value}</Text>
                  <Text style={styles.stripLabel}>{stat.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── AI HIRING SUMMARY ── */}
        <View style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <Icon name="sparkles" size={18} color={COLORS.primary} />
            <Text style={styles.aiCardTitle}> AI Hiring Summary</Text>
          </View>
          {[
            { label: 'Applications screened by AI', value: '48 / 48', icon: 'checkmark-circle', color: COLORS.success },
            { label: 'Interview time saved', value: '~24 hours', icon: 'time-outline', color: COLORS.primary },
            { label: 'Avg. AI match score', value: '84 / 100', icon: 'stats-chart', color: '#8B5CF6' },
          ].map(item => (
            <View key={item.label} style={styles.aiRow}>
              <Icon name={item.icon} size={16} color={item.color} />
              <Text style={styles.aiRowLabel}>{item.label}</Text>
              <Text style={[styles.aiRowValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* ── HIRING SETTINGS ── */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Hiring Settings</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="briefcase-outline" label="Manage Jobs" sub="View & edit all postings" onPress={() => navigation.navigate('Jobs')} />
            <View style={styles.divider} />
            <MenuItem icon="people-outline" label="Candidate Pipeline" sub="Track hiring stages" onPress={() => navigation.navigate('Candidates')} />
            <View style={styles.divider} />
            <MenuItem icon="mic-outline" label="AI Interviews" sub="View sessions & results" onPress={() => navigation.navigate('Candidates')} />
            <View style={styles.divider} />
            <MenuItem icon="chatbubbles-outline" label="Messages" onPress={() => navigation.navigate('Messages')} badge={3} />
          </View>
        </View>

        {/* ── ACCOUNT ── */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="create-outline" label="Edit School Profile" sub="Update details & photos" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="lock-closed-outline" label="Privacy & Security" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="log-out-outline" label="Logout" danger onPress={() => dispatch(logout())} />
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen,
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF25', paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: '#FFFFFF40',
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  heroMain: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  logoBox: {
    width: 76, height: 76, borderRadius: 22, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF60',
  },
  heroInfo: {},
  heroName: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  heroMetaText: { fontSize: 12, color: '#FFFFFFAA' },
  statsStrip: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#FFFFFF20',
    paddingVertical: 16,
  },
  stripItem: { flex: 1, alignItems: 'center' },
  stripValue: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 2 },
  stripLabel: { fontSize: 11, color: '#FFFFFFAA', fontWeight: '600' },
  stripDiv: { width: 1, backgroundColor: '#FFFFFF30', marginVertical: 4 },

  aiCard: {
    backgroundColor: COLORS.surface, marginHorizontal: SPACING.screen, marginTop: 16, marginBottom: 0,
    borderRadius: RADIUS.xl, padding: 16, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  aiCardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  aiRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  aiRowLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  aiRowValue: { fontSize: 13, fontWeight: '800' },

  menuSection: { marginHorizontal: SPACING.screen, marginTop: 16 },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 70 },
});
