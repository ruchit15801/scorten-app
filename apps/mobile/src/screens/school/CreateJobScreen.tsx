import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useCreateJob } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Temporary'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Hindi', 'History', 'Geography', 'Computer Science', 'Biology'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const EXP_LEVELS = ['Fresher', '1-2 years', '3-5 years', '5+ years', '10+ years'];

function ChipGroup({ label, options, selected, onToggle, single }: any) {
  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={s.chips}>
        {options.map((opt: string) => {
          const isSelected = single ? selected === opt : selected.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              style={[s.chip, isSelected && s.chipActive]}
              onPress={() => onToggle(opt)}
            >
              <Text style={[s.chipText, isSelected && s.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function CreateJobScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [jobType, setJobType] = useState('Full Time');
  const [expLevel, setExpLevel] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const createJob = useCreateJob();

  const toggleArr = (arr: string[], setArr: any, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const handleGenerateAI = () => {
    if (!title) return Alert.alert('Enter a job title first');
    setIsGenerating(true);
    setTimeout(() => {
      setDescription(
        `We are looking for a passionate and experienced ${title} to join our team.\n\n` +
        `📋 Responsibilities:\n• Plan and deliver engaging ${subjects[0] || 'subject'} lessons\n` +
        `• Assess student progress regularly\n• Maintain a positive classroom environment\n• Collaborate with parents and staff\n\n` +
        `✅ Requirements:\n• B.Ed / M.Ed degree or equivalent\n• ${expLevel || '3+ years'} of teaching experience\n` +
        `• Strong ${subjects[0] || 'subject'} knowledge\n• Excellent communication skills\n• Familiarity with ${boards[0] || 'CBSE'} curriculum`
      );
      setIsGenerating(false);
    }, 1800);
  };

  const handlePost = async () => {
    if (!title || subjects.length === 0) {
      return Alert.alert('Missing Info', 'Please fill in job title and select at least one subject.');
    }
    try {
      await createJob.mutateAsync({
        title,
        description,
        subjects,
        boards,
        jobType: jobType.toLowerCase().replace(' ', '_'),
        experienceRequired: expLevel,
        salaryMin: parseInt(salaryMin) || 0,
        salaryMax: parseInt(salaryMax) || 0,
      });
      navigation.goBack();
    } catch (e) {
      navigation.goBack(); // fallback for mock
    }
  };

  const isValid = title.trim() && subjects.length > 0;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post New Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* AI Banner */}
        <TouchableOpacity style={styles.aiBanner} onPress={handleGenerateAI} activeOpacity={0.85}>
          <Text style={{ fontSize: 26, marginRight: 12 }}>🤖</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Generate with AI</Text>
            <Text style={styles.aiSub}>Let Scorten AI write the job description for you</Text>
          </View>
          {isGenerating
            ? <ActivityIndicator color={COLORS.primary} />
            : <Text style={{ color: COLORS.primary, fontWeight: '800', fontSize: 16 }}>→</Text>
          }
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Job Details</Text>

          <View style={s.group}>
            <Text style={s.label}>Job Title *</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. Senior Mathematics Teacher"
              placeholderTextColor={COLORS.inputPlaceholder}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={s.group}>
            <Text style={s.label}>Job Description</Text>
            <TextInput
              style={[s.input, s.textarea]}
              placeholder="Describe responsibilities, requirements..."
              placeholderTextColor={COLORS.inputPlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Min Salary (₹/mo)</Text>
              <TextInput style={s.input} placeholder="25000" placeholderTextColor={COLORS.inputPlaceholder} value={salaryMin} onChangeText={setSalaryMin} keyboardType="number-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Max Salary (₹/mo)</Text>
              <TextInput style={s.input} placeholder="60000" placeholderTextColor={COLORS.inputPlaceholder} value={salaryMax} onChangeText={setSalaryMax} keyboardType="number-pad" />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Requirements</Text>
          <ChipGroup label="Subjects *" options={SUBJECTS} selected={subjects} onToggle={(s: string) => toggleArr(subjects, setSubjects, s)} />
          <ChipGroup label="Board" options={BOARDS} selected={boards} onToggle={(b: string) => toggleArr(boards, setBoards, b)} />
          <ChipGroup label="Job Type" options={JOB_TYPES} selected={jobType} onToggle={setJobType} single />
          <ChipGroup label="Experience Required" options={EXP_LEVELS} selected={expLevel} onToggle={setExpLevel} single />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.postBtn, !isValid && styles.postBtnOff, createJob.isPending && { opacity: 0.7 }]}
          onPress={handlePost}
          disabled={!isValid || createJob.isPending}
        >
          {createJob.isPending
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.postBtnText}>🚀 Post Job Now</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: COLORS.text,
  },
  textarea: { height: 120, paddingTop: 14 },
  row: { flexDirection: 'row', gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
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
    paddingHorizontal: SPACING.screen, paddingTop: 52, paddingBottom: 14,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },

  scroll: { padding: SPACING.screen },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 16,
    borderWidth: 1.5, borderColor: COLORS.primary + '40', marginBottom: 20,
  },
  aiTitle: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginBottom: 3 },
  aiSub: { fontSize: 13, color: COLORS.textSecondary },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 16 },

  footer: {
    padding: SPACING.screen, backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10,
  },
  postBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  postBtnOff: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  postBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
