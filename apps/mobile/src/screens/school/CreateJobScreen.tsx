import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry'];

export function CreateJobScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('Full Time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = () => {
    if (!title || !subject) return;
    setIsGenerating(true);
    setTimeout(() => {
      setDescription(`We are looking for an experienced ${title} with a focus on ${subject}.\n\nRequirements:\n• Bachelor's Degree in Education\n• 3+ years of experience\n• Strong communication skills\n\nResponsibilities:\n• Create lesson plans\n• Evaluate student progress\n• Maintain classroom discipline`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backCircle}><Text style={styles.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post New Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Job Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Senior Mathematics Teacher"
            placeholderTextColor={COLORS.inputPlaceholder}
            value={title} onChangeText={setTitle}
          />
        </View>

        {/* Subject */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {SUBJECTS.map(s => (
              <TouchableOpacity
                key={s} style={[styles.chip, subject === s && styles.chipActive]}
                onPress={() => setSubject(s)}
              >
                <Text style={[styles.chipText, subject === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Job Type & Salary Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Job Type</Text>
            <View style={styles.typeSelector}>
              <Text style={styles.typeText}>{type}</Text>
              <Text style={styles.typeArrow}>▼</Text>
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Monthly Salary (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 40000"
              keyboardType="number-pad"
              placeholderTextColor={COLORS.inputPlaceholder}
              value={salary} onChangeText={setSalary}
            />
          </View>
        </View>

        {/* AI Generator Button */}
        <TouchableOpacity
          style={styles.aiGenerateBtn}
          onPress={handleGenerateAI}
          disabled={isGenerating || !title}
        >
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.aiBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.aiBtnIcon}>🤖</Text>
            <Text style={styles.aiBtnText}>
              {isGenerating ? 'Generating...' : 'Auto-Write with Scorten AI'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Job Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write job details..."
            placeholderTextColor={COLORS.inputPlaceholder}
            value={description} onChangeText={setDescription}
            multiline textAlignVertical="top"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.publishBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.publishBtnText}>Publish Job</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: {},
  backCircle: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  scroll: { padding: SPACING.screen, paddingBottom: 100 },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: COLORS.text,
  },
  textArea: { height: 160, paddingTop: 16 },

  row: { flexDirection: 'row', gap: 16 },

  chip: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.primary },

  typeSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  typeText: { fontSize: 15, color: COLORS.text },
  typeArrow: { fontSize: 12, color: COLORS.textMuted },

  aiGenerateBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: 20 },
  aiBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  aiBtnIcon: { fontSize: 20 },
  aiBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screen, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 10,
  },
  publishBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, alignItems: 'center' },
  publishBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
