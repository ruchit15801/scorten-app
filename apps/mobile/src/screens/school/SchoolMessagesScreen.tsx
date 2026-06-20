import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_CONVERSATIONS = [
  {
    id: '1', name: 'Priya Sharma', avatar: '👩‍🏫', role: 'Math Teacher',
    lastMessage: 'Thank you! I am available for the interview.', time: '10:42 AM', unread: 2,
  },
  {
    id: '2', name: 'Rahul Desai', avatar: '👨‍🏫', role: 'Physics Teacher',
    lastMessage: 'Could you share the job description again?', time: 'Yesterday', unread: 0,
  },
  {
    id: '3', name: 'Anjali Patel', avatar: '👩‍🏫', role: 'English Teacher',
    lastMessage: 'Yes, I am open to a full time position.', time: 'Mon', unread: 1,
  },
];

function ConversationCard({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.convCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.convAvatar}>
        <Text style={{ fontSize: 24 }}>{item.avatar}</Text>
      </View>
      <View style={styles.convBody}>
        <View style={styles.convTop}>
          <Text style={styles.convName}>{item.name}</Text>
          <Text style={[styles.convTime, item.unread > 0 && styles.convTimeUnread]}>{item.time}</Text>
        </View>
        <Text style={styles.convRole}>{item.role}</Text>
        <View style={styles.convBottom}>
          <Text style={[styles.convMsg, item.unread > 0 && styles.convMsgUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function SchoolMessagesScreen({ navigation }: any) {
  const [activeView, setActiveView] = useState<'list' | 'chat'>('list');
  const [activeConv, setActiveConv] = useState<any>(null);
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: 'Hello Priya! We were impressed by your profile.', fromMe: true, time: '10:30 AM' },
    { id: '2', text: 'Thank you! I am very excited about this opportunity.', fromMe: false, time: '10:32 AM' },
    { id: '3', text: 'We would like to schedule an AI interview. Are you available?', fromMe: true, time: '10:35 AM' },
    { id: '4', text: 'Thank you! I am available for the interview.', fromMe: false, time: '10:42 AM' },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: input.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
  };

  if (activeView === 'chat' && activeConv) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar backgroundColor={COLORS.surface} barStyle="dark-content" />
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveView('list')} style={{ width: 40 }}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatAvatar}>
              <Text style={{ fontSize: 20 }}>{activeConv.avatar}</Text>
            </View>
            <View>
              <Text style={styles.chatName}>{activeConv.name}</Text>
              <Text style={styles.chatRole}>{activeConv.role}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.scheduleBtn}>
            <Text style={styles.scheduleBtnText}>Schedule Interview</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={chatMessages}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.msgList}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, item.fromMe && styles.bubbleTextMe]}>{item.text}</Text>
              <Text style={[styles.bubbleTime, item.fromMe && styles.bubbleTimeMe]}>{item.time}</Text>
            </View>
          )}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.inputPlaceholder}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <Text style={{ fontSize: 20, color: input.trim() ? '#FFF' : COLORS.textMuted }}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBg} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={c => c.id}
        renderItem={({ item }) => (
          <ConversationCard
            item={item}
            onPress={() => { setActiveConv(item); setActiveView('chat'); }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border, marginLeft: 80 }} />}
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
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  badge: {
    backgroundColor: COLORS.primary, width: 28, height: 28,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  convCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.screen, backgroundColor: COLORS.surface },
  convAvatar: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center', marginRight: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  convBody: { flex: 1 },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  convName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  convTime: { fontSize: 12, color: COLORS.textMuted },
  convTimeUnread: { color: COLORS.primary, fontWeight: '600' },
  convRole: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  convBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  convMsg: { flex: 1, fontSize: 13, color: COLORS.textSecondary, marginRight: 8 },
  convMsgUnread: { color: COLORS.text, fontWeight: '600' },
  unreadBadge: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  chatHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.screen, paddingTop: 52, paddingBottom: 12,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backArrow: { fontSize: 32, color: COLORS.text },
  chatHeaderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center',
  },
  chatName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  chatRole: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  scheduleBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  scheduleBtnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  msgList: { padding: SPACING.screen, paddingBottom: 20 },
  bubble: {
    maxWidth: '75%', borderRadius: RADIUS.xl, padding: 12, marginBottom: 10,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary, alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: COLORS.surface, alignSelf: 'flex-start',
    borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  bubbleText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  bubbleTextMe: { color: '#FFF' },
  bubbleTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  bubbleTimeMe: { color: '#FFFFFF99' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: SPACING.screen, paddingVertical: 10,
    backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 10,
  },
  input: {
    flex: 1, backgroundColor: COLORS.inputBg, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.inputBorder,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: COLORS.text, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnOff: { backgroundColor: COLORS.border },
});
