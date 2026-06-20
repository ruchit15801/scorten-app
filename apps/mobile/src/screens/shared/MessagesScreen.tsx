import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const CONVS = [
  { id: '1', name: 'Delhi Public School', role: 'HR Manager', last: 'We would like to invite you for an AI interview...', time: '10:42', unread: 3, online: true, job: 'Math Teacher' },
  { id: '2', name: "St. Xavier's School", role: 'Principal', last: 'Please share your updated resume.', time: 'Yesterday', unread: 0, online: false, job: 'English Teacher' },
  { id: '3', name: 'Kendriya Vidyalaya', role: 'Vice Principal', last: '🎉 Congratulations! Your offer letter is ready.', time: 'Mon', unread: 1, online: true, job: 'Science Teacher' },
  { id: '4', name: 'Modern School', role: 'HR Team', last: 'Thank you for your application.', time: 'Sun', unread: 0, online: false, job: 'History Teacher' },
  { id: '5', name: 'DAV Public School', role: 'Recruiter', last: 'We have reviewed your profile.', time: 'Sat', unread: 0, online: false, job: 'Computer Science' },
];

function ConvCard({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Icon name="school" size={22} color={COLORS.primary} />
        </View>
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={[styles.name, item.unread > 0 && styles.nameBold]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.time, item.unread > 0 && styles.timeUnread]}>{item.time}</Text>
        </View>
        <Text style={styles.jobTag}>{item.job}</Text>
        <View style={styles.cardBottom}>
          <Text style={[styles.lastMsg, item.unread > 0 && styles.lastMsgBold]} numberOfLines={1}>{item.last}</Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function MessagesScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const filtered = CONVS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.job.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = CONVS.reduce((s, c) => s + c.unread, 0);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <View style={styles.unreadTotal}>
              <Text style={styles.unreadTotalText}>{totalUnread} new</Text>
            </View>
          )}
        </View>

        {/* Search embedded in header */}
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={COLORS.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <ConvCard
            item={item}
            onPress={() => navigation.navigate('Chat', { conversation: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Icon name="chatbubbles-outline" size={44} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No conversations</Text>
            <Text style={styles.emptySub}>Apply to jobs to start chatting with schools</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingHorizontal: SPACING.screen, paddingBottom: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  unreadTotal: {
    backgroundColor: '#FFFFFF25', borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: '#FFFFFF40',
  },
  unreadTotalText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF', borderRadius: RADIUS.xl,
    paddingHorizontal: 14, paddingVertical: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 13 },

  list: { paddingBottom: 20 },
  sep: { height: 1, backgroundColor: COLORS.border, marginLeft: 88 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.screen, paddingVertical: 14,
    backgroundColor: COLORS.surface,
  },
  avatarWrap: { position: 'relative', marginRight: 14 },
  avatar: {
    width: 54, height: 54, borderRadius: 17, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary + '30',
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 13, height: 13, borderRadius: 6.5, backgroundColor: COLORS.success,
    borderWidth: 2.5, borderColor: COLORS.surface,
  },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text, marginRight: 8 },
  nameBold: { fontWeight: '800' },
  time: { fontSize: 12, color: COLORS.textMuted },
  timeUnread: { color: COLORS.primary, fontWeight: '700' },
  jobTag: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lastMsg: { flex: 1, fontSize: 13, color: COLORS.textMuted },
  lastMsgBold: { color: COLORS.text, fontWeight: '600' },
  badge: {
    minWidth: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary,
    paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 11, color: '#FFF', fontWeight: '800' },

  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 21 },
});
