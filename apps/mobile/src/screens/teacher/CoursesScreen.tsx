import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_COURSES = [
  {
    id: '1', title: 'Advanced Mathematics for Class 12', instructor: 'Dr. Ramesh Gupta',
    rating: 4.8, students: 1240, duration: '32 hrs', price: '₹999', category: 'Mathematics',
    badge: 'Bestseller', thumbnail: '📐',
  },
  {
    id: '2', title: 'Modern Pedagogy Certification', instructor: 'Prof. Sunita Mehta',
    rating: 4.9, students: 890, duration: '18 hrs', price: '₹1499', category: 'Pedagogy',
    badge: 'Hot', thumbnail: '📚',
  },
  {
    id: '3', title: 'Classroom Management Masterclass', instructor: 'Anita Sharma',
    rating: 4.7, students: 2100, duration: '12 hrs', price: '₹799', category: 'Management',
    badge: null, thumbnail: '🏫',
  },
  {
    id: '4', title: 'CBSE Science Curriculum 2025', instructor: 'Rajesh Kumar',
    rating: 4.6, students: 650, duration: '24 hrs', price: '₹1199', category: 'Science',
    badge: 'New', thumbnail: '🔬',
  },
];

const CATEGORIES = ['All', 'Mathematics', 'Science', 'Pedagogy', 'Management'];

const BADGE_COLORS: any = {
  Bestseller: { bg: '#FEF3C7', text: '#92400E' },
  Hot: { bg: '#FEE2E2', text: '#991B1B' },
  New: { bg: '#D1FAE5', text: '#065F46' },
};

function CourseCard({ course, onPress }: any) {
  const badge = course.badge ? BADGE_COLORS[course.badge] : null;
  return (
    <TouchableOpacity style={styles.courseCard} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.thumbnail}>
        <Text style={{ fontSize: 40 }}>{course.thumbnail}</Text>
        {badge && (
          <View style={[styles.badgeTag, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeTagText, { color: badge.text }]}>{course.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseCategory}>{course.category}</Text>
        <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.instructor}>by {course.instructor}</Text>
        <View style={styles.courseStats}>
          <Text style={styles.rating}>⭐ {course.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.stat}>{course.students.toLocaleString()} students</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.stat}>{course.duration}</Text>
        </View>
        <View style={styles.courseFooter}>
          <Text style={styles.price}>{course.price}</Text>
          <TouchableOpacity style={styles.enrollBtn} onPress={onPress}>
            <Text style={styles.enrollBtnText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function CoursesScreen({ navigation }: any) {
  const [category, setCategory] = useState('All');

  const filtered = MOCK_COURSES.filter(c =>
    category === 'All' || c.category === category
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.subtitle}>Level up your teaching skills</Text>
      </View>

      {/* AI Recommendation Banner */}
      <View style={styles.aiBanner}>
        <Text style={{ fontSize: 32, marginRight: 12 }}>🤖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>AI Recommended for You</Text>
          <Text style={styles.aiSub}>Based on your profile score & subjects</Text>
        </View>
        <Text style={{ fontSize: 16, color: '#FFF' }}>→</Text>
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={c => c}
        contentContainerStyle={styles.catList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, category === item && styles.catChipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.catText, category === item && styles.catTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CourseCard course={item} onPress={() => {}} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📚</Text>
            <Text style={styles.emptyTitle}>No courses in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.primaryBg,
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },

  aiBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.screen, marginTop: 16, marginBottom: 8,
    borderRadius: RADIUS.xl, padding: 16,
  },
  aiTitle: { fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  aiSub: { fontSize: 12, color: '#FFFFFF99' },

  catList: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  catTextActive: { color: '#FFF' },

  list: { padding: SPACING.screen, paddingTop: 0 },
  courseCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  thumbnail: {
    height: 140, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  badgeTag: {
    position: 'absolute', top: 12, right: 12,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  badgeTagText: { fontSize: 11, fontWeight: '700' },
  courseInfo: { padding: 16 },
  courseCategory: { fontSize: 12, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4, lineHeight: 22 },
  instructor: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  courseStats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  rating: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
  dot: { fontSize: 13, color: COLORS.textMuted },
  stat: { fontSize: 12, color: COLORS.textMuted },
  courseFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  enrollBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: RADIUS.lg },
  enrollBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
});
