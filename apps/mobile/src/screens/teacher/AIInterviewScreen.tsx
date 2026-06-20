import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

type Phase = 'intro' | 'recording' | 'done';

const QUESTIONS = [
  'Tell me about your teaching experience and methodology.',
  'How do you handle a student who is struggling with the subject?',
  'Describe a challenging classroom situation and how you resolved it.',
  'How do you incorporate modern technology in your lessons?',
  'What strategies do you use to keep students engaged?',
];

export function AIInterviewScreen({ navigation, route }: any) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [qIdx, setQIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const startRecording = () => setRecording(true);
  const stopAndNext = () => {
    setRecording(false);
    const newAns = [...answers, true];
    setAnswers(newAns);
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      setAnalyzing(true);
      setTimeout(() => { setAnalyzing(false); setPhase('done'); }, 2500);
    }
  };

  if (phase === 'intro') {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Interview</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.introBody} showsVerticalScrollIndicator={false}>
          <View style={styles.introHero}>
            <View style={styles.aiCircle}>
              <Icon name="mic" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.introTitle}>AI-Powered Interview</Text>
            <Text style={styles.introSub}>Answer {QUESTIONS.length} video questions at your own pace. Our AI evaluates your responses instantly.</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What to Expect</Text>
            {[
              { icon: 'time-outline',        text: 'About 10–15 minutes total' },
              { icon: 'mic-outline',          text: `${QUESTIONS.length} recorded video questions` },
              { icon: 'sparkles',             text: 'AI scores: communication, confidence, knowledge' },
              { icon: 'eye-outline',          text: 'School reviews your recordings' },
              { icon: 'checkmark-circle',     text: 'Results within 24 hours' },
            ].map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <Icon name={item.icon} size={18} color={COLORS.primary} />
                <Text style={styles.infoText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
            {['Find a quiet, well-lit space', 'Speak clearly and confidently', 'Look directly at the camera', 'Take a breath before each answer'].map((t, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{t}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={() => setPhase('recording')}>
            <Icon name="play-circle" size={22} color="#FFF" />
            <Text style={styles.startBtnText}> Start Interview</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (analyzing) {
    return (
      <View style={[styles.root, styles.centerFlex]}>
        <StatusBar hidden />
        <View style={styles.analyzingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.analyzingTitle}>AI is analyzing your responses...</Text>
          <Text style={styles.analyzingSub}>Scoring communication, confidence & subject knowledge</Text>
        </View>
      </View>
    );
  }

  if (phase === 'done') {
    return (
      <View style={[styles.root, styles.centerFlex]}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={styles.doneCard}>
          <Icon name="checkmark-circle" size={72} color={COLORS.success} />
          <Text style={styles.doneTitle}>Interview Complete!</Text>
          <Text style={styles.doneSub}>Your responses have been analyzed and sent to the school's hiring team.</Text>
          <View style={styles.doneScoreRow}>
            {[
              { label: 'Communication', val: '88' },
              { label: 'Confidence', val: '82' },
              { label: 'Knowledge', val: '91' },
            ].map(s => (
              <View key={s.label} style={styles.doneScore}>
                <Text style={styles.doneScoreVal}>{s.val}</Text>
                <Text style={styles.doneScoreLbl}>{s.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Recording phase
  const progress = (qIdx / QUESTIONS.length) * 100;
  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>

      {/* Quiz header */}
      <View style={styles.quizHeader}>
        <TouchableOpacity onPress={() => Alert.alert('Quit?', 'Your progress will be lost.', [{ text: 'Cancel' }, { text: 'Quit', onPress: () => navigation.goBack() }])}>
          <Text style={styles.quitText}>Quit</Text>
        </TouchableOpacity>
        <Text style={styles.qCounter}>Question {qIdx + 1} of {QUESTIONS.length}</Text>
        <View style={styles.dotRow}>
          {QUESTIONS.map((_, i) => (
            <View key={i} style={[styles.dot, i <= qIdx && styles.dotActive, i < qIdx && styles.dotDone]} />
          ))}
        </View>
      </View>

      {/* Camera placeholder */}
      <View style={styles.camera}>
        <Icon name="videocam" size={60} color="rgba(255,255,255,0.3)" />
        {recording && (
          <View style={styles.recIndicator}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
        )}
      </View>

      {/* Question */}
      <View style={styles.questionBox}>
        <Text style={styles.questionLabel}>QUESTION {qIdx + 1}</Text>
        <Text style={styles.questionText}>{QUESTIONS[qIdx]}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!recording ? (
          <TouchableOpacity style={styles.recordBtn} onPress={startRecording}>
            <Icon name="mic" size={28} color="#FFF" />
            <Text style={styles.recordBtnText}>Tap to Record Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stopAndNext}>
            <Icon name="checkmark" size={28} color="#FFF" />
            <Text style={styles.stopBtnText}>{qIdx < QUESTIONS.length - 1 ? 'Save & Next' : 'Finish Interview'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  centerFlex: { justifyContent: 'center', alignItems: 'center', padding: SPACING.screen },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#FFF', marginRight: 40 },

  introBody: { padding: SPACING.screen, paddingBottom: 40 },
  introHero: { alignItems: 'center', marginBottom: 24, paddingTop: 16 },
  aiCircle: {
    width: 100, height: 100, borderRadius: 30, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    borderWidth: 2, borderColor: COLORS.primary + '30',
  },
  introTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 10, textAlign: 'center' },
  introSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },

  infoCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  infoTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },

  tipsCard: {
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.xl, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  tipsTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginBottom: 10 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  tipBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  tipText: { fontSize: 13, color: COLORS.primaryDark, lineHeight: 18 },

  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  startBtnText: { fontSize: 18, fontWeight: '800', color: '#FFF' },

  progressTrack: { height: 4, backgroundColor: COLORS.backgroundAlt },
  progressFill: { height: 4, backgroundColor: COLORS.primary },

  quizHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 14, backgroundColor: COLORS.surface,
  },
  quitText: { fontSize: 15, fontWeight: '600', color: COLORS.error },
  qCounter: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  dotRow: { flexDirection: 'row', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.primary },
  dotDone: { backgroundColor: COLORS.success },

  camera: {
    flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', margin: 16, borderRadius: RADIUS.xl,
    position: 'relative',
  },
  recIndicator: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 6 },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF4444' },
  recText: { fontSize: 12, fontWeight: '800', color: '#FFF' },

  questionBox: { padding: SPACING.screen },
  questionLabel: { fontSize: 11, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  questionText: { fontSize: 17, fontWeight: '700', color: COLORS.text, lineHeight: 26 },

  controls: { padding: SPACING.screen, paddingBottom: 32 },
  recordBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 18,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
  },
  recordBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  stopBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.success, borderRadius: RADIUS.xl, paddingVertical: 18,
    shadowColor: COLORS.success, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  stopBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },

  analyzingBox: { alignItems: 'center', gap: 16 },
  analyzingTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  analyzingSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' },

  doneCard: { alignItems: 'center', gap: 16, width: '100%' },
  doneTitle: { fontSize: 26, fontWeight: '900', color: COLORS.text },
  doneSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  doneScoreRow: {
    flexDirection: 'row', gap: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: 20, borderWidth: 1, borderColor: COLORS.border, width: '100%',
  },
  doneScore: { flex: 1, alignItems: 'center' },
  doneScoreVal: { fontSize: 24, fontWeight: '900', color: COLORS.primary, marginBottom: 4 },
  doneScoreLbl: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },
  doneBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 16, paddingHorizontal: 60,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  doneBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
