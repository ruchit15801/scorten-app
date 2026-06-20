import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_CONVERSATIONS = [
  {
    id: '1', name: 'Delhi Public School', avatar: '🏫', role: 'Recruiter',
    lastMessage: 'We would like to invite you for an interview...', time: '10:42 AM',
    unread: 3, isOnline: true, jobTitle: 'Math Teacher',
  },
  {
    id: '2', name: 'St. Xavier\'s School', avatar: '🏛️', role: 'HR Manager',
    lastMessage: 'Please share your updated resume.', time: 'Yesterday',
    unread: 0, isOnline: false, jobTitle: 'English Teacher',
  },
  {
    id: '3', name: 'Kendriya Vidyalaya', avatar: '🎓', role: 'Principal',
    lastMessage: 'Congratulations! Your offer letter is ready.', time: 'Mon',
    unread: 1, isOnline: true, jobTitle: 'Science Teacher',
  },
  {
    id: '4', name: 'Modern School', avatar: '📚', role: 'HR Team',
    lastMessage: 'Thank you for your application.', time: 'Sun',
    unread: 0, isOnline: false, jobTitle: 'History Teacher',
  },
];

function ConversationCard({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 26 }}>{item.avatar}</Text>
        </View>
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.time, item.unread > 0 && styles.timeUnread]}>{item.time}</Text>
        </View>
        <Text style={styles.jobTag}>{item.jobTitle}</Text>
        <View style={styles.cardBottom}>
          <Text style={[styles.lastMsg, item.unread > 0 && styles.lastMsgUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function MessagesScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.notifBadge}>
          <Text style={styles.notifText}>4</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={COLORS.inputPlaceholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ConversationCard
            item={item}
            onPress={() => navigation.navigate('Chat', { conversation: item })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>💬</Text>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySub}>Apply to jobs to start chatting with schools</Text>
          </View>
        }
      />
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
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  notifBadge: {
    backgroundColor: COLORS.primary, width: 28, height: 28,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  notifText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, margin: SPACING.screen,
    borderRadius: RADIUS.xl, paddingHorizontal: 16, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 10 },

  list: { paddingBottom: 24 },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 80 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.screen, paddingVertical: 14,
    backgroundColor: COLORS.surface,
  },
  avatarWrap: { position: 'relative', marginRight: 14 },
  avatar: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface,
  },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8 },
  time: { fontSize: 12, color: COLORS.textMuted },
  timeUnread: { color: COLORS.primary, fontWeight: '600' },
  jobTag: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lastMsg: { flex: 1, fontSize: 13, color: COLORS.textSecondary, marginRight: 8 },
  lastMsgUnread: { color: COLORS.text, fontWeight: '600' },
  unreadBadge: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
});
