import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useCreateJob } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SUBJECTS  = ['Mathematics','English','Science','Physics','Chemistry','Hindi','Biology','History','Computer Science','Geography','Art','Music'];
const BOARDS    = ['CBSE','ICSE','IB','Cambridge','State Board'];
const JOB_TYPES = ['Full Time','Part Time','Contract'];
const EXP_OPTS  = ['0–1 yr','1–3 yrs','3–5 yrs','5–10 yrs','10+ yrs'];

function InputField({ label, value, onChange, placeholder, multiline, keyboardType, icon }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, focused && s.focused, multiline && { alignItems: 'flex-start', paddingTop: 12 }]}>
        {icon && <Icon name={icon} size={17} color={focused ? COLORS.primary : COLORS.textMuted} style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }} />}
        <TextInput
          style={[s.input, multiline && { minHeight: 100, textAlignVertical: 'top' }]}
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
          const isOn = single ? selected === opt : Array.isArray(selected) && selected.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              style={[s.chip, isOn && s.chipOn]}
              onPress={() => onToggle(opt)}
            >
              {isOn && <Icon name="checkmark" size={12} color={COLORS.primary} />}
              <Text style={[s.chipText, isOn && s.chipTextOn]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  chipGroup: { marginBottom: 14 },
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

export function CreateJobScreen({ navigation }: any) {
  const createMutation = useCreateJob();
  const [step, setStep] = useState(0); // 0=basic, 1=details, 2=compensation

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [jobType, setJobType] = useState('Full Time');
  const [experience, setExperience] = useState('1–3 yrs');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [city, setCity] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const toggleArr = (arr: string[], setArr: any, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x: string) => x !== val) : [...arr, val]);

  const generateWithAI = async () => {
    if (!subjects.length) { Alert.alert('Select a subject first'); return; }
    setAiGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setTitle(`${subjects[0]} Teacher – ${jobType}`);
    setDesc(`We are looking for a passionate and experienced ${subjects[0]} teacher to join our team.\n\nThe ideal candidate will have strong subject knowledge, excellent communication skills, and a commitment to student success.\n\nKey Responsibilities:\n• Plan and deliver engaging lessons aligned with ${boards[0] || 'CBSE'} curriculum\n• Assess and monitor student progress\n• Collaborate with parents and fellow teachers\n• Maintain a positive classroom environment`);
    setAiGenerating(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) { Alert.alert('Title required'); return; }
    if (!subjects.length) { Alert.alert('Select at least one subject'); return; }
    try {
      await createMutation.mutateAsync({
        title, description: desc, subjects, boards,
        jobType: jobType.toLowerCase().replace(' ', '_'),
        experienceRequired: experience,
        salaryMin: parseInt(salaryMin) || 30000,
        salaryMax: parseInt(salaryMax) || 60000,
        city, isAiInterviewEnabled: true,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Job Posted!', 'Your job has been posted successfully.');
      navigation.goBack();
    }
  };

  const STEPS = ['Basic Info', 'Requirements', 'Compensation'];

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <TouchableOpacity
          style={[styles.postBtn, (createMutation.isPending || !title.trim()) && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={createMutation.isPending || !title.trim()}
        >
          {createMutation.isPending
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Text style={styles.postBtnText}>Publish</Text>
          }
        </TouchableOpacity>
      </View>

      {/* STEP TABS */}
      <View style={styles.stepRow}>
        {STEPS.map((st, i) => (
          <TouchableOpacity
            key={st}
            style={[styles.stepTab, step === i && styles.stepTabActive]}
            onPress={() => setStep(i)}
          >
            <View style={[styles.stepNum, step >= i && styles.stepNumDone]}>
              {step > i
                ? <Icon name="checkmark" size={12} color="#FFF" />
                : <Text style={[styles.stepNumText, step === i && styles.stepNumTextActive]}>{i + 1}</Text>
              }
            </View>
            <Text style={[styles.stepLabel, step === i && styles.stepLabelActive]}>{st}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <View style={styles.card}>
            {/* AI Generate banner */}
            <TouchableOpacity style={styles.aiGenBanner} onPress={generateWithAI} disabled={aiGenerating}>
              <View style={styles.aiGenIcon}>
                {aiGenerating
                  ? <ActivityIndicator size="small" color="#FFF" />
                  : <Icon name="sparkles" size={20} color="#FFF" />
                }
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.aiGenTitle}>AI Job Description Generator</Text>
                <Text style={styles.aiGenSub}>Select subjects below, then tap to auto-fill</Text>
              </View>
              <Icon name="chevron-forward" size={18} color="#FFFFFF80" />
            </TouchableOpacity>

            <InputField label="Job Title" value={title} onChange={setTitle} placeholder="e.g. Senior Mathematics Teacher" icon="briefcase-outline" />
            <InputField label="Job Description" value={desc} onChange={setDesc} placeholder="Describe the role, responsibilities..." multiline icon="document-text-outline" />
            <InputField label="City / Location" value={city} onChange={setCity} placeholder="e.g. New Delhi" icon="location-outline" />
          </View>
        )}

        {step === 1 && (
          <View style={styles.card}>
            <ChipGroup label="Subjects" options={SUBJECTS} selected={subjects} onToggle={(v: string) => toggleArr(subjects, setSubjects, v)} />
            <ChipGroup label="Board" options={BOARDS} selected={boards} onToggle={(v: string) => toggleArr(boards, setBoards, v)} />
            <ChipGroup label="Job Type" options={JOB_TYPES} selected={jobType} onToggle={setJobType} single />
            <ChipGroup label="Experience Required" options={EXP_OPTS} selected={experience} onToggle={setExperience} single />

            <View style={styles.aiToggleRow}>
              <View style={styles.aiToggleLeft}>
                <Icon name="mic-outline" size={18} color={COLORS.primary} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.aiToggleTitle}>Enable AI Interview</Text>
                  <Text style={styles.aiToggleSub}>Auto-screen candidates with AI</Text>
                </View>
              </View>
              <View style={styles.toggleOn}>
                <Icon name="checkmark" size={14} color="#FFF" />
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <View style={styles.salaryRow}>
              <View style={{ flex: 1 }}>
                <InputField label="Min Salary (₹/mo)" value={salaryMin} onChange={setSalaryMin} placeholder="e.g. 35000" keyboardType="number-pad" icon="cash-outline" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="Max Salary (₹/mo)" value={salaryMax} onChange={setSalaryMax} placeholder="e.g. 55000" keyboardType="number-pad" icon="cash-outline" />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Job Summary</Text>
              {[
                { icon: 'briefcase-outline', label: 'Title', val: title || '—' },
                { icon: 'book-outline', label: 'Subjects', val: subjects.join(', ') || '—' },
                { icon: 'school-outline', label: 'Board', val: boards.join(', ') || '—' },
                { icon: 'time-outline', label: 'Type', val: jobType },
                { icon: 'location-outline', label: 'City', val: city || '—' },
                { icon: 'cash-outline', label: 'Salary', val: salaryMin && salaryMax ? `₹${salaryMin}–₹${salaryMax}` : '—' },
              ].map(item => (
                <View key={item.label} style={styles.summaryRow}>
                  <Icon name={item.icon} size={15} color={COLORS.textMuted} />
                  <Text style={styles.summaryLabel}> {item.label}</Text>
                  <Text style={styles.summaryVal} numberOfLines={1}>{item.val}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Nav buttons */}
        <View style={styles.navRow}>
          {step > 0 && (
            <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(step - 1)}>
              <Icon name="chevron-back" size={18} color={COLORS.text} />
              <Text style={styles.prevBtnText}> Back</Text>
            </TouchableOpacity>
          )}
          {step < STEPS.length - 1
            ? (
              <TouchableOpacity style={[styles.nextBtn, { flex: 1 }]} onPress={() => setStep(step + 1)}>
                <Text style={styles.nextBtnText}>Next: {STEPS[step + 1]}</Text>
                <Icon name="chevron-forward" size={18} color="#FFF" />
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity style={[styles.submitBtn, { flex: 1 }]} onPress={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? <ActivityIndicator color="#FFF" />
                  : <>
                      <Icon name="checkmark-circle" size={20} color="#FFF" />
                      <Text style={styles.nextBtnText}> Publish Job</Text>
                    </>
                }
              </TouchableOpacity>
            )
          }
        </View>

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
  postBtn: { backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full },
  postBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  stepRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screen, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 4,
  },
  stepTab: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepTabActive: {},
  stepNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumDone: { backgroundColor: COLORS.primary },
  stepNumText: { fontSize: 12, fontWeight: '800', color: COLORS.textMuted },
  stepNumTextActive: { color: COLORS.primary },
  stepLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, flex: 1 },
  stepLabelActive: { color: COLORS.primary, fontWeight: '800' },

  scroll: { padding: SPACING.screen },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  aiGenBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 14, marginBottom: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  aiGenIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  aiGenTitle: { fontSize: 14, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  aiGenSub: { fontSize: 11, color: '#FFFFFFBB' },

  aiToggleRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 14, marginTop: 4,
    borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  aiToggleLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  aiToggleTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  aiToggleSub: { fontSize: 11, color: COLORS.textSecondary },
  toggleOn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center' },

  salaryRow: { flexDirection: 'row', gap: 12 },

  summaryCard: {
    backgroundColor: COLORS.backgroundAlt, borderRadius: RADIUS.xl, padding: 14,
    borderWidth: 1, borderColor: COLORS.border, marginTop: 4,
  },
  summaryTitle: { fontSize: 13, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  summaryRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  summaryLabel: { fontSize: 12, color: COLORS.textSecondary, width: 70 },
  summaryVal: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'right' },

  navRow: { flexDirection: 'row', gap: 12 },
  prevBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, paddingVertical: 16,
    paddingHorizontal: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  prevBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.success, borderRadius: RADIUS.xl, paddingVertical: 16,
    shadowColor: COLORS.success, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  nextBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
});
