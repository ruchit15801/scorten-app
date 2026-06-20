import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Share,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useMyTeacherProfile } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function ResumePreviewScreen({ navigation, route }: any) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: profile } = useMyTeacherProfile();
  const templateId = route.params?.templateId || '1';

  const name = `${user?.firstName || 'Priya'} ${user?.lastName || 'Sharma'}`;
  const subjects = profile?.subjects?.join(', ') || 'Mathematics';
  const city = profile?.city || 'New Delhi';
  const exp = profile?.experienceYears || 5;
  const bio = profile?.bio || 'Passionate and dedicated Mathematics teacher with 5+ years of experience in CBSE curriculum. Committed to student success through innovative teaching methods.';

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out my teaching resume on Scorten!\n${name} · ${subjects} · ${city}` });
    } catch {}
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Action Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resume Preview</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Icon name="share-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadBtn} onPress={() => Alert.alert('Download', 'PDF export coming soon!')}>
            <Icon name="document-text" size={14} color={COLORS.primary} />
            <Text style={styles.downloadText}> PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resume Paper */}
        <View style={styles.paper}>

          {/* Resume Header */}
          <View style={styles.resumeHeader}>
            <View style={styles.resumeAvatar}>
              <Icon name="person" size={40} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resumeName}>{name}</Text>
              <Text style={styles.resumeRole}>{subjects} Teacher</Text>
              <View style={styles.resumeContactRow}>
                <Icon name="location-outline" size={12} color="#FFFFFFCC" />
                <Text style={styles.resumeContact}> {city}</Text>
                <Text style={styles.resumeContactDot}>  ·  </Text>
                <Icon name="mail-outline" size={12} color="#FFFFFFCC" />
                <Text style={styles.resumeContact}> {user?.email || 'teacher@email.com'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.resumeBody}>

            {/* Summary */}
            <View style={styles.resumeSection}>
              <View style={styles.sectionHead}>
                <Text style={styles.secTitle}>PROFESSIONAL SUMMARY</Text>
                <View style={styles.secLine} />
              </View>
              <Text style={styles.secBody}>{bio}</Text>
            </View>

            {/* Experience */}
            <View style={styles.resumeSection}>
              <View style={styles.sectionHead}>
                <Text style={styles.secTitle}>TEACHING EXPERIENCE</Text>
                <View style={styles.secLine} />
              </View>
              {[
                { school: 'Delhi Public School', role: `${subjects} Teacher`, period: '2021 – Present', points: [`Taught ${subjects} to Classes 9–12`, 'Improved avg scores by 22%', 'Mentored 120+ students'] },
                { school: 'St. Xavier\'s School', role: `${subjects} Teacher`, period: '2019 – 2021', points: ['Designed lesson plans for CBSE curriculum', 'Conducted parent-teacher meetings'] },
              ].map((e, i) => (
                <View key={i} style={styles.expItem}>
                  <View style={styles.expHeader}>
                    <View>
                      <Text style={styles.expRole}>{e.role}</Text>
                      <Text style={styles.expSchool}>{e.school}</Text>
                    </View>
                    <Text style={styles.expPeriod}>{e.period}</Text>
                  </View>
                  {e.points.map((p, j) => (
                    <View key={j} style={styles.expPoint}>
                      <View style={styles.expBullet} />
                      <Text style={styles.expPointText}>{p}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            {/* Education */}
            <View style={styles.resumeSection}>
              <View style={styles.sectionHead}>
                <Text style={styles.secTitle}>EDUCATION</Text>
                <View style={styles.secLine} />
              </View>
              {[
                { degree: 'M.Sc. Mathematics', inst: 'Delhi University', year: '2019' },
                { degree: 'B.Ed. – Education', inst: 'IGNOU', year: '2020' },
              ].map((e, i) => (
                <View key={i} style={styles.eduRow}>
                  <View style={styles.eduDot} />
                  <View>
                    <Text style={styles.eduDegree}>{e.degree}</Text>
                    <Text style={styles.eduInst}>{e.inst} · {e.year}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Skills */}
            <View style={styles.resumeSection}>
              <View style={styles.sectionHead}>
                <Text style={styles.secTitle}>SKILLS & COMPETENCIES</Text>
                <View style={styles.secLine} />
              </View>
              <View style={styles.skillsGrid}>
                {['Curriculum Design', 'Classroom Management', 'Assessment Design', 'Parent Communication', 'EdTech Tools', 'Mentoring'].map(skill => (
                  <View key={skill} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Score */}
            <View style={styles.scoreSection}>
              <Icon name="sparkles" size={16} color={COLORS.primary} />
              <Text style={styles.scoreText}> Scorten AI Score: <Text style={{ fontWeight: '900', color: COLORS.primary }}>87/100</Text>  ·  Verified Teacher Profile</Text>
            </View>

          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E8E6F0' },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  actionBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
  },
  downloadText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  paper: {
    backgroundColor: '#FFF', margin: 16, borderRadius: RADIUS.xl, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
  },

  resumeHeader: {
    backgroundColor: COLORS.primary, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  resumeAvatar: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFFFFF25',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFFFFF60',
  },
  resumeName: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 3 },
  resumeRole: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600', marginBottom: 6 },
  resumeContactRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  resumeContact: { fontSize: 11, color: '#FFFFFFAA' },
  resumeContactDot: { color: '#FFFFFFAA', fontSize: 11 },

  resumeBody: { padding: 20 },
  resumeSection: { marginBottom: 20 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  secTitle: { fontSize: 11, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.2 },
  secLine: { flex: 1, height: 1.5, backgroundColor: COLORS.primary + '30' },
  secBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 21 },

  expItem: { marginBottom: 14 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  expRole: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  expSchool: { fontSize: 12, color: COLORS.textSecondary },
  expPeriod: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  expPoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  expBullet: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.primary, marginTop: 6 },
  expPointText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 19 },

  eduRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  eduDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 5 },
  eduDegree: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  eduInst: { fontSize: 12, color: COLORS.textSecondary },

  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.primary + '30' },
  skillText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },

  scoreSection: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.lg, padding: 12,
    borderWidth: 1, borderColor: COLORS.primary + '20',
  },
  scoreText: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
});
