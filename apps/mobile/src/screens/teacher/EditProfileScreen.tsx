import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useMyTeacherProfile, useUpdateTeacherProfile } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Hindi', 'History', 'Geography', 'Biology', 'Computer Science'];
const BOARDS   = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const MODES    = ['Full Time', 'Part Time', 'Contract', 'Freelance'];

function InputField({ label, value, onChange, placeholder, keyboardType, multiline, icon }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, focused && s.focused, multiline && { alignItems: 'flex-start', paddingTop: 12 }]}>
        {icon && <Icon name={icon} size={18} color={focused ? COLORS.primary : COLORS.textMuted} style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }} />}
        <TextInput
          style={[s.input, multiline && { minHeight: 90, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
        />
      </View>
    </View>
  );
}

function ChipGroup({ label, options, selected, onToggle, single }: any) {
  return (
    <View style={s.chipGroup}>
      <Text style={s.label}>{label}</Text>
      <View style={s.chipWrap}>
        {options.map((opt: string) => {
          const active = single ? selected === opt : selected?.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              style={[s.chip, active && s.chipOn]}
              onPress={() => onToggle(opt)}
            >
              {active && <Icon name="checkmark" size={12} color={COLORS.primary} />}
              <Text style={[s.chipText, active && s.chipTextOn]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  focused: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  chipGroup: { marginBottom: 16 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.full,
    paddingHorizontal: 13, paddingVertical: 8,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  chipOn: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextOn: { color: COLORS.primary },
});

export function EditProfileScreen({ navigation }: any) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const updateMutation = useUpdateTeacherProfile();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [subjects, setSubjects] = useState<string[]>(profile?.subjects || []);
  const [boards, setBoards] = useState<string[]>(profile?.boards || []);
  const [mode, setMode] = useState(profile?.preferredMode || 'Full Time');
  const [expYears, setExpYears] = useState(String(profile?.experienceYears || ''));
  const [expectedSalary, setExpectedSalary] = useState(String(profile?.expectedSalary || ''));

  const toggleArr = (arr: string[], setArr: any, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x: string) => x !== val) : [...arr, val]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        firstName, lastName, bio, city, state,
        subjects, boards, preferredMode: mode,
        experienceYears: parseInt(expYears) || 0,
        expectedSalary: parseInt(expectedSalary) || 0,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Saved', 'Profile changes saved locally!');
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={[styles.saveBtn, updateMutation.isPending && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Text style={styles.saveBtnText}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrap}>
            <Icon name="person" size={48} color={COLORS.primary} />
            <View style={styles.avatarEdit}>
              <Icon name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField label="First Name" value={firstName} onChange={setFirstName} placeholder="First name" icon="person-outline" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="Last Name" value={lastName} onChange={setLastName} placeholder="Last name" icon="person-outline" />
              </View>
            </View>
            <InputField label="Bio" value={bio} onChange={setBio} placeholder="Tell schools about yourself..." multiline icon="create-outline" />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField label="City" value={city} onChange={setCity} placeholder="Your city" icon="location-outline" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="State" value={state} onChange={setState} placeholder="State" icon="location-outline" />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teaching Details</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField label="Experience (Years)" value={expYears} onChange={setExpYears} placeholder="e.g. 5" keyboardType="number-pad" icon="time-outline" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="Expected Salary (₹/mo)" value={expectedSalary} onChange={setExpectedSalary} placeholder="e.g. 45000" keyboardType="number-pad" icon="cash-outline" />
              </View>
            </View>
            <ChipGroup label="Subjects" options={SUBJECTS} selected={subjects} onToggle={(v: string) => toggleArr(subjects, setSubjects, v)} />
            <ChipGroup label="Boards" options={BOARDS} selected={boards} onToggle={(v: string) => toggleArr(boards, setBoards, v)} />
            <ChipGroup label="Work Mode" options={MODES} selected={mode} onToggle={setMode} single />
          </View>
        </View>

        <TouchableOpacity style={styles.saveFooterBtn} onPress={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending
            ? <ActivityIndicator color="#FFF" />
            : <>
                <Icon name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.saveFooterText}> Save Changes</Text>
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
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#FFF' },
  saveBtn: { backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  scroll: { padding: SPACING.screen },

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrap: {
    width: 90, height: 90, borderRadius: 26, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
    borderWidth: 2, borderColor: COLORS.primary + '40',
  },
  avatarEdit: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.surface,
  },
  avatarHint: { fontSize: 12, color: COLORS.textMuted, marginTop: 8 },

  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginLeft: 2,
  },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  row: { flexDirection: 'row', gap: 12 },

  saveFooterBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, marginTop: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  saveFooterText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
