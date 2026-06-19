import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useMyApplications } from '../../hooks/useQueries';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const TABS = ['Applied', 'Interviewing', 'Offers'];

function AppCard({ app, navigation }: any) {
  const job = app.jobId;
  const statusColors: any = {
    applied: COLORS.info,
    screening: COLORS.info,
    interview_scheduled: COLORS.warning,
    interview_completed: COLORS.primary,
    offered: COLORS.success,
    rejected: COLORS.error,
  };

  const statusLabels: any = {
    applied: 'Applied',
    screening: 'AI Screening',
    interview_scheduled: 'Interview Scheduled',
    interview_completed: 'Evaluating',
    offered: 'Offer Received',
    rejected: 'Not Selected',
  };

  const color = statusColors[app.status] || COLORS.textSecondary;
  const label = statusLabels[app.status] || app.status;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => {
        if (app.status === 'interview_scheduled') {
          navigation.navigate('AIInterview');
        }
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.schoolLogo}><Text style={{ fontSize: 24 }}>🏫</Text></View>
        <View style={styles.headerInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>{job?.title || 'Mathematics Teacher'}</Text>
          <Text style={styles.schoolName}>{job?.schoolId?.schoolName || 'Delhi Public School'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: color + '15' }]}>
          <Text style={[styles.statusText, { color }]}>{label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>Applied on {new Date(app.createdAt || Date.now()).toLocaleDateString()}</Text>
        
        {app.status === 'interview_scheduled' && (
          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Start AI Interview →</Text>
          </View>
        )}
        {app.status === 'offered' && (
          <View style={[styles.actionBtn, { backgroundColor: COLORS.success }]}>
            <Text style={styles.actionBtnText}>View Offer</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const MOCK_APPS = [
  { _id: '1', status: 'applied', jobId: { title: 'English Teacher', schoolId: { schoolName: 'St. Xavier\'s' } } },
  { _id: '2', status: 'interview_scheduled', jobId: { title: 'Senior Math Teacher', schoolId: { schoolName: 'DPS' } } },
  { _id: '3', status: 'offered', jobId: { title: 'Physics Teacher', schoolId: { schoolName: 'Allen' } } },
];

export function ApplicationsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('Applied');
  const { data: applications, isLoading } = useMyApplications();

  // Filter based on mock data for demo purposes, since real might be empty
  const apps = (applications?.length ? applications : MOCK_APPS).filter((a: any) => {
    if (activeTab === 'Applied') return ['applied', 'screening'].includes(a.status);
    if (activeTab === 'Interviewing') return ['interview_scheduled', 'interview_completed'].includes(a.status);
    if (activeTab === 'Offers') return ['offered'].includes(a.status);
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={apps}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <AppCard app={item} navigation={navigation} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 50, marginBottom: 16 }}>📋</Text>
            <Text style={styles.emptyTitle}>No applications yet</Text>
            <Text style={styles.emptySub}>You haven't {activeTab.toLowerCase()} to any jobs.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.screen, paddingTop: 56, paddingBottom: 20,
    backgroundColor: COLORS.primaryBg,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },

  tabContainer: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screen, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: {
    marginRight: 24, paddingVertical: 8,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary },

  list: { padding: SPACING.screen },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  schoolLogo: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  schoolName: { fontSize: 13, color: COLORS.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { fontSize: 12, color: COLORS.textMuted },
  
  actionBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full },
  actionBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary },
});
