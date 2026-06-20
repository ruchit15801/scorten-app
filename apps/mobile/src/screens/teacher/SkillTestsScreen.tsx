import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const SKILL_TESTS = [
  { id: '1', subject: 'Mathematics', level: 'Advanced', questions: 30, duration: '25 min', earnBadge: '🏅 Expert Badge', score: null },
  { id: '2', subject: 'Pedagogy & Teaching', level: 'Intermediate', questions: 25, duration: '20 min', earnBadge: '🎓 Certified Teacher', score: 88 },
  { id: '3', subject: 'English Grammar', level: 'Advanced', questions: 30, duration: '25 min', earnBadge: '✍️ Language Expert', score: null },
  { id: '4', subject: 'Child Psychology', level: 'Beginner', questions: 20, duration: '15 min', earnBadge: '🧠 Psychology Badge', score: 92 },
];

export function SkillTestsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40 }}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Skill Tests</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Boost your Scorten Score</Text>
            <Text style={styles.infoSub}>Pass skill tests to earn verified badges that make you stand out to schools.</Text>
          </View>
        </View>

        {SKILL_TESTS.map(test => (
          <TouchableOpacity
            key={test.id}
            style={styles.testCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AssessmentsList')}
          >
            <View style={styles.testHeader}>
              <View>
                <Text style={styles.testSubject}>{test.subject}</Text>
                <Text style={styles.testLevel}>Level: {test.level}</Text>
              </View>
              {test.score !== null ? (
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{test.score}%</Text>
                </View>
              ) : (
                <View style={styles.notDoneBadge}>
                  <Text style={styles.notDoneText}>Not Taken</Text>
                </View>
              )}
            </View>

            <View style={styles.testMeta}>
              <Text style={styles.metaText}>❓ {test.questions} questions</Text>
              <Text style={styles.metaText}>⏱️ {test.duration}</Text>
            </View>

            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>Earn: {test.earnBadge}</Text>
            </View>

            <TouchableOpacity
              style={[styles.startBtn, test.score !== null && styles.retakeBtn]}
              onPress={() => navigation.navigate('AssessmentsList')}
            >
              <Text style={styles.startBtnText}>{test.score !== null ? 'Retake Test' : 'Start Test'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.primaryBg,
  },
  backArrow: { fontSize: 32, color: COLORS.text },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  scroll: { padding: SPACING.screen },

  infoBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 16,
    borderWidth: 1, borderColor: COLORS.primary + '30', marginBottom: 20,
  },
  infoTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  infoSub: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  testCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  testHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  testSubject: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  testLevel: { fontSize: 13, color: COLORS.textSecondary },
  scoreBadge: { backgroundColor: COLORS.successBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.lg },
  scoreText: { fontSize: 16, fontWeight: '800', color: COLORS.successDark },
  notDoneBadge: { backgroundColor: COLORS.backgroundAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.lg },
  notDoneText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  testMeta: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  metaText: { fontSize: 13, color: COLORS.textSecondary },
  badgeRow: { marginBottom: 14 },
  badgeText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  startBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: 12, alignItems: 'center',
  },
  retakeBtn: { backgroundColor: COLORS.primaryBg },
  startBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
