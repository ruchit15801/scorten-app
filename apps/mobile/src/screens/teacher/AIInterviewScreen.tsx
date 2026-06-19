import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, RADIUS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const QUESTIONS = [
  "Hello Priya. Can you tell me about your teaching methodology for Mathematics?",
  "How do you handle a student who is constantly disrupting the class?",
  "Describe a time you adapted your lesson plan for a struggling student.",
];

export function AIInterviewScreen({ navigation }: any) {
  const [qIndex, setQIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micActive, setMicActive] = useState(true);
  
  // Animations
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation for AI talking
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Auto-advance questions for demo
    const timer = setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) setQIndex(qIndex + 1);
    }, 8000);
    return () => clearTimeout(timer);
  }, [qIndex]);

  const handleEnd = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ─── AI Video Area (Top) ────────────────────────────────────────── */}
      <View style={styles.aiVideoArea}>
        <LinearGradient colors={['#1E1B4B', '#312E81']} style={StyleSheet.absoluteFillObject} />
        
        {/* Glowing AI Avatar */}
        <Animated.View style={[styles.aiAvatarRing, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.aiAvatar}>
            <Text style={{ fontSize: 60 }}>🤖</Text>
          </View>
        </Animated.View>

        <View style={styles.aiLabel}>
          <Text style={styles.aiLabelText}>Scorten AI • Interviewer</Text>
        </View>

        {/* Live Transcriptions (Subtitle) */}
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitleText}>"{QUESTIONS[qIndex]}"</Text>
        </View>
      </View>

      {/* ─── User Camera Area (Bottom Right) ────────────────────────────── */}
      <View style={styles.userCameraArea}>
        <Text style={{ fontSize: 40 }}>👩‍🏫</Text>
        <View style={styles.userLabel}>
          <Text style={styles.userLabelText}>You</Text>
        </View>
      </View>

      {/* ─── Controls (Bottom) ──────────────────────────────────────────── */}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.controlsArea}>
        
        <View style={styles.statusRow}>
          <View style={styles.recordingDot} />
          <Text style={styles.statusText}>Recording & Analyzing...</Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity 
            style={[styles.controlBtn, !micActive && styles.controlBtnOff]}
            onPress={() => setMicActive(!micActive)}
          >
            <Text style={styles.btnIcon}>{micActive ? '🎙️' : '🔇'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.endBtn} onPress={handleEnd}>
            <Text style={styles.btnIcon}>✖️</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn}>
            <Text style={styles.btnIcon}>📹</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  
  aiVideoArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  aiAvatarRing: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: COLORS.primary + '30',
    alignItems: 'center', justifyContent: 'center',
  },
  aiAvatar: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: COLORS.primary,
  },
  aiLabel: {
    position: 'absolute', top: 40, left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  aiLabelText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  
  subtitleBox: {
    position: 'absolute', bottom: 40, left: 20, right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 16, borderRadius: RADIUS.lg,
  },
  subtitleText: { color: '#FFF', fontSize: 16, textAlign: 'center', lineHeight: 24 },

  userCameraArea: {
    position: 'absolute', bottom: 180, right: 20,
    width: 110, height: 150, borderRadius: RADIUS.xl,
    backgroundColor: '#374151', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.primary,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  userLabel: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
  },
  userLabelText: { color: '#FFF', fontSize: 10, fontWeight: '700' },

  controlsArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 160, paddingHorizontal: 30, paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 },
  recordingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.error },
  statusText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  controlBtnOff: { backgroundColor: 'rgba(255,255,255,0.4)' },
  endBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center',
  },
  btnIcon: { fontSize: 24 },
});
