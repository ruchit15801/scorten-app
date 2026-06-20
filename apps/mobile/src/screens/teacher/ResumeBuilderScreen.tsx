import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const InputField = ({ label, value, onChange, placeholder, multiline }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, multiline && { paddingVertical: 12 }]}>
      <TextInput
        style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.inputPlaceholder}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
      />
    </View>
  </View>
);

export function ResumeBuilderScreen({ navigation }: any) {
  const [summary, setSummary] = useState('Passionate mathematics educator with 5+ years of experience...');
  const [skills, setSkills] = useState('Algebra, Calculus, Online Teaching, Lesson Planning');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Resume Builder</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ResumePreview')}>
          <Text style={styles.previewBtn}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary / Objective</Text>
          <InputField 
            value={summary} 
            onChange={setSummary} 
            placeholder="Write a brief professional summary..." 
            multiline 
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <TouchableOpacity><Text style={styles.editLink}>Edit in Profile</Text></TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Senior Math Teacher</Text>
            <Text style={styles.cardSub}>Delhi Public School | 2020 - Present</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Qualifications</Text>
            <TouchableOpacity><Text style={styles.editLink}>Edit in Profile</Text></TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>B.Ed in Mathematics</Text>
            <Text style={styles.cardSub}>Gujarat University | 2018</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Skills</Text>
          <InputField 
            value={skills} 
            onChange={setSkills} 
            placeholder="e.g. Algebra, Communication..." 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <InputField 
            value="" 
            placeholder="Awarded Best Teacher 2022..." 
          />
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add Custom Section</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('ResumeTemplates')}>
            <Text style={styles.btnTextSecondary}>Change Template</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => {}}>
            <Text style={styles.btnTextPrimary}>Save Draft</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  back: { fontSize: 32, color: COLORS.text, width: 60, lineHeight: 32 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  previewBtn: { fontSize: 15, fontWeight: '700', color: COLORS.primary, width: 60, textAlign: 'right' },
  
  content: { padding: SPACING.screen, paddingBottom: 60 },
  
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  editLink: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8, display: 'none' },
  inputWrapper: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16 },
  input: { fontSize: 15, color: COLORS.text, paddingVertical: 14 },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardSub: { fontSize: 14, color: COLORS.textSecondary },

  addBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed', marginTop: 8 },
  addBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },

  actions: { gap: 12, marginTop: 12 },
  btnPrimary: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.full, alignItems: 'center' },
  btnTextPrimary: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  btnSecondary: { backgroundColor: COLORS.primaryBg, paddingVertical: 16, borderRadius: RADIUS.full, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '30' },
  btnTextSecondary: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
});
