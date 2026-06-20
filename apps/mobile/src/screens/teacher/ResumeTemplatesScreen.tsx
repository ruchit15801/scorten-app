import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const TEMPLATES = [
  { id: 1, name: 'Modern Minimal', color: '#E8F0FE', description: 'Clean and professional layout.' },
  { id: 2, name: 'Creative Classic', color: '#FCE8E6', description: 'Stand out with elegant typography.' },
  { id: 3, name: 'Executive Pro', color: '#E6F4EA', description: 'Best for experienced educators.' },
  { id: 4, name: 'Tech Innovator', color: '#F3E5F5', description: 'Highlight your technical skills.' },
];

export function ResumeTemplatesScreen({ navigation }: any) {
  const [useProfileData, setUseProfileData] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Resume Templates</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Use My Profile Data</Text>
            <Text style={styles.toggleDesc}>Auto-fill resume with profile info</Text>
          </View>
          <Switch
            value={useProfileData}
            onValueChange={setUseProfileData}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={'#FFF'}
          />
        </View>

        <Text style={styles.sectionTitle}>Select a Design</Text>
        <View style={styles.grid}>
          {TEMPLATES.map(t => (
            <TouchableOpacity 
              key={t.id} 
              style={styles.card}
              onPress={() => navigation.navigate('ResumeBuilder', { templateId: t.id, useProfileData })}
            >
              <View style={[styles.templatePreview, { backgroundColor: t.color }]}>
                <Text style={styles.previewIcon}>📄</Text>
              </View>
              <Text style={styles.templateName}>{t.name}</Text>
              <Text style={styles.templateDesc}>{t.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  back: { fontSize: 32, color: COLORS.text, width: 40, lineHeight: 32 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  
  content: { padding: SPACING.screen, paddingBottom: 60 },
  
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, padding: 16, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 24,
  },
  toggleTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  toggleDesc: { fontSize: 13, color: COLORS.textSecondary },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, overflow: 'hidden',
  },
  templatePreview: { height: 160, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  previewIcon: { fontSize: 40 },
  templateName: { fontSize: 14, fontWeight: '700', color: COLORS.text, padding: 12, paddingBottom: 4 },
  templateDesc: { fontSize: 12, color: COLORS.textSecondary, paddingHorizontal: 12, paddingBottom: 12, lineHeight: 16 },
});
