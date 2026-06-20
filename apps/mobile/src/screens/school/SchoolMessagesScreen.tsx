import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const CONVS = [
  { id: '1', name: 'Priya Sharma', role: 'Math Teacher', last: 'Available for interview Tuesday', time: '2m ago', unread: 2, online: true, score: 94 },
  { id: '2', name: 'Rahul Desai', role: 'Physics Teacher', last: 'Thank you for the opportunity', time: '1h ago', unread: 0, online: false, score: 88 },
  { id: '3', name: 'Anjali Patel', role: 'English Teacher', last: 'I have sent my updated resume', time: 'Yesterday', unread: 1, online: true, score: 91 },
  { id: '4', name: 'Rohit Mishra', role: 'Chemistry Teacher', last: 'Looking forward to the interview', time: 'Mon', unread: 0, online: false, score: 85 },
];

const MOCK_MSGS = [
  { id: '1', text: "Hello! I saw your profile on Scorten. We'd love to have you join our team.", fromMe: true, time: '10:00' },
  { id: '2', text: 'Thank you! I am very interested in the Mathematics Teacher position at your school.', fromMe: false, time: '10:05' },
  { id: '3', text: 'Great! We would like to schedule an AI interview. Are you available this week?', fromMe: true, time: '10:07' },
  { id: '4', text: 'Available for interview Tuesday', fromMe: false, time: '10:10' },
];

function ConvItem({ item, active, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.convItem, active && styles.convItemActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.convAvatar}>
        <Icon name="person" size={20} color={active ? '#FFF' : COLORS.primary} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.convInfo}>
        <View style={styles.convTop}>
          <Text style={[styles.convName, active && styles.convNameActive]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.convTime, active && { color: '#FFFFFFAA' }]}>{item.time}</Text>
        </View>
        <Text style={[styles.convRole, active && { color: '#FFFFFFCC' }]}>{item.role}</Text>
        <Text style={[styles.convLast, active && { color: '#FFFFFFCC' }]} numberOfLines={1}>{item.last}</Text>
      </View>
      {item.unread > 0 && !active && (
        <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View>
      )}
    </TouchableOpacity>
  );
}

function Bubble({ msg }: any) {
  return (
    <View style={[bubble.wrap, msg.fromMe && bubble.wrapMe]}>
      {!msg.fromMe && (
        <View style={bubble.avatar}>
          <Icon name="person" size={16} color={COLORS.primary} />
        </View>
      )}
      <View style={[bubble.box, msg.fromMe ? bubble.me : bubble.them]}>
        <Text style={[bubble.text, msg.fromMe && bubble.textMe]}>{msg.text}</Text>
        <Text style={[bubble.time, msg.fromMe && bubble.timeMe]}>{msg.time}</Text>
      </View>
    </View>
  );
}

const bubble = StyleSheet.create({
  wrap: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end', gap: 8 },
  wrapMe: { justifyContent: 'flex-end' },
  avatar: { width: 28, height: 28, borderRadius: 10, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  box: { maxWidth: '75%', borderRadius: 16, padding: 12 },
  me: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  them: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  text: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  textMe: { color: '#FFF' },
  time: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  timeMe: { color: '#FFFFFF70' },
});

export function SchoolMessagesScreen({ navigation }: any) {
  const [activeId, setActiveId] = useState(CONVS[0].id);
  const [messages, setMessages] = useState(MOCK_MSGS);
  const [input, setInput] = useState('');
  const flatRef = useRef<FlatList>(null);
  const activeConv = CONVS.find(c => c.id === activeId) || CONVS[0];

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { id: Date.now().toString(), text: input.trim(), fromMe: true, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) }]);
    setInput('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.mainContainer}>
        {/* LEFT — Conversation List */}
        <View style={styles.leftPanel}>
          <View style={styles.leftHeader}>
            <Text style={styles.leftTitle}>Messages</Text>
          </View>
          <FlatList
            data={CONVS}
            keyExtractor={c => c.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ConvItem
                item={item}
                active={item.id === activeId}
                onPress={() => setActiveId(item.id)}
              />
            )}
          />
        </View>

        {/* RIGHT — Chat Pane */}
        <View style={styles.rightPanel}>
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <View style={styles.chatAvatar}>
              <Icon name="person" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatName}>{activeConv.name}</Text>
              <Text style={styles.chatRole}>{activeConv.role}</Text>
            </View>
            <View style={[styles.aiScoreBadge, { backgroundColor: COLORS.success + '18' }]}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.success }}>AI {activeConv.score}</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Candidates', { screen: 'CandidateProfile', params: { candidate: { name: activeConv.name, role: activeConv.role, score: activeConv.score } } })}>
              <Icon name="person" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={m => m.id}
            contentContainerStyle={styles.msgList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <Bubble msg={item} />}
            onLayout={() => flatRef.current?.scrollToEnd({ animated: false })}
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type message..."
              placeholderTextColor={COLORS.inputPlaceholder}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]} onPress={send} disabled={!input.trim()}>
              <Icon name="send" size={18} color={input.trim() ? '#FFF' : COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  mainContainer: { flex: 1, flexDirection: 'row' },

  leftPanel: { width: 220, backgroundColor: COLORS.primary, borderRightWidth: 1, borderRightColor: '#FFFFFF20' },
  leftHeader: { paddingTop: 52, paddingHorizontal: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#FFFFFF20' },
  leftTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },

  convItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: '#FFFFFF15' },
  convItemActive: { backgroundColor: '#FFFFFF20' },
  convAvatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: 4.5, backgroundColor: COLORS.success, borderWidth: 1.5, borderColor: COLORS.primary },
  convInfo: { flex: 1, minWidth: 0 },
  convTop: { flexDirection: 'row', justifyContent: 'space-between' },
  convName: { fontSize: 12, fontWeight: '700', color: '#FFFFFFCC', flex: 1 },
  convNameActive: { color: '#FFF' },
  convTime: { fontSize: 10, color: '#FFFFFF60' },
  convRole: { fontSize: 10, color: '#FFFFFF80', marginBottom: 2 },
  convLast: { fontSize: 11, color: '#FFFFFF60', lineHeight: 14 },
  badge: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 10, color: '#FFF', fontWeight: '800' },

  rightPanel: { flex: 1, backgroundColor: '#F5F4FF' },
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingTop: 52, paddingBottom: 12,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  chatAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  chatName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  chatRole: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  aiScoreBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  profileBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },

  msgList: { padding: 14, paddingBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 10, backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  input: {
    flex: 1, backgroundColor: COLORS.inputBg, borderRadius: RADIUS.xl,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: COLORS.text, maxHeight: 90,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff: { backgroundColor: COLORS.backgroundAlt },
});
