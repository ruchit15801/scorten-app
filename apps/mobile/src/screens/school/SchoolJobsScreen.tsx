import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

export function SchoolJobsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}></Text>
        <View />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.placeholder}>
          SchoolJobsScreen — implement UI based on Figma design
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { fontSize: 24, color: COLORS.text, width: 40 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content: { padding: 20, alignItems: 'center', paddingTop: 60 },
  placeholder: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center' },
});
