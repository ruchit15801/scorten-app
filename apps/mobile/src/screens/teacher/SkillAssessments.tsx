import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const ASSESSMENTS = [
  { id: '1', title: 'Advanced Mathematics', category: 'Subject Skill', duration: '15 mins', questions: 10, passingScore: 80, isCompleted: false },
  { id: '2', title: 'Classroom Management', category: 'Soft Skill', duration: '10 mins', questions: 8, passingScore: 75, isCompleted: true, score: 92 },
  { id: '3', title: 'Modern Pedagogy', category: 'Methodology', duration: '20 mins', questions: 15, passingScore: 80, isCompleted: false },
];

export function AssessmentsListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Skill Assessments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionDesc}>
          Earn badges by passing these assessments. Badges are displayed on your profile and increase your AI Match Score for relevant jobs.
        </Text>

        {ASSESSMENTS.map(test => (
          <TouchableOpacity 
            key={test.id} 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(test.isCompleted ? 'AssessmentResult' : 'AssessmentIntro', { test })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.badgeIcon}>
                <Text style={{ fontSize: 24 }}>{test.isCompleted ? '🏆' : '📝'}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{test.title}</Text>
                <Text style={styles.cardSub}>{test.category} • {test.duration}</Text>
              </View>
            </View>

            {test.isCompleted ? (
              <View style={[styles.cardFooter, { backgroundColor: COLORS.successBg }]}>
                <Text style={[styles.footerText, { color: COLORS.successDark, fontWeight: '700' }]}>✓ Passed: {test.score}% Score</Text>
              </View>
            ) : (
              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>{test.questions} Questions • {test.passingScore}% to pass</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function AssessmentIntroScreen({ route, navigation }: any) {
  const { test } = route.params;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Test Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.content, { flex: 1 }]}>
        <View style={styles.introHero}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>📝</Text>
          <Text style={styles.introTitle}>{test.title}</Text>
          <Text style={styles.introSub}>{test.category}</Text>
        </View>

        <View style={styles.rulesBox}>
          <Text style={styles.rulesHeader}>Instructions</Text>
          <Text style={styles.ruleText}>• You have {test.duration} to complete this test.</Text>
          <Text style={styles.ruleText}>• There are {test.questions} multiple-choice questions.</Text>
          <Text style={styles.ruleText}>• You need {test.passingScore}% or higher to earn the badge.</Text>
          <Text style={styles.ruleText}>• Do not exit the app while taking the test.</Text>
        </View>

        <View style={{ flex: 1 }} />
        
        <TouchableOpacity 
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('AssessmentQuiz', { test })}
        >
          <Text style={styles.btnTextPrimary}>Start Assessment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AssessmentQuizScreen({ route, navigation }: any) {
  const { test } = route.params;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const MOCK_OPTIONS = [
    "Differentiated Instruction",
    "Rote Memorization",
    "Standardized Testing",
    "Passive Listening"
  ];

  const handleNext = () => {
    if (currentQ < test.questions - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      navigation.navigate('AssessmentResult', { test: { ...test, isCompleted: true, score: 95 } });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.quizHeader}>
        <Text style={styles.timer}>⏱️ 14:59</Text>
        <Text style={styles.progressText}>Question {currentQ + 1} of {test.questions}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AssessmentsList')}>
          <Text style={styles.quitText}>Quit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${((currentQ + 1) / test.questions) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.questionText}>
          Which of the following is considered the most effective method for addressing diverse learning paces in a single classroom?
        </Text>

        <View style={styles.optionsList}>
          {MOCK_OPTIONS.map((opt, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.optionCard, selected === index && styles.optionCardSelected]}
              onPress={() => setSelected(index)}
            >
              <View style={[styles.radio, selected === index && styles.radioSelected]}>
                {selected === index && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.optionText, selected === index && styles.optionTextSelected]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnPrimary, selected === null && styles.btnDisabled]}
          onPress={handleNext}
          disabled={selected === null}
        >
          <Text style={styles.btnTextPrimary}>{currentQ === test.questions - 1 ? 'Submit Test' : 'Next Question'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AssessmentResultScreen({ route, navigation }: any) {
  const { test } = route.params;

  return (
    <View style={styles.container}>
      <View style={[styles.content, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 80, marginBottom: 20 }}>🏆</Text>
        <Text style={styles.resultTitle}>Congratulations!</Text>
        <Text style={styles.resultSub}>You successfully passed the {test.title} assessment.</Text>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{test.score || 95}%</Text>
          <Text style={styles.scoreLabel}>Final Score</Text>
        </View>

        <Text style={styles.badgeText}>
          A verified badge has been added to your profile. This will boost your ranking in job searches.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('AssessmentsList')}
        >
          <Text style={styles.btnTextPrimary}>Back to Assessments</Text>
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
  back: { fontSize: 32, color: COLORS.text, width: 40, lineHeight: 32 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  
  content: { padding: SPACING.screen, paddingBottom: 40 },
  sectionDesc: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 22 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 16, overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 },
  badgeIcon: { width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardSub: { fontSize: 13, color: COLORS.textSecondary },
  cardFooter: { backgroundColor: COLORS.background, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  footerText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  introHero: { alignItems: 'center', marginVertical: 32 },
  introTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  introSub: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  rulesBox: { backgroundColor: COLORS.surface, padding: 20, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  rulesHeader: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  ruleText: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 10, lineHeight: 20 },

  btnPrimary: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.full, alignItems: 'center' },
  btnTextPrimary: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  btnDisabled: { opacity: 0.5 },

  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: COLORS.surface },
  timer: { fontSize: 15, fontWeight: '700', color: COLORS.error },
  progressText: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  quitText: { fontSize: 15, fontWeight: '600', color: COLORS.textMuted },
  progressBg: { height: 4, backgroundColor: COLORS.border },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },

  questionText: { fontSize: 18, fontWeight: '700', color: COLORS.text, lineHeight: 28, marginTop: 24, marginBottom: 32 },
  optionsList: { gap: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border },
  optionCardSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  optionText: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  optionTextSelected: { color: COLORS.primary, fontWeight: '700' },

  footer: { padding: SPACING.screen, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },

  resultTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  resultSub: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 20, marginBottom: 32 },
  scoreBox: { width: 140, height: 140, borderRadius: 70, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: COLORS.primary, marginBottom: 32 },
  scoreValue: { fontSize: 36, fontWeight: '800', color: COLORS.primary },
  scoreLabel: { fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },
  badgeText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
});
