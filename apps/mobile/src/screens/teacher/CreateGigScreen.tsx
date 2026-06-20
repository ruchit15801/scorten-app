import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS  = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Science', 'Hindi', 'Computer Science', 'History', 'Biology'];
const MODES     = ['Online', 'Home Visit', 'School', 'Both'];
const LEVELS    = ['Class 1–5', 'Class 6–8', 'Class 9–10', 'Class 11–12', 'Competitive Exams', 'All Levels'];

function InputField({ label, value, onChange, placeholder, keyboardType, icon }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, focused && s.focused]}>
        {icon && <Icon name={icon} size={17} color={focused ? COLORS.primary : COLORS.textMuted} style={{ marginRight: 10 }} />}
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType || 'default'}
        />
      </View>
    </View>
  );
}

function ChipRow({ options, selected, onToggle, single }: any) {
  return (
    <View style={s.chipWrap}>
      {options.map((opt: string) => {
        const isOn = single ? selected === opt : Array.isArray(selected) && selected.includes(opt);
        return (
          <TouchableOpacity key={opt} style={[s.chip, isOn && s.chipOn]} onPress={() => onToggle(opt)}>
            {isOn && <Icon name="checkmark" size={12} color={COLORS.primary} />}
            <Text style={[s.chipText, isOn && s.chipTextOn]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 13, paddingVertical: 12,
  },
  focused: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.full,
    paddingHorizontal: 13, paddingVertical: 8, borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  chipOn: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextOn: { color: COLORS.primary },
});

export function CreateGigScreen({ navigation }: any) {
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [mode, setMode]         = useState('Online');
  const [levels, setLevels]     = useState<string[]>([]);
  const [rate, setRate]         = useState('');
  const [loading, setLoading]   = useState(false);

  const toggleArr = (arr: string[], setArr: any, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x: string) => x !== val) : [...arr, val]);

  const handleCreate = async () => {
    if (!title.trim()) { Alert.alert('Add a title'); return; }
    if (!subjects.length) { Alert.alert('Select at least one subject'); return; }
    if (!rate.trim()) { Alert.alert('Set your hourly rate'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    Alert.alert('🎉 Gig Created!', 'Your gig is now live and visible to schools.');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a Gig</Text>
        <TouchableOpacity
          style={[styles.saveBtn, (!title || !subjects.length) && { opacity: 0.5 }]}
          onPress={handleCreate}
          disabled={loading || !title.trim() || !subjects.length}
        >
          {loading ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={styles.saveBtnText}>Publish</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Tip Banner */}
        <View style={styles.tipBanner}>
          <Icon name="bulb-outline" size={22} color="#92400E" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tipTitle}>💡 Gig Tips</Text>
            <Text style={styles.tipSub}>Gigs with demo videos get 5x more orders. Use a clear title with your subject and level.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <InputField label="Gig Title" value={title} onChange={setTitle} placeholder="e.g. Online Math Tutor for Class 10–12" icon="briefcase-outline" />

          <View style={s.group}>
            <Text style={s.label}>Description</Text>
            <View style={[s.inputWrap, { alignItems: 'flex-start', paddingTop: 12 }]}>
              <TextInput
                style={[s.input, { minHeight: 90, textAlignVertical: 'top' }]}
                placeholder="Describe your tutoring style, methodology, and what students will learn..."
                placeholderTextColor={COLORS.inputPlaceholder}
                value={desc}
                onChangeText={setDesc}
                multiline
              />
            </View>
          </View>

          <View style={s.group}>
            <Text style={s.label}>Subjects</Text>
            <ChipRow options={SUBJECTS} selected={subjects} onToggle={(v: string) => toggleArr(subjects, setSubjects, v)} />
          </View>

          <View style={s.group}>
            <Text style={s.label}>Teaching Mode</Text>
            <ChipRow options={MODES} selected={mode} onToggle={setMode} single />
          </View>

          <View style={s.group}>
            <Text style={s.label}>Class Levels</Text>
            <ChipRow options={LEVELS} selected={levels} onToggle={(v: string) => toggleArr(levels, setLevels, v)} />
          </View>
        </View>

        <View style={styles.card}>
          <InputField label="Hourly Rate (₹/hr)" value={rate} onChange={setRate} placeholder="e.g. 500" keyboardType="number-pad" icon="cash-outline" />

          <View style={styles.previewBox}>
            <View style={styles.previewLeft}>
              <Text style={styles.previewTitle}>{title || 'Your gig title...'}</Text>
              <Text style={styles.previewSubject}>{subjects.join(', ') || 'Subject'} · {mode}</Text>
            </View>
            <View style={styles.previewRate}>
              <Text style={styles.previewRateText}>₹{rate || '—'}/hr</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#FFF" />
            : <>
                <Icon name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.createBtnText}> Publish Gig</Text>
              </>
          }
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#FFF' },
  saveBtn: { backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  scroll: { padding: SPACING.screen },

  tipBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FEF3C7', borderRadius: RADIUS.xl, padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  tipTitle: { fontSize: 13, fontWeight: '800', color: '#92400E', marginBottom: 3 },
  tipSub: { fontSize: 12, color: '#92400E', lineHeight: 18 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  previewBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.xl, padding: 14, gap: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  previewLeft: { flex: 1 },
  previewTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  previewSubject: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  previewRate: { backgroundColor: COLORS.primaryBg, paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.xl },
  previewRateText: { fontSize: 14, fontWeight: '900', color: COLORS.primary },

  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  createBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
