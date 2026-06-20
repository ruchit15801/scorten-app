import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { useCourses, useMyEnrollments } from '../../hooks/useQueries';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const CATS = ['All', 'Teaching Methods', 'Technology', 'Assessment', 'Leadership'];

const MOCK_COURSES = [
  { _id: '1', title: 'Modern Classroom Management', category: 'Teaching Methods', instructor: 'Dr. Ramesh Kumar', duration: '6 hrs', lessons: 24, rating: 4.8, enrolled: 1240, isFree: false, price: 499, isBestseller: true },
  { _id: '2', title: 'Using AI Tools in Education', category: 'Technology', instructor: 'Priya Mehta', duration: '4 hrs', lessons: 18, rating: 4.9, enrolled: 2100, isFree: true, price: 0, isBestseller: false },
  { _id: '3', title: 'Effective Assessment Design', category: 'Assessment', instructor: 'Prof. S. Sharma', duration: '3 hrs', lessons: 12, rating: 4.6, enrolled: 780, isFree: false, price: 299, isBestseller: false },
  { _id: '4', title: 'School Leadership & Communication', category: 'Leadership', instructor: 'Anita Desai', duration: '5 hrs', lessons: 20, rating: 4.7, enrolled: 890, isFree: false, price: 599, isBestseller: true },
];

const PROGRESS = [
  { id: '1', title: 'Modern Classroom Management', progress: 65, lessons: 24 },
];

function CourseCard({ course, onPress, isEnrolled }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.87}>
      <View style={styles.cardThumb}>
        <Icon name="book" size={36} color={COLORS.primary} />
        {course.isBestseller && (
          <View style={styles.bestsellerTag}>
            <Icon name="trophy" size={10} color="#92400E" />
            <Text style={styles.bestsellerText}> Bestseller</Text>
          </View>
        )}
        {course.isFree && (
          <View style={styles.freeTag}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.courseInstructor}>{course.instructor}</Text>
        <View style={styles.courseMeta}>
          <Icon name="time-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}> {course.duration}  ·  {course.lessons} lessons</Text>
        </View>
        <View style={styles.courseFooter}>
          <View style={styles.ratingRow}>
            <Icon name="star" size={13} color="#F59E0B" />
            <Text style={styles.rating}> {course.rating}</Text>
            <Text style={styles.enrolled}> ({course.enrolled.toLocaleString()})</Text>
          </View>
          {isEnrolled
            ? <View style={styles.enrolledTag}><Text style={styles.enrolledText}>Enrolled</Text></View>
            : <Text style={styles.price}>{course.isFree ? 'Free' : `₹${course.price}`}</Text>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function CoursesScreen({ navigation }: any) {
  const [cat, setCat] = useState('All');
  const { data: apiCourses } = useCourses({ category: cat !== 'All' ? cat : undefined });
  const { data: enrollments } = useMyEnrollments();

  const courses = apiCourses?.length ? apiCourses : MOCK_COURSES;
  const filtered = courses.filter((c: any) => cat === 'All' || c.category === cat);
  const enrolledIds = new Set((enrollments || []).map((e: any) => e.courseId));

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Courses</Text>
          <Text style={styles.headerSub}>Upskill & grow your career</Text>
        </View>
      </View>

      {/* In Progress */}
      {PROGRESS.length > 0 && (
        <View style={styles.inProgressSection}>
          <Text style={styles.sectionLabel}>Continue Learning</Text>
          {PROGRESS.map(p => (
            <TouchableOpacity key={p.id} style={styles.progressCard} activeOpacity={0.85}>
              <View style={styles.progressIcon}>
                <Icon name="play-circle" size={24} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.progressTitle} numberOfLines={1}>{p.title}</Text>
                <Text style={styles.progressMeta}>{p.progress}% complete · {Math.round(p.lessons * p.progress / 100)}/{p.lessons} lessons</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${p.progress}%` as any }]} />
                </View>
              </View>
              <Icon name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category chips */}
      <FlatList
        data={CATS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={x => x}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, cat === item && styles.chipOn]}
            onPress={() => setCat(item)}
          >
            <Text style={[styles.chipText, cat === item && styles.chipTextOn]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(c: any) => c._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        renderItem={({ item }: any) => (
          <CourseCard
            course={item}
            isEnrolled={enrolledIds.has(item._id)}
            onPress={() => Alert.alert(item.title, `By ${item.instructor}\n${item.duration} · ${item.lessons} lessons\n${item.isFree ? 'Free' : `₹${item.price}`}`, [
              { text: 'Cancel', style: 'cancel' },
              { text: item.isFree ? 'Enroll Free' : `Enroll ₹${item.price}`, onPress: () => Alert.alert('Enrolled!', 'Check My Courses in your profile.') },
            ])}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="book-outline" size={52} color={COLORS.border} />
            <Text style={styles.emptyText}>No courses in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#FFFFFFBB', marginTop: 2 },

  inProgressSection: { padding: SPACING.screen, paddingBottom: 0 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  progressCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  progressIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  progressTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  progressMeta: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  progressTrack: { height: 5, backgroundColor: COLORS.backgroundAlt, borderRadius: 2.5 },
  progressFill: { height: 5, backgroundColor: COLORS.primary, borderRadius: 2.5 },

  chips: { paddingHorizontal: SPACING.screen, paddingVertical: 12, gap: 8 },
  chip: { backgroundColor: COLORS.surface, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: COLORS.border },
  chipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextOn: { color: '#FFF' },

  list: { padding: SPACING.screen, paddingTop: 4 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardThumb: {
    width: 90, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  bestsellerTag: {
    position: 'absolute', top: 6, left: 0,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2,
  },
  bestsellerText: { fontSize: 9, fontWeight: '700', color: '#92400E' },
  freeTag: {
    position: 'absolute', bottom: 6, left: 0,
    backgroundColor: COLORS.success, paddingHorizontal: 6, paddingVertical: 2,
  },
  freeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  cardBody: { flex: 1, padding: 12 },
  courseTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3, lineHeight: 19 },
  courseInstructor: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  courseFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  enrolled: { fontSize: 11, color: COLORS.textMuted },
  enrolledTag: { backgroundColor: COLORS.successBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  enrolledText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  price: { fontSize: 14, fontWeight: '800', color: COLORS.primary },

  empty: { alignItems: 'center', paddingTop: 50, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
});
