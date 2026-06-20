import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function ResumePreviewScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preview</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rendered PDF-style preview area */}
        <View style={styles.pdfArea}>
          <View style={styles.pdfHeader}>
            <Text style={styles.pdfName}>PRIYA SHARMA</Text>
            <Text style={styles.pdfRole}>Mathematics Teacher</Text>
            <Text style={styles.pdfContact}>Ahmedabad, Gujarat | +91 9876543210</Text>
          </View>
          
          <View style={styles.pdfSection}>
            <Text style={styles.pdfTitle}>SUMMARY</Text>
            <View style={styles.pdfLine} />
            <Text style={styles.pdfText}>Passionate mathematics educator with 5+ years of experience...</Text>
          </View>

          <View style={styles.pdfSection}>
            <Text style={styles.pdfTitle}>EXPERIENCE</Text>
            <View style={styles.pdfLine} />
            <Text style={styles.pdfItemTitle}>Senior Math Teacher</Text>
            <Text style={styles.pdfItemSub}>Delhi Public School | 2020 - Present</Text>
          </View>

          <View style={styles.pdfSection}>
            <Text style={styles.pdfTitle}>EDUCATION</Text>
            <View style={styles.pdfLine} />
            <Text style={styles.pdfItemTitle}>B.Ed in Mathematics</Text>
            <Text style={styles.pdfItemSub}>Gujarat University | 2018</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => {}}>
            <Text style={styles.btnTextPrimary}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => {}}>
            <Text style={styles.btnTextSecondary}>Set as Default for Applications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  
  content: { padding: SPACING.screen, paddingBottom: 60 },
  
  pdfArea: {
    backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, marginBottom: 24,
    minHeight: 450,
  },
  pdfHeader: { alignItems: 'center', marginBottom: 24 },
  pdfName: { fontSize: 22, fontWeight: '800', color: '#111', textTransform: 'uppercase' },
  pdfRole: { fontSize: 14, color: '#444', marginBottom: 8, marginTop: 4 },
  pdfContact: { fontSize: 11, color: '#666' },

  pdfSection: { marginBottom: 16 },
  pdfTitle: { fontSize: 13, fontWeight: '700', color: '#111', letterSpacing: 1 },
  pdfLine: { height: 1, backgroundColor: '#DDD', marginVertical: 6 },
  pdfText: { fontSize: 12, color: '#333', lineHeight: 18 },
  
  pdfItemTitle: { fontSize: 13, fontWeight: '700', color: '#111' },
  pdfItemSub: { fontSize: 12, color: '#555', marginTop: 2 },

  actions: { gap: 12 },
  btnPrimary: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.full, alignItems: 'center' },
  btnTextPrimary: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  btnSecondary: { backgroundColor: COLORS.primaryBg, paddingVertical: 16, borderRadius: RADIUS.full, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '30' },
  btnTextSecondary: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
});
