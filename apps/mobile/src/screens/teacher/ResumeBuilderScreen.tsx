import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { useMyTeacherProfile, useGenerateResume } from '../../hooks/useQueries';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SECTIONS = [
  { key: 'personal',    icon: 'person-outline',         label: 'Personal Info',   done: true  },
  { key: 'summary',     icon: 'document-text-outline',  label: 'Summary',         done: false },
  { key: 'experience',  icon: 'briefcase-outline',       label: 'Experience',      done: true  },
  { key: 'skills',      icon: 'trophy-outline',          label: 'Skills & Badges', done: true  },
  { key: 'education',   icon: 'school-outline',          label: 'Education',       done: true  },
  { key: 'portfolio',   icon: 'videocam-outline',        label: 'Portfolio',       done: false },
];

export function ResumeBuilderScreen({ navigation, route }: any) {
  const templateId = route.params?.templateId || '1';
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const generateMutation = useGenerateResume();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>(['personal', 'experience', 'skills', 'education']);

  const completePct = Math.round((completedSections.length / SECTIONS.length) * 100);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateMutation.mutateAsync(profile || {
        firstName: user?.firstName, lastName: user?.lastName,
        subjects: ['Mathematics'], experienceYears: 5,
      });
      setGenerated(true);
    } catch {
      setGenerated(true); // allow preview anyway
    }
    setGenerating(false);
  };

  const toggleSection = (key: string) => {
    setCompletedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Build Resume</Text>
          <Text style={styles.headerSub}>Template {templateId} · {completePct}% complete</Text>
        </View>
        {generated && (
          <TouchableOpacity style={styles.previewBtn} onPress={() => navigation.navigate('ResumePreview', { templateId })}>
            <Icon name="eye-outline" size={16} color={COLORS.primary} />
            <Text style={styles.previewBtnText}> Preview</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${completePct}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* AI Generate */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={handleGenerate}
          disabled={generating}
          activeOpacity={0.88}
        >
          <View style={styles.aiIconBox}>
            {generating
              ? <ActivityIndicator color="#FFF" />
              : <Icon name="sparkles" size={26} color="#FFF" />
            }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>
              {generating ? 'Generating with AI...' : generated ? '✅ Resume Generated!' : 'Generate with AI'}
            </Text>
            <Text style={styles.aiSub}>
              {generating ? 'Analyzing your profile...' : generated ? 'Tap Preview to see your resume' : 'Auto-fill all sections from your profile'}
            </Text>
          </View>
          {!generating && <Icon name={generated ? 'eye-outline' : 'flash'} size={22} color="#FFFFFF80" />}
        </TouchableOpacity>

        {/* Profile Source */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Icon name="person" size={26} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.profileSub}>{profile?.subjects?.join(', ') || 'Mathematics Teacher'} · {profile?.city || 'India'}</Text>
          </View>
          <View style={[styles.completePill, { backgroundColor: completePct >= 80 ? COLORS.successBg : COLORS.warningBg }]}>
            <Text style={[styles.completePillText, { color: completePct >= 80 ? COLORS.success : COLORS.warning }]}>{completePct}%</Text>
          </View>
        </View>

        {/* Sections */}
        <Text style={styles.sectionTitle}>Resume Sections</Text>
        <View style={styles.sectionsCard}>
          {SECTIONS.map((sec, i) => {
            const isDone = completedSections.includes(sec.key);
            return (
              <TouchableOpacity
                key={sec.key}
                style={[styles.sectionRow, i < SECTIONS.length - 1 && styles.sectionRowBorder]}
                onPress={() => toggleSection(sec.key)}
                activeOpacity={0.75}
              >
                <View style={[styles.sectionIconBox, { backgroundColor: isDone ? COLORS.primaryBg : COLORS.backgroundAlt }]}>
                  <Icon name={sec.icon} size={18} color={isDone ? COLORS.primary : COLORS.textMuted} />
                </View>
                <Text style={[styles.sectionLabel, isDone && { color: COLORS.text }]}>{sec.label}</Text>
                <View style={[styles.sectionCheck, isDone && styles.sectionCheckDone]}>
                  {isDone && <Icon name="checkmark" size={13} color="#FFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => Alert.alert('Download', 'PDF download will be available after resume generation.')}
          >
            <Icon name="share-outline" size={18} color={COLORS.primary} />
            <Text style={styles.downloadBtnText}> Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.previewFullBtn}
            onPress={() => navigation.navigate('ResumePreview', { templateId })}
          >
            <Icon name="eye-outline" size={18} color="#FFF" />
            <Text style={styles.previewFullBtnText}> Full Preview</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },
  previewBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full },
  previewBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  progressTrack: { height: 4, backgroundColor: COLORS.backgroundAlt },
  progressFill: { height: 4, backgroundColor: COLORS.primary },

  scroll: { padding: SPACING.screen },

  aiCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 16, marginBottom: 14,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  aiIconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 15, fontWeight: '800', color: '#FFF', marginBottom: 3 },
  aiSub: { fontSize: 12, color: '#FFFFFFBB', lineHeight: 17 },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  profileAvatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  profileSub: { fontSize: 12, color: COLORS.textSecondary },
  completePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full },
  completePillText: { fontSize: 13, fontWeight: '800' },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  sectionsCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  sectionRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sectionIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  sectionCheck: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  sectionCheckDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },

  actionRow: { flexDirection: 'row', gap: 12 },
  downloadBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, paddingVertical: 15,
    borderWidth: 1.5, borderColor: COLORS.primary + '40',
  },
  downloadBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  previewFullBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 15,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  previewFullBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
