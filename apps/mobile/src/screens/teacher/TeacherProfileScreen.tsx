import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

export function TeacherProfileScreen() {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View style={styles.avatar}><Text style={{fontSize: 40}}>👩‍🏫</Text></View>
          <Text style={styles.name}>Priya Sharma</Text>
          <Text style={styles.role}>Mathematics Teacher</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuText}>My Resume (AI Generated)</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Settings</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => dispatch(logout())}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, {color: COLORS.error}]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.screen, paddingTop: 56, backgroundColor: COLORS.primaryBg },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  scroll: { padding: SPACING.screen },
  hero: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: COLORS.primary },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  role: { fontSize: 15, color: COLORS.textSecondary },
  section: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { fontSize: 20, marginRight: 16 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  menuArrow: { fontSize: 24, color: COLORS.textMuted },
});
