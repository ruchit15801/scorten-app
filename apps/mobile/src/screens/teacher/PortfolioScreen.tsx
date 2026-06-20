import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const PORTFOLIO_ITEMS = [
  { id: '1', type: 'video', title: 'Trigonometry Demo Class', subject: 'Mathematics', thumbnail: '🎥', duration: '8:24', aiScore: 92 },
  { id: '2', type: 'document', title: 'Sample Lesson Plan - Algebra', subject: 'Mathematics', thumbnail: '📄', size: '2.4 MB', aiScore: null },
  { id: '3', type: 'video', title: 'Classroom Management Techniques', subject: 'General', thumbnail: '🎬', duration: '5:12', aiScore: 87 },
  { id: '4', type: 'image', title: 'Student Achievement Board', subject: 'General', thumbnail: '🖼️', size: '1.2 MB', aiScore: null },
];

function PortfolioCard({ item }: any) {
  const isVideo = item.type === 'video';
  return (
    <View style={styles.card}>
      <View style={[styles.cardThumbnail, isVideo && { backgroundColor: COLORS.primary + '15' }]}>
        <Text style={{ fontSize: 36 }}>{item.thumbnail}</Text>
        {isVideo && (
          <View style={styles.playOverlay}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>▶</Text>
          </View>
        )}
        {isVideo && item.aiScore && (
          <View style={styles.aiScoreBadge}>
            <Text style={styles.aiScoreText}>AI: {item.aiScore}%</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardSubject}>{item.subject}</Text>
        <Text style={styles.cardMeta}>
          {isVideo ? `⏱️ ${item.duration}` : `📁 ${item.size}`}
        </Text>
      </View>
    </View>
  );
}

export function PortfolioScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Portfolio</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: '🎥', label: 'Videos', value: '2' },
            { icon: '📄', label: 'Documents', value: '1' },
            { icon: '🖼️', label: 'Images', value: '1' },
            { icon: '⭐', label: 'AI Avg', value: '90%' },
          ].map(stat => (
            <View key={stat.label} style={styles.statBox}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* AI Analysis Banner */}
        <View style={styles.aiBanner}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>🤖</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Your demo videos score 90% on AI analysis</Text>
            <Text style={styles.aiSub}>Strong subject delivery • Excellent body language</Text>
          </View>
        </View>

        {/* Portfolio Grid */}
        <Text style={styles.sectionTitle}>All Items ({PORTFOLIO_ITEMS.length})</Text>
        <View style={styles.grid}>
          {PORTFOLIO_ITEMS.map(item => (
            <View key={item.id} style={styles.gridItem}>
              <PortfolioCard item={item} />
            </View>
          ))}
        </View>

        {/* Upload prompts */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadTitle}>Add More to Boost Your Profile</Text>
          {[
            { icon: '🎥', label: 'Upload Demo Video', sub: 'Teachers with videos get 4x more interviews' },
            { icon: '📄', label: 'Upload Lesson Plan', sub: 'Show your teaching methodology' },
          ].map(u => (
            <TouchableOpacity key={u.label} style={styles.uploadCard}>
              <Text style={{ fontSize: 28 }}>{u.icon}</Text>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.uploadLabel}>{u.label}</Text>
                <Text style={styles.uploadSub}>{u.sub}</Text>
              </View>
              <Text style={{ fontSize: 20, color: COLORS.primary }}>+</Text>
            </TouchableOpacity>
          ))}
        </View>

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
  backArrow: { fontSize: 32, color: COLORS.text, width: 40 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  scroll: { padding: SPACING.screen },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 16,
    borderWidth: 1, borderColor: COLORS.primary + '30', marginBottom: 24,
  },
  aiTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  aiSub: { fontSize: 12, color: COLORS.primaryDark },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 14 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  gridItem: { width: '47%' },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  cardThumbnail: {
    height: 90, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  playOverlay: {
    position: 'absolute', bottom: 6, right: 6,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  aiScoreBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: COLORS.success, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full,
  },
  aiScoreText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  cardSubject: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  cardMeta: { fontSize: 11, color: COLORS.textMuted },

  uploadSection: { marginBottom: 16 },
  uploadTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  uploadCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
  },
  uploadLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  uploadSub: { fontSize: 12, color: COLORS.textSecondary },
});
