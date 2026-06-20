import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const FILTERS = [
  { title: 'Subjects',    options: ['Mathematics','Physics','Chemistry','English','Science','Hindi','Computer','History','Biology'] },
  { title: 'Board',       options: ['CBSE','ICSE','IB','Cambridge','State Board'] },
  { title: 'Job Type',    options: ['Full Time','Part Time','Contract','Freelance'] },
  { title: 'Work Mode',   options: ['On-site','Online','Hybrid'] },
  { title: 'Experience',  options: ['Fresher','1–3 yrs','3–5 yrs','5–10 yrs','10+ yrs'] },
  { title: 'Salary Range',options: ['Under ₹20k','₹20k–₹40k','₹40k–₹60k','₹60k–₹80k','₹80k+'] },
];

function FilterSection({ title, options, selected, onToggle }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipRow}>
        {options.map((opt: string) => {
          const isOn = selected.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, isOn && styles.chipOn]}
              onPress={() => onToggle(opt)}
            >
              {isOn && <Icon name="checkmark" size={12} color={COLORS.primary} />}
              <Text style={[styles.chipText, isOn && styles.chipTextOn]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function JobFiltersScreen({ navigation, route }: any) {
  const initial = route.params?.filters || {};
  const [selected, setSelected] = useState<Record<string, string[]>>({
    Subjects:     initial.subjects || [],
    Board:        initial.boards   || [],
    'Job Type':   initial.jobTypes || ['Full Time'],
    'Work Mode':  initial.modes    || [],
    Experience:   initial.exp      || [],
    'Salary Range': initial.salary || [],
  });

  const toggle = (group: string, val: string) => {
    setSelected(prev => {
      const cur = prev[group] || [];
      return { ...prev, [group]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
    });
  };

  const clear = () => setSelected({
    Subjects: [], Board: [], 'Job Type': [], 'Work Mode': [], Experience: [], 'Salary Range': [],
  });

  const apply = () => {
    const filters = {
      subjects: selected['Subjects'],
      boards: selected['Board'],
      jobTypes: selected['Job Type'],
      modes: selected['Work Mode'],
      exp: selected['Experience'],
      salary: selected['Salary Range'],
    };
    navigation.navigate('Jobs', { filters });
  };

  const totalSelected = Object.values(selected).flat().length;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter Jobs</Text>
        {totalSelected > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{totalSelected}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.clearBtn} onPress={clear}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {FILTERS.map(f => (
          <FilterSection
            key={f.title}
            title={f.title}
            options={f.options}
            selected={selected[f.title] || []}
            onToggle={(val: string) => toggle(f.title, val)}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerCount}>{totalSelected} filter{totalSelected !== 1 ? 's' : ''} applied</Text>
        <TouchableOpacity style={styles.applyBtn} onPress={apply}>
          <Icon name="search" size={18} color="#FFF" />
          <Text style={styles.applyBtnText}> Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#FFF' },
  countBadge: { backgroundColor: '#FFFFFF30', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  clearBtn: {},
  clearText: { fontSize: 14, fontWeight: '700', color: '#FFFFFFCC' },

  scroll: { paddingHorizontal: SPACING.screen, paddingTop: 8 },

  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: COLORS.text,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 8,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 9,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  chipOn: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextOn: { color: COLORS.primary, fontWeight: '700' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.screen, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  footerCount: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 14, paddingHorizontal: 28,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  applyBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});
