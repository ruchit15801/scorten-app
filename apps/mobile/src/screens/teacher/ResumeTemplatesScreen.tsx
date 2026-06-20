import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert, Dimensions,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - SPACING.screen * 2 - 12) / 2;

const TEMPLATES = [
  { id: '1', name: 'Classic Professional', color: '#1A1A2E',  accent: '#7B61FF', preview: 'serif',    popular: true  },
  { id: '2', name: 'Modern Minimal',       color: '#FFFFFF',  accent: '#10B981', preview: 'sans',     popular: false },
  { id: '3', name: 'Bold Creative',        color: '#7B61FF',  accent: '#FFFFFF', preview: 'display',  popular: true  },
  { id: '4', name: 'Clean Corporate',      color: '#F8FAFC',  accent: '#1E293B', preview: 'system',   popular: false },
  { id: '5', name: 'Academic Scholar',     color: '#1E293B',  accent: '#F59E0B', preview: 'serif',    popular: false },
  { id: '6', name: 'Vibrant Teacher',      color: '#EDE9FF',  accent: '#7B61FF', preview: 'rounded',  popular: true  },
];

function TemplateCard({ t, selected, onSelect }: any) {
  return (
    <TouchableOpacity
      style={[styles.templateCard, { width: CARD_W }, selected && styles.templateCardSelected]}
      onPress={() => onSelect(t.id)}
      activeOpacity={0.88}
    >
      {/* Template preview */}
      <View style={[styles.templatePreview, { backgroundColor: t.color, borderColor: t.accent + '60' }]}>
        {/* Simulated resume layout */}
        <View style={[styles.previewHeader, { backgroundColor: t.accent }]}>
          <View style={[styles.previewAvatar, { borderColor: t.color }]} />
          <View style={styles.previewNameLines}>
            <View style={[styles.previewLine, { width: 60, backgroundColor: t.color === '#FFFFFF' || t.color === '#F8FAFC' || t.color === '#EDE9FF' ? '#000' : '#FFF', opacity: 0.9 }]} />
            <View style={[styles.previewLine, { width: 40, marginTop: 4, backgroundColor: t.color === '#FFFFFF' || t.color === '#F8FAFC' || t.color === '#EDE9FF' ? '#000' : '#FFF', opacity: 0.5 }]} />
          </View>
        </View>
        <View style={styles.previewBody}>
          {[70, 55, 80, 45].map((w, i) => (
            <View key={i} style={[styles.previewBodyLine, {
              width: `${w}%` as any,
              backgroundColor: t.color === '#FFFFFF' || t.color === '#F8FAFC' || t.color === '#EDE9FF' ? '#333' : '#FFF',
              opacity: i === 0 ? 0.8 : 0.4,
            }]} />
          ))}
        </View>
        {t.popular && (
          <View style={[styles.popularBadge, { backgroundColor: t.accent }]}>
            <Text style={[styles.popularText, { color: t.color === '#FFFFFF' || t.color === '#F8FAFC' || t.color === '#EDE9FF' ? t.accent === '#1E293B' ? '#FFF' : t.accent : '#FFF' }]}>★ Popular</Text>
          </View>
        )}
        {selected && (
          <View style={styles.selectedOverlay}>
            <Icon name="checkmark-circle" size={28} color={COLORS.primary} />
          </View>
        )}
      </View>
      <Text style={[styles.templateName, selected && styles.templateNameActive]} numberOfLines={1}>{t.name}</Text>
    </TouchableOpacity>
  );
}

export function ResumeTemplatesScreen({ navigation }: any) {
  const [selected, setSelected] = useState('1');

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Resume Templates</Text>
          <Text style={styles.headerSub}>Choose a template to get started</Text>
        </View>
      </View>

      {/* AI Banner */}
      <View style={styles.aiBanner}>
        <View style={styles.aiIconBox}>
          <Icon name="sparkles" size={22} color="#FFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>AI Resume Builder</Text>
          <Text style={styles.aiSub}>Your profile auto-fills all sections in seconds</Text>
        </View>
        <View style={styles.aiTimeBadge}>
          <Icon name="flash" size={13} color="#F59E0B" />
          <Text style={styles.aiTimeText}> 60 sec</Text>
        </View>
      </View>

      <FlatList
        data={TEMPLATES}
        numColumns={2}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TemplateCard t={item} selected={selected === item.id} onSelect={setSelected} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.useBtn}
            onPress={() => navigation.navigate('ResumeBuilder', { templateId: selected })}
          >
            <Icon name="sparkles" size={20} color="#FFF" />
            <Text style={styles.useBtnText}> Build with AI · Template {selected}</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, margin: SPACING.screen, marginBottom: 8,
    borderRadius: RADIUS.xl, padding: 14,
    borderWidth: 1.5, borderColor: COLORS.primary + '30',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  aiIconBox: { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  aiSub: { fontSize: 12, color: COLORS.textSecondary },
  aiTimeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  aiTimeText: { fontSize: 12, fontWeight: '700', color: '#92400E' },

  grid: { paddingHorizontal: SPACING.screen, paddingBottom: 24 },
  row: { gap: 12, marginBottom: 12 },

  templateCard: { borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  templateCardSelected: { borderColor: COLORS.primary },
  templatePreview: {
    height: 160, borderWidth: 1, borderRadius: RADIUS.lg, overflow: 'hidden',
    position: 'relative',
  },
  previewHeader: { padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  previewAvatar: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  previewNameLines: { flex: 1 },
  previewLine: { height: 5, borderRadius: 2.5 },
  previewBody: { padding: 10, gap: 6 },
  previewBodyLine: { height: 4, borderRadius: 2 },
  popularBadge: { position: 'absolute', top: 0, right: 0, paddingHorizontal: 8, paddingVertical: 3 },
  popularText: { fontSize: 9, fontWeight: '800' },
  selectedOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
  },
  templateName: { padding: 8, paddingBottom: 0, fontSize: 12, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  templateNameActive: { color: COLORS.primary },

  useBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, marginTop: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  useBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
