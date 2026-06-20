import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert, Dimensions,
} from 'react-native';
import { useSkillTests, useMyTestResults } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const TESTS = [
  { _id: '1', title: 'Mathematics Proficiency Test', subject: 'Mathematics', level: 'Advanced', questions: 30, duration: '45 min', score: null, attempts: 0, badge: 'Math Expert' },
  { _id: '2', title: 'Classroom Management Skills', subject: 'General', level: 'Intermediate', questions: 25, duration: '30 min', score: 88, attempts: 1, badge: 'Expert Educator' },
  { _id: '3', title: 'Digital Tools for Teachers', subject: 'Technology', level: 'Beginner', questions: 20, duration: '25 min', score: null, attempts: 0, badge: 'EdTech Ready' },
  { _id: '4', title: 'English Language Proficiency', subject: 'English', level: 'Advanced', questions: 30, duration: '40 min', score: 92, attempts: 1, badge: 'Language Expert' },
  { _id: '5', title: 'Student Assessment Design', subject: 'Assessment', level: 'Intermediate', questions: 20, duration: '25 min', score: null, attempts: 0, badge: 'Assessment Pro' },
];

const LEVEL_CFG: any = {
  Beginner:     { color: COLORS.success, bg: COLORS.successBg },
  Intermediate: { color: COLORS.warning, bg: COLORS.warningBg },
  Advanced:     { color: COLORS.error,   bg: COLORS.errorBg   },
};

function TestCard({ test, onPress }: any) {
  const lvl = LEVEL_CFG[test.level] || LEVEL_CFG.Intermediate;
  const attempted = test.score !== null;
  const scoreColor = test.score >= 88 ? COLORS.success : test.score >= 70 ? COLORS.warning : COLORS.error;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.87}>
      <View style={styles.cardRow}>
        <View style={styles.testIcon}>
          <Icon name="trophy-outline" size={22} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.testTitle} numberOfLines={2}>{test.title}</Text>
          <Text style={styles.testSubject}>{test.subject}</Text>
          <View style={styles.testMeta}>
            <Icon name="help-circle-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.testMetaText}> {test.questions}Q  ·  {test.duration}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <View style={[styles.levelPill, { backgroundColor: lvl.bg }]}>
            <Text style={[styles.levelText, { color: lvl.color }]}>{test.level}</Text>
          </View>
          {attempted && (
            <Text style={[styles.scoreText, { color: scoreColor }]}>{test.score}/100</Text>
          )}
        </View>
      </View>

      <View style={styles.cardFoot}>
        {attempted ? (
          <>
            <View style={styles.badgePill}>
              <Icon name="ribbon" size={13} color="#92400E" />
              <Text style={styles.badgeText}> {test.badge} earned!</Text>
            </View>
            <TouchableOpacity style={styles.retakeBtn} onPress={onPress}>
              <Text style={styles.retakeBtnText}>Retake</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Icon name="lock-open-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.lockText}>Not attempted</Text>
            <TouchableOpacity style={styles.startBtn} onPress={onPress}>
              <Icon name="play" size={13} color="#FFF" />
              <Text style={styles.startBtnText}> Start Test</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function SkillTestsScreen({ navigation }: any) {
  const { data: apiTests } = useSkillTests();
  const { data: results } = useMyTestResults();

  const tests = apiTests?.length ? apiTests : TESTS;
  const done = tests.filter((t: any) => t.score !== null).length;
  const avgScore = done > 0
    ? Math.round(tests.filter((t: any) => t.score).reduce((s: number, t: any) => s + t.score, 0) / done)
    : 0;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Skill Tests</Text>
          <Text style={styles.headerSub}>Earn verified badges for your profile</Text>
        </View>
      </View>

      {/* Stats Strip */}
      <View style={styles.statsStrip}>
        {[
          { icon: 'trophy',         label: 'Badges Earned', val: done,     color: '#F59E0B' },
          { icon: 'checkmark-circle', label: 'Completed',   val: done,     color: COLORS.success },
          { icon: 'star',           label: 'Avg Score',     val: avgScore || '—', color: COLORS.primary },
        ].map((s, i) => (
          <View key={s.label} style={[styles.statItem, i > 0 && styles.statBorder]}>
            <Icon name={s.icon} size={18} color={s.color} />
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Badges bar */}
      {done > 0 && (
        <View style={styles.badgesBar}>
          <Icon name="ribbon" size={18} color="#92400E" />
          <Text style={styles.badgesTitle}>Your Badges: </Text>
          {tests.filter((t: any) => t.score).map((t: any) => (
            <View key={t._id} style={styles.earnedBadge}>
              <Text style={styles.earnedBadgeText}>{t.badge}</Text>
            </View>
          ))}
        </View>
      )}

      <FlatList
        data={tests}
        keyExtractor={(t: any) => t._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <TestCard
            test={item}
            onPress={() => Alert.alert(
              item.title,
              `${item.questions} questions · ${item.duration}\nEarn the "${item.badge}" badge`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: item.score !== null ? 'Retake Test' : 'Start Test', onPress: () => Alert.alert('Test Started!', 'Feature coming soon.') },
              ]
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },

  statsStrip: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    paddingVertical: 14, paddingHorizontal: SPACING.screen,
    borderTopWidth: 1, borderTopColor: '#FFFFFF20',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statBorder: { borderLeftWidth: 1, borderLeftColor: '#FFFFFF30' },
  statVal: { fontSize: 18, fontWeight: '900' },
  statLbl: { fontSize: 10, color: '#FFFFFFAA', fontWeight: '600' },

  badgesBar: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8,
    backgroundColor: '#FEF3C7', paddingHorizontal: SPACING.screen, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#FDE68A',
  },
  badgesTitle: { fontSize: 12, fontWeight: '700', color: '#92400E' },
  earnedBadge: { backgroundColor: '#FEF9C3', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: '#FDE047' },
  earnedBadgeText: { fontSize: 11, fontWeight: '700', color: '#713F12' },

  list: { padding: SPACING.screen },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  testIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  testTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3, lineHeight: 19 },
  testSubject: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  testMeta: { flexDirection: 'row', alignItems: 'center' },
  testMetaText: { fontSize: 11, color: COLORS.textMuted },
  levelPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  levelText: { fontSize: 11, fontWeight: '700' },
  scoreText: { fontSize: 16, fontWeight: '900' },

  cardFoot: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10,
  },
  badgePill: {
    flexDirection: 'row', alignItems: 'center', flex: 1,
    backgroundColor: '#FEF3C7', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 5,
  },
  badgeText: { fontSize: 11, color: '#92400E', fontWeight: '700' },
  retakeBtn: { backgroundColor: COLORS.backgroundAlt, paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full },
  retakeBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  lockText: { flex: 1, fontSize: 12, color: COLORS.textMuted },
  startBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full },
  startBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
});
