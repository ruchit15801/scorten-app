import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Animated, Dimensions, ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const QUESTIONS = [
  "Hello! I'm your AI interviewer from Scorten. Can you start by telling me about your teaching methodology for Mathematics?",
  "How do you handle a student who is consistently struggling to understand a concept despite multiple explanations?",
  "Describe a time you had to adapt your lesson plan on the fly. What happened and how did you manage it?",
  "What classroom management strategies do you use to maintain engagement in a 45-minute class?",
  "Why do you want to join Delhi Public School specifically? What makes you a great fit?",
];

export function AIInterviewScreen({ navigation }: any) {
  const [phase, setPhase] = useState<'intro' | 'interview' | 'done'>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timer, setTimer] = useState(90);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setTimer(90);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { stopRecording(); return 90; }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    setAnswers(prev => [...prev, qIndex]);
  };

  const nextQuestion = () => {
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(q => q + 1);
    } else {
      setPhase('done');
    }
  };

  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.introScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <Animated.View style={[styles.aiOrb, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={{ fontSize: 48 }}>🤖</Text>
            </Animated.View>
            <Text style={styles.introTitle}>AI Interview</Text>
            <Text style={styles.introSub}>Delhi Public School - Math Teacher</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Before You Begin</Text>
            {[
              { icon: '🎙️', text: '5 interview questions, ~2 min each' },
              { icon: '🌐', text: 'Speak clearly in English or Hindi' },
              { icon: '📵', text: 'Find a quiet place with good lighting' },
              { icon: '🤖', text: 'AI analyses tone, content & confidence' },
              { icon: '📊', text: 'Results shared with school within 24 hrs' },
            ].map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                <Text style={styles.infoText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={() => setPhase('interview')}>
            <Text style={styles.startBtnText}>Start Interview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Not Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'done') {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={styles.doneContent}>
          <Text style={{ fontSize: 64, marginBottom: 20 }}>🎉</Text>
          <Text style={styles.doneTitle}>Interview Completed!</Text>
          <Text style={styles.doneSub}>
            Your responses have been submitted. The school will review your AI interview results within 24 hours.
          </Text>

          <View style={styles.doneStats}>
            {[
              { label: 'Questions', value: `${QUESTIONS.length}/${QUESTIONS.length}` },
              { label: 'Avg. Time', value: '1:45 min' },
              { label: 'AI Score', value: 'Pending' },
            ].map(stat => (
              <View key={stat.label} style={styles.doneStat}>
                <Text style={styles.doneStatValue}>{stat.value}</Text>
                <Text style={styles.doneStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Back to Applications</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setPhase('intro')}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Q{qIndex + 1} of {QUESTIONS.length}</Text>
        </View>
        {isRecording && (
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>{timer}s</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.interviewScroll} showsVerticalScrollIndicator={false}>
        {/* AI Orb */}
        <View style={styles.orbArea}>
          <Animated.View style={[styles.aiOrb, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={{ fontSize: 52 }}>🤖</Text>
          </Animated.View>
          <Text style={styles.aiLabel}>AI Interviewer</Text>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>Question {qIndex + 1}</Text>
          <Text style={styles.questionText}>{QUESTIONS[qIndex]}</Text>
        </View>

        {/* Recording UI */}
        <View style={styles.recordSection}>
          {isRecording ? (
            <View style={styles.recordingState}>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording... {timer}s remaining</Text>
              </View>
              <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
                <Text style={{ fontSize: 24 }}>⏹️</Text>
                <Text style={styles.stopBtnText}>Stop Recording</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.readyState}>
              {answers.includes(qIndex) ? (
                <>
                  <View style={styles.answeredBadge}>
                    <Text style={styles.answeredText}>✓ Answer recorded</Text>
                  </View>
                  <TouchableOpacity style={styles.rerecordBtn} onPress={startRecording}>
                    <Text style={styles.rerecordText}>Re-record</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.readyText}>Tap the mic to start answering</Text>
                  <TouchableOpacity style={styles.micBtn} onPress={startRecording}>
                    <Text style={{ fontSize: 40 }}>🎙️</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, !answers.includes(qIndex) && styles.nextBtnOff]}
          onPress={nextQuestion}
          disabled={!answers.includes(qIndex)}
        >
          <Text style={styles.nextBtnText}>
            {qIndex < QUESTIONS.length - 1 ? 'Next Question →' : 'Finish Interview'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Intro styles
  introScroll: { padding: SPACING.screen, paddingTop: 56 },
  introHeader: { alignItems: 'center', marginBottom: 32 },
  aiOrb: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
  },
  introTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  introSub: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },

  infoCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 24,
  },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 14, color: COLORS.textSecondary, flex: 1 },

  startBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, alignItems: 'center', marginBottom: 12,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  startBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },

  // Interview styles
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.screen, paddingTop: 52, paddingBottom: 12,
    backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    gap: 12,
  },
  backArrow: { fontSize: 32, color: COLORS.text, width: 40 },
  progressWrap: { flex: 1 },
  progressBg: { height: 6, backgroundColor: COLORS.backgroundAlt, borderRadius: 3, marginBottom: 4 },
  progressFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  timerBadge: { backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full },
  timerText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  interviewScroll: { padding: SPACING.screen },
  orbArea: { alignItems: 'center', marginVertical: 24 },
  aiLabel: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginTop: 12 },

  questionCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  questionLabel: { fontSize: 12, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  questionText: { fontSize: 17, color: COLORS.text, lineHeight: 26, fontWeight: '500' },

  recordSection: { marginBottom: 24, alignItems: 'center' },
  readyState: { alignItems: 'center', gap: 16 },
  readyText: { fontSize: 15, color: COLORS.textSecondary },
  micBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.primary,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  recordingState: { alignItems: 'center', gap: 16 },
  recordingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.error },
  recordingText: { fontSize: 15, color: COLORS.error, fontWeight: '600' },
  stopBtn: {
    alignItems: 'center', backgroundColor: COLORS.errorBg, borderRadius: RADIUS.xl,
    paddingHorizontal: 28, paddingVertical: 14, gap: 4,
    borderWidth: 1, borderColor: COLORS.borderError + '40',
  },
  stopBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.error },
  answeredBadge: { backgroundColor: COLORS.successBg, borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 8 },
  answeredText: { fontSize: 14, color: COLORS.successDark, fontWeight: '700' },
  rerecordBtn: { paddingVertical: 8 },
  rerecordText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },

  nextBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  nextBtnOff: { backgroundColor: COLORS.primaryBg, shadowOpacity: 0, elevation: 0 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },

  // Done styles
  doneContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.screen },
  doneTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', textAlign: 'center', marginBottom: 16 },
  doneSub: { fontSize: 15, color: '#FFFFFFCC', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  doneStats: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  doneStat: { alignItems: 'center', backgroundColor: '#FFFFFF20', borderRadius: RADIUS.lg, padding: 16, flex: 1 },
  doneStatValue: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  doneStatLabel: { fontSize: 12, color: '#FFFFFFAA', fontWeight: '600' },
  doneBtn: {
    backgroundColor: '#FFF', borderRadius: RADIUS.xl, paddingVertical: 16, paddingHorizontal: 32, alignItems: 'center',
  },
  doneBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
});
