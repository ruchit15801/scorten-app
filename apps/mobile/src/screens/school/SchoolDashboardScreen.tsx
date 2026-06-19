import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color }: any) {
  return (
    <View style={stats.card}>
      <View style={[stats.iconBox, { backgroundColor: color + '15' }]}>
        <Text style={stats.icon}>{icon}</Text>
      </View>
      <View>
        <Text style={stats.value}>{value}</Text>
        <Text style={stats.label}>{label}</Text>
      </View>
    </View>
  );
}

const stats = StyleSheet.create({
  card: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  value: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  label: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
});

// ─── Pipeline Stage ───────────────────────────────────────────────────────────
function PipelineStage({ label, count, color, active }: any) {
  return (
    <View style={pipe.stage}>
      <View style={[pipe.dot, { backgroundColor: active ? color : COLORS.border }]} />
      <Text style={[pipe.label, { color: active ? COLORS.text : COLORS.textMuted }]}>{label}</Text>
      <View style={[pipe.badge, { backgroundColor: active ? color + '20' : COLORS.backgroundAlt }]}>
        <Text style={[pipe.count, { color: active ? color : COLORS.textMuted }]}>{count}</Text>
      </View>
    </View>
  );
}

const pipe = StyleSheet.create({
  stage: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  label: { flex: 1, fontSize: 15, fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  count: { fontSize: 14, fontWeight: '700' },
});

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function SchoolDashboardScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── Header ────────────────────────────────────────────────────── */}
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.schoolAvatar}>
              <Text style={{ fontSize: 24 }}>🏫</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.welcome}>Welcome back,</Text>
              <Text style={styles.schoolName}>Delhi Public School</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ─── Content ───────────────────────────────────────────────────── */}
        <View style={styles.content}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatCard icon="💼" value="12" label="Active Jobs" color={COLORS.primary} />
            <StatCard icon="👥" value="48" label="New Applicants" color={COLORS.success} />
          </View>
          <View style={styles.statsRow}>
            <StatCard icon="📅" value="5" label="Interviews" color={COLORS.warning} />
            <StatCard icon="🎉" value="3" label="Hired" color="#8B5CF6" />
          </View>

          {/* AI Hiring Assistant Banner */}
          <TouchableOpacity 
            style={styles.aiBanner}
            onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
            activeOpacity={0.8}
          >
            <View style={styles.aiIconBox}><Text style={{ fontSize: 28 }}>🤖</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiBannerTitle}>Generate Job Post with AI</Text>
              <Text style={styles.aiBannerSub}>Save 20 mins. Let Scorten AI draft your next job opening.</Text>
            </View>
            <Text style={{ fontSize: 20, color: COLORS.primary }}>→</Text>
          </TouchableOpacity>

          {/* Hiring Pipeline */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hiring Pipeline</Text>
              <Text style={styles.seeAll}>Manage →</Text>
            </View>
            <View style={styles.pipelineCard}>
              <PipelineStage label="Applied (AI Screening)" count={24} color={COLORS.primary} active />
              <PipelineStage label="Shortlisted" count={12} color={COLORS.info} active />
              <PipelineStage label="AI Interviews Pending" count={8} color={COLORS.warning} active />
              <PipelineStage label="Offers Sent" count={2} color={COLORS.success} active />
              <PipelineStage label="Hired" count={2} color="#8B5CF6" active={false} />
            </View>
          </View>

          {/* Recent Top Candidates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top AI-Scored Candidates</Text>
            {[1, 2, 3].map(i => (
              <TouchableOpacity key={i} style={styles.candidateCard} activeOpacity={0.8}>
                <View style={styles.cAvatar}><Text style={{ fontSize: 22 }}>👩‍🏫</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cName}>Priya Sharma</Text>
                  <Text style={styles.cRole}>Mathematics Teacher</Text>
                </View>
                <View style={styles.cScoreBox}>
                  <Text style={styles.cScoreLabel}>Score</Text>
                  <Text style={styles.cScoreValue}>94</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Floating Add Job Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  header: {
    paddingTop: 56, paddingHorizontal: SPACING.screen, paddingBottom: 40,
    borderBottomLeftRadius: RADIUS['3xl'], borderBottomRightRadius: RADIUS['3xl'],
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  schoolAvatar: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#FFFFFF30',
    alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  welcome: { fontSize: 13, color: '#FFFFFF99', marginBottom: 2 },
  schoolName: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF20',
    alignItems: 'center', justifyContent: 'center',
  },

  content: { paddingHorizontal: SPACING.screen, marginTop: -20 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 20,
    marginTop: 8, marginBottom: 24,
    borderWidth: 1.5, borderColor: COLORS.primary + '40', borderStyle: 'dashed',
  },
  aiIconBox: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
  },
  aiBannerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  aiBannerSub: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  pipelineCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },

  candidateCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  cAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center' },
  cName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  cRole: { fontSize: 13, color: COLORS.textSecondary },
  cScoreBox: { alignItems: 'center', backgroundColor: COLORS.successBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.md },
  cScoreLabel: { fontSize: 10, color: COLORS.success, fontWeight: '700', textTransform: 'uppercase' },
  cScoreValue: { fontSize: 16, color: COLORS.successDark, fontWeight: '800' },

  fab: {
    position: 'absolute', bottom: 20, right: 20,
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  fabIcon: { fontSize: 32, color: '#FFF', fontWeight: '400', marginTop: -4 },
});
