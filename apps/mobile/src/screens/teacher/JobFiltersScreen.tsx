import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const FilterSection = ({ title, options, selected, onToggle }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.chipRow}>
      {options.map((opt: string) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected.includes(opt) && styles.chipActive]}
          onPress={() => onToggle(opt)}
        >
          <Text style={[styles.chipText, selected.includes(opt) && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export function JobFiltersScreen({ navigation }: any) {
  const [subjects, setSubjects] = useState<string[]>(['Mathematics']);
  const [boards, setBoards] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>(['Online']);
  const [jobTypes, setJobTypes] = useState<string[]>(['Full Time']);
  
  const toggle = (arr: string[], setArr: any, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={() => { setSubjects([]); setBoards([]); setModes([]); setJobTypes([]); }}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FilterSection 
          title="Subject" 
          options={['Mathematics', 'Physics', 'Chemistry', 'English', 'Hindi', 'History', 'Computer Science']} 
          selected={subjects} 
          onToggle={(v: string) => toggle(subjects, setSubjects, v)} 
        />
        
        <FilterSection 
          title="Education Board" 
          options={['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'IGCSE']} 
          selected={boards} 
          onToggle={(v: string) => toggle(boards, setBoards, v)} 
        />

        <FilterSection 
          title="Teaching Mode" 
          options={['Offline (In School)', 'Online', 'Hybrid']} 
          selected={modes} 
          onToggle={(v: string) => toggle(modes, setModes, v)} 
        />

        <FilterSection 
          title="Job Type" 
          options={['Full Time', 'Part Time', 'Contract', 'Temporary']} 
          selected={jobTypes} 
          onToggle={(v: string) => toggle(jobTypes, setJobTypes, v)} 
        />

        {/* Salary Range (mocked as simple pills for now) */}
        <FilterSection 
          title="Salary Expectation" 
          options={['Any', '₹15k - ₹25k', '₹25k - ₹40k', '₹40k+']} 
          selected={['Any']} 
          onToggle={() => {}} 
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  close: { fontSize: 24, color: COLORS.text, width: 50 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  clear: { fontSize: 15, fontWeight: '600', color: COLORS.error, width: 50, textAlign: 'right' },
  
  content: { padding: SPACING.screen, paddingBottom: 100 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { 
    backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border 
  },
  chipActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLORS.primary },

  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: COLORS.surface, padding: SPACING.screen, 
    borderTopWidth: 1, borderTopColor: COLORS.border 
  },
  applyBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.full, alignItems: 'center' },
  applyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
