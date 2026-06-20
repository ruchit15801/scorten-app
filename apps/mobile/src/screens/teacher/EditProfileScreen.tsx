import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useUpdateTeacherProfile, useMyTeacherProfile } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Hindi', 'History', 'Geography', 'Biology', 'Computer Science'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const MODES = ['Full Time', 'Part Time', 'Contract', 'Freelance'];

function InputField({ label, value, onChange, placeholder, keyboardType, multiline }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.inputGroup}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, focused && s.inputFocused, multiline && { alignItems: 'flex-start', paddingTop: 4 }]}>
        <TextInput
          style={[s.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        />
      </View>
    </View>
  );
}

function ChipGroup({ label, options, selected, onToggle }: any) {
  return (
    <View style={s.inputGroup}>
      <Text style={s.label}>{label}</Text>
      <View style={s.chipRow}>
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            style={[s.chip, selected.includes(opt) && s.chipActive]}
            onPress={() => onToggle(opt)}
          >
            <Text style={[s.chipText, selected.includes(opt) && s.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function EditProfileScreen({ navigation }: any) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const updateProfile = useUpdateTeacherProfile();

  const [bio, setBio] = useState(profile?.bio || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [subjects, setSubjects] = useState<string[]>(profile?.subjects || []);
  const [boards, setBoards] = useState<string[]>(profile?.boards || []);
  const [modes, setModes] = useState<string[]>(profile?.preferredEmploymentTypes || []);
  const [salaryMin, setSalaryMin] = useState(profile?.expectedSalaryMin?.toString() || '');
  const [salaryMax, setSalaryMax] = useState(profile?.expectedSalaryMax?.toString() || '');
  const [languages, setLanguages] = useState(profile?.languages?.join(', ') || '');

  const toggleItem = (list: string[], setList: any, item: string) => {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  };

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      bio,
      city,
      state,
      subjects,
      boards,
      preferredEmploymentTypes: modes,
      expectedSalaryMin: parseInt(salaryMin) || 0,
      expectedSalaryMax: parseInt(salaryMax) || 0,
      languages: languages.split(',').map(l => l.trim()).filter(Boolean),
    });
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
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <InputField label="Full Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`} onChange={() => {}} placeholder="John Doe" />
          <InputField label="Bio / About" value={bio} onChange={setBio} placeholder="Write a short intro about yourself..." multiline />
          <InputField label="City" value={city} onChange={setCity} placeholder="Ahmedabad" />
          <InputField label="State" value={state} onChange={setState} placeholder="Gujarat" />
          <InputField label="Languages (comma separated)" value={languages} onChange={setLanguages} placeholder="English, Hindi, Gujarati" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teaching Preferences</Text>
          <ChipGroup
            label="Subjects"
            options={SUBJECTS}
            selected={subjects}
            onToggle={(s: string) => toggleItem(subjects, setSubjects, s)}
          />
          <ChipGroup
            label="Boards"
            options={BOARDS}
            selected={boards}
            onToggle={(b: string) => toggleItem(boards, setBoards, b)}
          />
          <ChipGroup
            label="Employment Mode"
            options={MODES}
            selected={modes}
            onToggle={(m: string) => toggleItem(modes, setModes, m)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Expectations (₹/month)</Text>
          <View style={styles.salaryRow}>
            <View style={{ flex: 1 }}>
              <InputField label="Minimum" value={salaryMin} onChange={setSalaryMin} placeholder="25000" keyboardType="number-pad" />
            </View>
            <Text style={styles.salaryDash}>—</Text>
            <View style={{ flex: 1 }}>
              <InputField label="Maximum" value={salaryMax} onChange={setSalaryMax} placeholder="60000" keyboardType="number-pad" />
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, updateProfile.isPending && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.saveBtnText}>Save Changes</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder, paddingHorizontal: 16,
  },
  inputFocused: { borderColor: COLORS.inputBorderFocused, backgroundColor: '#FFF' },
  input: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 14 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  chipActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.primary },
});

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
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  scroll: { padding: SPACING.screen },

  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 16 },

  salaryRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  salaryDash: { fontSize: 24, color: COLORS.textMuted, marginBottom: 14 },

  footer: {
    padding: SPACING.screen, backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10,
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  saveBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
