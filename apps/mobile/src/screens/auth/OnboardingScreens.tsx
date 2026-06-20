import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, Platform, KeyboardAvoidingView, Switch,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';
import { loginThunk, getMeThunk } from '../../store/slices/authSlice'; 
import { useUpdateTeacherProfile } from '../../hooks/useQueries';

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

// ─── Shared Components ──────────────────────────────────────────────────────
const InputField = ({ label, value, onChange, placeholder, keyboardType, id, focused, setFocused, multiline }: any) => (
  <View style={shared.inputGroup}>
    <Text style={shared.inputLabel}>{label}</Text>
    <View style={[shared.inputWrapper, focused === id && shared.inputFocused, multiline && { alignItems: 'flex-start', paddingVertical: 12 }]}>
      <TextInput
        style={[shared.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.inputPlaceholder}
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  </View>
);

const shared = StyleSheet.create({
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
  
  continueBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18,
    alignItems: 'center', marginTop: 12, marginBottom: 20,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },

  skipBtn: {
    paddingVertical: 12, alignItems: 'center', marginBottom: 20,
  },
  skipBtnText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },

  backBtn: { marginBottom: 20 },
  backCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 28, lineHeight: 20 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: RADIUS.full, backgroundColor: COLORS.inputBg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  chipSelected: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextSelected: { color: COLORS.primary },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  removeText: { fontSize: 13, color: COLORS.error, fontWeight: '600' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: RADIUS.lg, borderWidth: 1.5,
    borderColor: COLORS.border, borderStyle: 'dashed', marginBottom: 24, gap: 8,
  },
  addBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
});

