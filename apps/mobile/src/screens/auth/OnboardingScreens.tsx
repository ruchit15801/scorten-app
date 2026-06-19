import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, Platform, KeyboardAvoidingView,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

// ─── Step Progress Bar ───────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <View style={progress.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            progress.dot,
            i < current ? progress.dotDone :
            i === current - 1 ? progress.dotActive :
            progress.dotInactive,
          ]}
        />
      ))}
      <Text style={progress.label}>{current} of {total}</Text>
    </View>
  );
}

const progress = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 32 },
  dot: { height: 4, borderRadius: 2 },
  dotDone: { flex: 1, backgroundColor: COLORS.primary },
  dotActive: { flex: 1.5, backgroundColor: COLORS.primary },
  dotInactive: { flex: 1, backgroundColor: COLORS.border },
  label: {
    fontSize: 12, color: COLORS.textSecondary, fontWeight: '600',
    marginLeft: 8,
  },
});

// ─── Onboarding Step 1: Personal Details ────────────────────────────────────
export function OnboardingStep1({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | null>(null);
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const isValid = name && phone && dob && gender && state && city;

  const InputField = ({ label, value, onChange, placeholder, keyboardType, id }: any) => (
    <View style={s1.inputGroup}>
      <Text style={s1.inputLabel}>{label}</Text>
      <View style={[s1.inputWrapper, focused === id && s1.inputFocused]}>
        <TextInput
          style={s1.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={s1.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={s1.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={s1.backBtn}>
          <View style={s1.backCircle}><Text style={s1.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={1} total={8} />

        <Text style={s1.title}>Let's get to know you</Text>
        <Text style={s1.subtitle}>Tell us about yourself to get started</Text>

        {/* Photo Upload */}
        <View style={s1.photoArea}>
          <TouchableOpacity style={s1.photoPicker}>
            <Text style={s1.photoIcon}>📷</Text>
            <Text style={s1.photoLabel}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        <InputField id="name" label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
        <InputField id="phone" label="Contact Number" value={phone} onChange={setPhone} placeholder="+91 9876543210" keyboardType="phone-pad" />
        <InputField id="dob" label="Date of Birth" value={dob} onChange={setDob} placeholder="DD / MM / YYYY" />

        {/* Gender */}
        <View style={s1.inputGroup}>
          <Text style={s1.inputLabel}>Gender</Text>
          <View style={s1.genderRow}>
            {(['Male', 'Female'] as const).map(g => (
              <TouchableOpacity
                key={g}
                style={[s1.genderChip, gender === g && s1.genderChipSelected]}
                onPress={() => setGender(g)}
              >
                <Text style={[s1.genderText, gender === g && s1.genderTextSelected]}>
                  {g === 'Male' ? '👨' : '👩'} {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField id="country" label="Select Country" value={country} onChange={setCountry} placeholder="India" />
        <InputField id="state" label="Select State" value={state} onChange={setState} placeholder="e.g. Gujarat" />
        <InputField id="city" label="City" value={city} onChange={setCity} placeholder="e.g. Ahmedabad" />

        {/* Continue */}
        <TouchableOpacity
          style={[s1.continueBtn, !isValid && s1.btnDisabled]}
          onPress={() => isValid && navigation.navigate('OnboardingStep2')}
        >
          <Text style={s1.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s1 = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 40 },
  backBtn: { marginBottom: 20 },
  backCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 28 },

  photoArea: { alignItems: 'center', marginBottom: 28 },
  photoPicker: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primaryBg,
    borderWidth: 2, borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  photoIcon: { fontSize: 28 },
  photoLabel: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },

  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 16,
  },
  inputFocused: { borderColor: COLORS.inputBorderFocused, backgroundColor: '#FFF' },
  input: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 14 },

  genderRow: { flexDirection: 'row', gap: 12 },
  genderChip: {
    flex: 1, paddingVertical: 14, borderRadius: RADIUS.lg,
    backgroundColor: COLORS.inputBg, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    alignItems: 'center',
  },
  genderChipSelected: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  genderText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },
  genderTextSelected: { color: COLORS.primary },

  continueBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18,
    alignItems: 'center', marginTop: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});

// ─── Onboarding Step 2: Education Boards ─────────────────────────────────────
const BOARDS = [
  { id: 'cbse', label: 'CBSE', type: 'national' },
  { id: 'icse', label: 'ICSE', type: 'national' },
  { id: 'isc', label: 'ISC', type: 'national' },
  { id: 'nios', label: 'NIOS', type: 'national' },
  { id: 'gseb', label: 'GSEB / GSHSEB', type: 'state' },
  { id: 'seb', label: 'SEB', type: 'state' },
  { id: 'ib', label: 'IB', type: 'international' },
  { id: 'cambridge', label: 'Cambridge', type: 'international' },
];

export function OnboardingStep2({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const toggleBoard = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const filtered = BOARDS.filter(b => b.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={s2.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={s2.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s2.backBtn}>
          <View style={s2.backCircle}><Text style={s2.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={2} total={8} />

        <Text style={s2.title}>Which study boards{'\n'}do you teach?</Text>

        {/* Search */}
        <View style={s2.searchBar}>
          <Text style={s2.searchIcon}>🔍</Text>
          <TextInput
            style={s2.searchInput}
            placeholder="Search Education Board"
            placeholderTextColor={COLORS.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Selected chips */}
        {selected.length > 0 && (
          <View style={s2.selectedChips}>
            {selected.map(id => {
              const board = BOARDS.find(b => b.id === id);
              return (
                <TouchableOpacity key={id} style={s2.chip} onPress={() => toggleBoard(id)}>
                  <Text style={s2.chipText}>{board?.label}</Text>
                  <Text style={s2.chipClose}>×</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Board list */}
        {['National Boards', 'State Boards', 'International Boards'].map(section => {
          const type = section === 'National Boards' ? 'national' : section === 'State Boards' ? 'state' : 'international';
          const items = filtered.filter(b => b.type === type);
          if (!items.length) return null;
          return (
            <View key={section} style={s2.section}>
              <Text style={s2.sectionTitle}>{section}</Text>
              {items.map(board => (
                <TouchableOpacity
                  key={board.id}
                  style={s2.boardRow}
                  onPress={() => toggleBoard(board.id)}
                >
                  <View style={[s2.checkbox, selected.includes(board.id) && s2.checkboxSelected]}>
                    {selected.includes(board.id) && <Text style={s2.checkmark}>✓</Text>}
                  </View>
                  <Text style={s2.boardLabel}>{board.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <TouchableOpacity
          style={[s2.continueBtn, !selected.length && s2.btnDisabled]}
          onPress={() => selected.length && navigation.navigate('OnboardingStep3')}
        >
          <Text style={s2.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s2 = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 40 },
  backBtn: { marginBottom: 20 },
  backCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 20 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 16,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 12 },

  selectedChips: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  chipText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  chipClose: { fontSize: 16, color: COLORS.primary, fontWeight: '700', lineHeight: 18 },

  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12, color: COLORS.textMuted, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  boardRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { fontSize: 13, color: '#FFF', fontWeight: '700' },
  boardLabel: { fontSize: 15, color: COLORS.text, fontWeight: '500' },

  continueBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18,
    alignItems: 'center', marginTop: 12,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});

// ─── Onboarding Step 3: Class Levels ─────────────────────────────────────────
const CLASS_LEVELS = [
  'Junior KG', 'Senior KG', '1st', '2nd', '3rd', '4th',
  '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th',
];

export function OnboardingStep3({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const toggle = (c: string) => setSelected(prev =>
    prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
  );

  const filtered = CLASS_LEVELS.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={s3.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={s3.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s3.backBtn}>
          <View style={s3.backCircle}><Text style={s3.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={3} total={8} />

        <Text style={s3.title}>Which class level{'\n'}do you teach?</Text>

        {/* Selected chips */}
        {selected.length > 0 && (
          <View style={s3.selectedRow}>
            {selected.map(c => (
              <TouchableOpacity key={c} style={s3.chip} onPress={() => toggle(c)}>
                <Text style={s3.chipText}>{c}</Text>
                <Text style={s3.chipClose}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search */}
        <View style={s3.searchBar}>
          <Text style={s3.searchIcon}>🔍</Text>
          <TextInput
            style={s3.searchInput}
            placeholder="Search Class level"
            placeholderTextColor={COLORS.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Class Grid */}
        <View style={s3.grid}>
          {filtered.map(c => (
            <TouchableOpacity
              key={c}
              style={[s3.classBox, selected.includes(c) && s3.classBoxSelected]}
              onPress={() => toggle(c)}
            >
              <Text style={[s3.classNum, selected.includes(c) && s3.classNumSelected]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[s3.continueBtn, !selected.length && s3.btnDisabled]}
          onPress={() => selected.length && navigation.navigate('OnboardingStep4')}
        >
          <Text style={s3.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s3 = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 40 },
  backBtn: { marginBottom: 20 },
  backCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 16 },

  selectedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  chipText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  chipClose: { fontSize: 16, color: COLORS.primary, fontWeight: '700', lineHeight: 18 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 20, gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  classBox: {
    width: '21%',
    aspectRatio: 1,
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  classBoxSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  classNum: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  classNumSelected: { color: '#FFF' },

  continueBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18,
    alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
