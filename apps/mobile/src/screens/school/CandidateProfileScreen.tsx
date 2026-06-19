import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function CandidateProfileScreen({ navigation, route }: any) {
  // Use mock data if no params passed
  const candidate = route.params?.candidate || {
    name: 'Priya Sharma', role: 'Senior Mathematics Teacher',
    experience: '5 Years', education: 'M.Sc. Mathematics, B.Ed',
    score: 94, location: 'New Delhi',
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backCircle}><Text style={styles.backArrow}>‹</Text></View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidate Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}><Text style={{ fontSize: 40 }}>👩‍🏫</Text></View>
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.role}>{candidate.role}</Text>
          <Text style={styles.location}>📍 {candidate.location} • {candidate.experience}</Text>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtnPrimary}>
              <Text style={styles.actionBtnTextPri}>💬 Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnSecondary}>
              <Text style={styles.actionBtnTextSec}>📄 Resume</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Score Banner */}
        <LinearGradient colors={[COLORS.successBg, '#D1FAE5']} style={styles.scoreBanner}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{candidate.score}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scoreTitle}>Scorten Excellent Match</Text>
            <Text style={styles.scoreSub}>
              Based on AI analysis, Priya is in the top 5% of candidates for Mathematics.
            </Text>
          </View>
        </LinearGradient>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🎓</Text>
            <View>
              <Text style={styles.detailLabel}>Education</Text>
              <Text style={styles.detailValue}>{candidate.education}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📚</Text>
            <View>
              <Text style={styles.detailLabel}>Boards</Text>
              <Text style={styles.detailValue}>CBSE, ICSE</Text>
            </View>
          </View>
        </View>

        {/* AI Interview Evaluation */}
        <View style={styles.section}>
          <View style={styles.aiHeaderRow}>
            <Text style={styles.sectionTitle}>AI Interview Evaluation</Text>
            <Text style={styles.badgeSuccess}>Completed</Text>
          </View>
          <View style={styles.aiCard}>
            <Text style={styles.aiQuestion}>Q: How do you handle a disruptive student in class?</Text>
            <View style={styles.aiAnswerBox}>
              <Text style={styles.aiAnswerText}>
                "I believe in addressing the root cause. First, I try non-verbal cues. If it persists, I speak with the student privately after class rather than humiliating them publicly, aiming to understand their perspective."
              </Text>
            </View>
            <View style={styles.aiEvalBox}>
              <Text style={styles.aiEvalTitle}>🤖 AI Feedback</Text>
              <Text style={styles.aiEvalText}>
                Excellent emotional intelligence. The candidate prioritizes empathy and private resolution over public confrontation, aligning perfectly with modern pedagogical standards.
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.rejectBtn}>
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortlistBtn}>
          <Text style={styles.shortlistBtnText}>Shortlist for Interview</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: {},
  backCircle: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { fontSize: 26, color: COLORS.text, lineHeight: 30 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  scroll: { paddingBottom: 100 },

  heroCard: {
    backgroundColor: COLORS.surface, alignItems: 'center',
    padding: SPACING.screen, borderBottomLeftRadius: RADIUS['2xl'], borderBottomRightRadius: RADIUS['2xl'],
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
    marginBottom: 20,
  },
  avatar: { width: 80, height: 80, borderRadius: 24, backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  role: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 6 },
  location: { fontSize: 13, color: COLORS.textMuted, marginBottom: 20 },
  
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtnPrimary: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: RADIUS.lg, alignItems: 'center' },
  actionBtnTextPri: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  actionBtnSecondary: { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 12, borderRadius: RADIUS.lg, alignItems: 'center' },
  actionBtnTextSec: { color: COLORS.text, fontWeight: '700', fontSize: 14 },

  scoreBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginHorizontal: SPACING.screen, padding: 16, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.success + '40', marginBottom: 24,
  },
  scoreCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scoreText: { fontSize: 22, fontWeight: '800', color: COLORS.successDark },
  scoreTitle: { fontSize: 15, fontWeight: '700', color: COLORS.successDark, marginBottom: 4 },
  scoreSub: { fontSize: 12, color: COLORS.successDark, opacity: 0.8, lineHeight: 16 },

  section: { paddingHorizontal: SPACING.screen, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  detailIcon: { fontSize: 24, width: 40, textAlign: 'center' },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 15, fontWeight: '600', color: COLORS.text },

  aiHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badgeSuccess: { backgroundColor: COLORS.successBg, color: COLORS.successDark, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, fontSize: 12, fontWeight: '700' },
  
  aiCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  aiQuestion: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 12, lineHeight: 22 },
  aiAnswerBox: { backgroundColor: COLORS.backgroundAlt, padding: 12, borderRadius: RADIUS.lg, marginBottom: 12 },
  aiAnswerText: { fontSize: 14, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 22 },
  aiEvalBox: { backgroundColor: COLORS.primaryBg, padding: 12, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.primary + '30' },
  aiEvalTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  aiEvalText: { fontSize: 13, color: COLORS.primaryDark, lineHeight: 20 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, flexDirection: 'row', gap: 12,
    paddingHorizontal: SPACING.screen, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  rejectBtn: { flex: 1, backgroundColor: COLORS.errorBg, paddingVertical: 16, borderRadius: RADIUS.xl, alignItems: 'center' },
  rejectBtnText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
  shortlistBtn: { flex: 2, backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.xl, alignItems: 'center' },
  shortlistBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