// ─── Step 1: Personal Info ──────────────────────────────────────────────────
export function OnboardingStep1({ navigation }: any) {
  const [focused, setFocused] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const isValid = name && dob && gender && city && state && pincode;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ padding: SPACING.screen, paddingTop: 56, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <StepProgress current={1} total={6} />
        
        <Text style={shared.title}>Personal Information</Text>
        <Text style={shared.subtitle}>Let's start with your basic details.</Text>

        {/* Photo Upload */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <TouchableOpacity style={{
            width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primaryBg,
            borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed',
            alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <Text style={{ fontSize: 28 }}>📷</Text>
            <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '600' }}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        <InputField id="name" label="Full Name" value={name} onChange={setName} placeholder="John Doe" focused={focused} setFocused={setFocused} />
        <InputField id="dob" label="Date of Birth" value={dob} onChange={setDob} placeholder="DD / MM / YYYY" focused={focused} setFocused={setFocused} />
        
        <View style={shared.inputGroup}>
          <Text style={shared.inputLabel}>Gender</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['Male', 'Female', 'Other'].map(g => (
              <TouchableOpacity key={g} style={[shared.chip, { flex: 1, alignItems: 'center' }, gender === g && shared.chipSelected]} onPress={() => setGender(g)}>
                <Text style={[shared.chipText, gender === g && shared.chipTextSelected]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField id="city" label="City" value={city} onChange={setCity} placeholder="e.g. Ahmedabad" focused={focused} setFocused={setFocused} />
        <InputField id="state" label="State" value={state} onChange={setState} placeholder="e.g. Gujarat" focused={focused} setFocused={setFocused} />
        <InputField id="pincode" label="Pin Code" value={pincode} onChange={setPincode} placeholder="380001" keyboardType="numeric" focused={focused} setFocused={setFocused} />

        <TouchableOpacity style={[shared.continueBtn, !isValid && shared.btnDisabled]} onPress={() => isValid && navigation.navigate('OnboardingStep2', { profileParams: { city, state, pincode, gender, bio: 'Teacher' } })}>
          <Text style={shared.continueBtnText}>Next Step</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 2: Teaching Info ──────────────────────────────────────────────────
const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Geography', 'Hindi'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const MODES = ['Online', 'Offline', 'Hybrid'];

export function OnboardingStep2({ navigation, route }: any) {
  const { profileParams } = route?.params || {};
  const [subjects, setSubjects] = useState<string[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [mode, setMode] = useState('');

  const toggle = (arr: string[], setArr: any, item: string) => {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  };

  const isValid = subjects.length > 0 && boards.length > 0 && mode;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ padding: SPACING.screen, paddingTop: 56, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backBtn}>
          <View style={shared.backCircle}><Text style={shared.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={2} total={6} />
        
        <Text style={shared.title}>Teaching Information</Text>
        <Text style={shared.subtitle}>What and how do you prefer to teach?</Text>

        <View style={shared.inputGroup}>
          <Text style={shared.inputLabel}>Subjects Taught</Text>
          <View style={shared.chipRow}>
            {SUBJECTS.map(s => (
              <TouchableOpacity key={s} style={[shared.chip, subjects.includes(s) && shared.chipSelected]} onPress={() => toggle(subjects, setSubjects, s)}>
                <Text style={[shared.chipText, subjects.includes(s) && shared.chipTextSelected]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={shared.inputGroup}>
          <Text style={shared.inputLabel}>Boards Familiar With</Text>
          <View style={shared.chipRow}>
            {BOARDS.map(b => (
              <TouchableOpacity key={b} style={[shared.chip, boards.includes(b) && shared.chipSelected]} onPress={() => toggle(boards, setBoards, b)}>
                <Text style={[shared.chipText, boards.includes(b) && shared.chipTextSelected]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={shared.inputGroup}>
          <Text style={shared.inputLabel}>Preferred Mode</Text>
          <View style={shared.chipRow}>
            {MODES.map(m => (
              <TouchableOpacity key={m} style={[shared.chip, mode === m && shared.chipSelected]} onPress={() => setMode(m)}>
                <Text style={[shared.chipText, mode === m && shared.chipTextSelected]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[shared.continueBtn, !isValid && shared.btnDisabled]} onPress={() => isValid && navigation.navigate('OnboardingStep3', { profileParams: { ...profileParams, subjects, boards } })}>
          <Text style={shared.continueBtnText}>Next Step</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Step 3: Experience ─────────────────────────────────────────────────────
export function OnboardingStep3({ navigation, route }: any) {
  const { profileParams } = route?.params || {};
  const [experiences, setExperiences] = useState([{ id: 1, school: '', designation: '' }]);
  const [focused, setFocused] = useState<string | null>(null);

  const addExp = () => setExperiences([...experiences, { id: Date.now(), school: '', designation: '' }]);
  const removeExp = (id: number) => setExperiences(experiences.filter(e => e.id !== id));

  const isValid = experiences.length === 0 || experiences.every(e => e.school && e.designation);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: SPACING.screen, paddingTop: 56, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backBtn}>
          <View style={shared.backCircle}><Text style={shared.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={3} total={6} />
        
        <Text style={shared.title}>Work Experience</Text>
        <Text style={shared.subtitle}>Add your past teaching experience.</Text>

        {experiences.map((exp, index) => (
          <View key={exp.id} style={shared.card}>
            <View style={shared.cardHeader}>
              <Text style={shared.cardTitle}>Experience {index + 1}</Text>
              <TouchableOpacity onPress={() => removeExp(exp.id)}>
                <Text style={shared.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <InputField id={`school_${exp.id}`} label="School/Institute Name" value={exp.school} 
              onChange={(t: string) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, school: t} : e))}
              placeholder="Delhi Public School" focused={focused} setFocused={setFocused} />
            <InputField id={`desig_${exp.id}`} label="Designation" value={exp.designation} 
              onChange={(t: string) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, designation: t} : e))}
              placeholder="Senior Math Teacher" focused={focused} setFocused={setFocused} />
          </View>
        ))}

        <TouchableOpacity style={shared.addBtn} onPress={addExp}>
          <Text style={{ fontSize: 18, color: COLORS.primary }}>+</Text>
          <Text style={shared.addBtnText}>Add Another Experience</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[shared.continueBtn, !isValid && shared.btnDisabled]} onPress={() => isValid && navigation.navigate('OnboardingStep4', { profileParams: { ...profileParams, experience: experiences } })}>
          <Text style={shared.continueBtnText}>Next Step</Text>
        </TouchableOpacity>
        <TouchableOpacity style={shared.skipBtn} onPress={() => navigation.navigate('OnboardingStep4', { profileParams })}>
          <Text style={shared.skipBtnText}>I'm a Fresher / Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 4: Qualifications ─────────────────────────────────────────────────
export function OnboardingStep4({ navigation, route }: any) {
  const { profileParams } = route?.params || {};
  const [quals, setQuals] = useState([{ id: 1, degree: '', institution: '', year: '' }]);
  const [focused, setFocused] = useState<string | null>(null);

  const addQual = () => setQuals([...quals, { id: Date.now(), degree: '', institution: '', year: '' }]);
  const removeQual = (id: number) => setQuals(quals.filter(q => q.id !== id));

  const isValid = quals.every(q => q.degree && q.institution && q.year);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: SPACING.screen, paddingTop: 56, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backBtn}>
          <View style={shared.backCircle}><Text style={shared.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={4} total={6} />
        
        <Text style={shared.title}>Qualifications</Text>
        <Text style={shared.subtitle}>Add your educational degrees and certs.</Text>

        {quals.map((q, index) => (
          <View key={q.id} style={shared.card}>
            <View style={shared.cardHeader}>
              <Text style={shared.cardTitle}>Qualification {index + 1}</Text>
              {index > 0 && (
                <TouchableOpacity onPress={() => removeQual(q.id)}>
                  <Text style={shared.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            <InputField id={`deg_${q.id}`} label="Degree/Certification" value={q.degree} 
              onChange={(t: string) => setQuals(quals.map(e => e.id === q.id ? {...e, degree: t} : e))}
              placeholder="B.Ed in Mathematics" focused={focused} setFocused={setFocused} />
            <InputField id={`inst_${q.id}`} label="Institution Name" value={q.institution} 
              onChange={(t: string) => setQuals(quals.map(e => e.id === q.id ? {...e, institution: t} : e))}
              placeholder="Gujarat University" focused={focused} setFocused={setFocused} />
            <InputField id={`year_${q.id}`} label="Year of Completion" value={q.year} 
              onChange={(t: string) => setQuals(quals.map(e => e.id === q.id ? {...e, year: t} : e))}
              placeholder="2020" keyboardType="numeric" focused={focused} setFocused={setFocused} />
          </View>
        ))}

        <TouchableOpacity style={shared.addBtn} onPress={addQual}>
          <Text style={{ fontSize: 18, color: COLORS.primary }}>+</Text>
          <Text style={shared.addBtnText}>Add Another Qualification</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[shared.continueBtn, !isValid && shared.btnDisabled]} onPress={() => isValid && navigation.navigate('OnboardingStep5', { profileParams: { ...profileParams, education: quals } })}>
          <Text style={shared.continueBtnText}>Next Step</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 5: Documents ──────────────────────────────────────────────────────
export function OnboardingStep5({ navigation, route }: any) {
  const { profileParams } = route?.params || {};
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: SPACING.screen, paddingTop: 56, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backBtn}>
          <View style={shared.backCircle}><Text style={shared.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={5} total={6} />
        
        <Text style={shared.title}>Upload Documents</Text>
        <Text style={shared.subtitle}>Verify your identity and qualifications.</Text>

        <View style={shared.card}>
          <Text style={shared.cardTitle}>Government ID (Aadhaar/PAN)</Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12, marginTop: 4 }}>Required for background check</Text>
          <TouchableOpacity style={[shared.addBtn, { marginBottom: 0 }]}>
            <Text style={shared.addBtnText}>Upload PDF or Image</Text>
          </TouchableOpacity>
        </View>

        <View style={shared.card}>
          <Text style={shared.cardTitle}>Resume (Optional)</Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12, marginTop: 4 }}>Auto-fill your profile from resume</Text>
          <TouchableOpacity style={[shared.addBtn, { marginBottom: 0 }]}>
            <Text style={shared.addBtnText}>Upload Resume (PDF)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={shared.continueBtn} onPress={() => navigation.navigate('OnboardingStep6', { profileParams })}>
          <Text style={shared.continueBtnText}>Next Step</Text>
        </TouchableOpacity>
        <TouchableOpacity style={shared.skipBtn} onPress={() => navigation.navigate('OnboardingStep6', { profileParams })}>
          <Text style={shared.skipBtnText}>Skip for Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Step 6: Demo Video ─────────────────────────────────────────────────────
export function OnboardingStep6({ navigation, route }: any) {
  const { profileParams } = route?.params || {};
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: SPACING.screen, paddingTop: 56, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backBtn}>
          <View style={shared.backCircle}><Text style={shared.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <StepProgress current={6} total={6} />
        
        <Text style={shared.title}>Demo Video</Text>
        <Text style={shared.subtitle}>Showcase your teaching style to schools. Profiles with videos get 4x more interviews.</Text>

        <View style={[shared.card, { alignItems: 'center', paddingVertical: 40, backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary, borderStyle: 'dashed', borderWidth: 2 }]}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🎥</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 8 }}>Record or Upload Video</Text>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' }}>Max duration: 5 minutes. Formats: MP4, MOV</Text>
        </View>

        <TouchableOpacity style={shared.continueBtn} onPress={() => navigation.navigate('ProfileScoreReveal', { profileParams })}>
          <Text style={shared.continueBtnText}>Finish Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={shared.skipBtn} onPress={() => navigation.navigate('ProfileScoreReveal', { profileParams })}>
          <Text style={shared.skipBtnText}>Skip Video</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Profile Score Reveal Screen ────────────────────────────────────────────
export function ProfileScoreRevealScreen({ navigation, route }: any) {
  const dispatch = useDispatch<any>();
  const updateProfile = useUpdateTeacherProfile();
  const { profileParams } = route.params || {};

  const handleFinish = async () => {
    // Save to backend
    if (profileParams) {
      // Make sure the required fields for 'completeness' are passed: bio, subjects, experience, education
      await updateProfile.mutateAsync({
        ...profileParams,
        bio: profileParams.bio || 'Teacher at Scorten',
      });
    }
    // Fetch updated user to update `isProfileComplete` in Redux
    await dispatch(getMeThunk());
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.screen }}>
        <Text style={{ fontSize: 60, marginBottom: 20 }}>🎉</Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
          Profile Completed!
        </Text>
        
        <View style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 32, elevation: 10 }}>
          <Text style={{ fontSize: 16, color: COLORS.textSecondary, fontWeight: '600' }}>Profile Score</Text>
          <Text style={{ fontSize: 56, fontWeight: '800', color: COLORS.primary }}>85</Text>
          <Text style={{ fontSize: 14, color: COLORS.success, fontWeight: '700' }}>Great start!</Text>
        </View>

        <Text style={{ fontSize: 16, color: '#FFFFFFCC', textAlign: 'center', marginBottom: 40, lineHeight: 24 }}>
          Your profile is now visible to schools. Add more details later to reach 100%.
        </Text>

        <TouchableOpacity 
          style={[shared.continueBtn, { backgroundColor: '#FFF', width: '100%' }, updateProfile.isPending && shared.btnDisabled]} 
          onPress={handleFinish}
          disabled={updateProfile.isPending}
        >
          <Text style={[shared.continueBtnText, { color: COLORS.primary }]}>
            {updateProfile.isPending ? 'Saving...' : 'Go to Dashboard'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
