import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Dimensions,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - SPACING.screen * 2 - 12) / 2;

const ITEMS = [
  { id: '1', type: 'video',    title: 'Trigonometry Demo Class',       subject: 'Mathematics', icon: 'videocam',      duration: '8:24', aiScore: 92 },
  { id: '2', type: 'document', title: 'Sample Lesson Plan – Algebra',  subject: 'Mathematics', icon: 'document-text', size: '2.4 MB',   aiScore: null },
  { id: '3', type: 'video',    title: 'Classroom Management Tips',     subject: 'General',     icon: 'videocam',      duration: '5:12', aiScore: 87 },
  { id: '4', type: 'image',    title: 'Student Achievement Board',     subject: 'General',     icon: 'image',         size: '1.2 MB',   aiScore: null },
];

const TYPE_COLOR: any = { video: COLORS.primary, document: '#8B5CF6', image: '#10B981' };

function PortfolioCard({ item, onPress }: any) {
  const color = TYPE_COLOR[item.type] || COLORS.primary;
  return (
    <TouchableOpacity style={[styles.card, { width: CARD_W }]} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.thumb, { backgroundColor: color + '15' }]}>
        <Icon name={item.icon} size={36} color={color} />
        {item.type === 'video' && (
          <View style={[styles.playBtn, { backgroundColor: color }]}>
            <Icon name="play" size={14} color="#FFF" />
          </View>
        )}
        {item.aiScore && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI {item.aiScore}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardSubject}>{item.subject}</Text>
        <View style={styles.cardMeta}>
          <Icon name={item.duration ? 'time-outline' : 'document-text-outline'} size={11} color={COLORS.textMuted} />
          <Text style={styles.cardMetaText}> {item.duration || item.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function PortfolioScreen({ navigation }: any) {
  const [items, setItems] = useState(ITEMS);

  const stats = [
    { icon: 'videocam-outline',      label: 'Videos',    val: items.filter(i => i.type === 'video').length,    color: COLORS.primary },
    { icon: 'document-text-outline', label: 'Documents', val: items.filter(i => i.type === 'document').length, color: '#8B5CF6' },
    { icon: 'image',                 label: 'Images',    val: items.filter(i => i.type === 'image').length,    color: '#10B981' },
    { icon: 'sparkles',              label: 'AI Avg',    val: '90',                                             color: '#F59E0B' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Portfolio</Text>
          <Text style={styles.headerSub}>{items.length} items · Visible to schools</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert('Upload', 'Choose what to upload', [
            { text: 'Demo Video', onPress: () => {} },
            { text: 'Lesson Plan', onPress: () => {} },
            { text: 'Photo', onPress: () => {} },
            { text: 'Cancel', style: 'cancel' },
          ])}
        >
          <Icon name="add" size={20} color={COLORS.primary} />
          <Text style={styles.addBtnText}> Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* STATS */}
        <View style={styles.statsRow}>
          {stats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                <Icon name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* AI BANNER */}
        <View style={styles.aiBanner}>
          <View style={styles.aiIconBox}>
            <Icon name="sparkles" size={22} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>AI scores your demo videos</Text>
            <Text style={styles.aiSub}>Your videos score 90% · Excellent delivery & body language</Text>
          </View>
        </View>

        {/* GRID */}
        <Text style={styles.sectionTitle}>All Items ({items.length})</Text>
        <View style={styles.grid}>
          {items.map(item => (
            <PortfolioCard
              key={item.id}
              item={item}
              onPress={() => Alert.alert(item.title, item.type === 'video' ? 'Video preview coming soon' : 'File preview coming soon')}
            />
          ))}
        </View>

        {/* UPLOAD PROMPTS */}
        <Text style={styles.sectionTitle}>Boost Your Profile</Text>
        {[
          { icon: 'videocam-outline', label: 'Upload Demo Class Video', sub: 'Teachers with videos get 4x more interview calls', color: COLORS.primary },
          { icon: 'document-text-outline', label: 'Upload a Lesson Plan', sub: 'Showcase your teaching methodology to schools', color: '#8B5CF6' },
          { icon: 'mic-outline', label: 'Record Audio Introduction', sub: 'Help schools get to know you better', color: '#10B981' },
        ].map(u => (
          <TouchableOpacity key={u.label} style={styles.uploadCard} activeOpacity={0.85}
            onPress={() => Alert.alert('Upload', u.label)}
          >
            <View style={[styles.uploadIcon, { backgroundColor: u.color + '18' }]}>
              <Icon name={u.icon} size={22} color={u.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.uploadLabel}>{u.label}</Text>
              <Text style={styles.uploadSub}>{u.sub}</Text>
            </View>
            <Icon name="add-circle" size={24} color={u.color} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
  },
  addBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.primary },

  scroll: { paddingHorizontal: SPACING.screen, paddingTop: 16, paddingBottom: 32 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statVal: { fontSize: 17, fontWeight: '900', marginBottom: 2 },
  statLbl: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 20,
    borderWidth: 1.5, borderColor: COLORS.primary + '30',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
  },
  aiIconBox: {
    width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  aiTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 3 },
  aiSub: { fontSize: 12, color: COLORS.textSecondary },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  thumb: { height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  playBtn: {
    position: 'absolute', bottom: 8, right: 8,
    width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
  },
  aiBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: COLORS.success, paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full,
  },
  aiBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 2, lineHeight: 17 },
  cardSubject: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  cardMetaText: { fontSize: 10, color: COLORS.textMuted },

  uploadCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 10,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
  },
  uploadIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  uploadLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  uploadSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
});
