import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Hindi', 'Computer Science'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB'];

export function CreateGigScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [subject, setSubject] = useState('');
  const [board, setBoard] = useState('');
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('online');
  const [slots, setSlots] = useState('');

  const isValid = title && rate && subject;

  const handleCreate = () => {
    if (!isValid) return;
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backCircle}><Text style={styles.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <Text style={styles.title}>Create Gig</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gig Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gig Title*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Online Math Coaching for Grade 10"
              placeholderTextColor={COLORS.inputPlaceholder}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your teaching methodology, what students will learn..."
              placeholderTextColor={COLORS.inputPlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hourly Rate (₹)*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500"
              placeholderTextColor={COLORS.inputPlaceholder}
              value={rate}
              onChangeText={setRate}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weekly Slots Available</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10 hours/week"
              placeholderTextColor={COLORS.inputPlaceholder}
              value={slots}
              onChangeText={setSlots}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject*</Text>
          <View style={styles.chipRow}>
            {SUBJECTS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, subject === s && styles.chipActive]}
                onPress={() => setSubject(s)}
              >
                <Text style={[styles.chipText, subject === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Board</Text>
          <View style={styles.chipRow}>
            {BOARDS.map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.chip, board === b && styles.chipActive]}
                onPress={() => setBoard(b)}
              >
                <Text style={[styles.chipText, board === b && styles.chipTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode</Text>
          <View style={styles.modeRow}>
            {(['online', 'offline', 'hybrid'] as const).map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                onPress={() => setMode(m)}
              >
                <Text style={{ fontSize: 20, marginBottom: 4 }}>
                  {m === 'online' ? '💻' : m === 'offline' ? '🏫' : '🔄'}
                </Text>
                <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.publishBtn, !isValid && styles.publishBtnOff]}
          onPress={handleCreate}
          disabled={!isValid}
        >
          <Text style={styles.publishBtnText}>Publish Gig</Text>
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
    backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: {},
  backCircle: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  scroll: { padding: SPACING.screen },

  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 16 },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: COLORS.text,
  },
  textArea: { height: 100, paddingTop: 14 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  chipActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.primary },

  modeRow: { flexDirection: 'row', gap: 12 },
  modeBtn: {
    flex: 1, alignItems: 'center', padding: 14,
    borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBg,
  },
  modeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg },
  modeText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  modeTextActive: { color: COLORS.primary },

  footer: {
    padding: SPACING.screen, backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  publishBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  publishBtnOff: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  publishBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
