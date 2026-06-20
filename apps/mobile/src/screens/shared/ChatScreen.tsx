import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_MESSAGES = [
  { id: '1', text: 'Hello! We reviewed your profile and are very impressed with your qualifications.', fromMe: false, time: '10:30 AM' },
  { id: '2', text: 'Thank you! I\'m very interested in the Mathematics Teacher position.', fromMe: true, time: '10:32 AM' },
  { id: '3', text: 'We\'d like to schedule an AI interview for you. Are you available this week?', fromMe: false, time: '10:33 AM' },
  { id: '4', text: 'Yes, absolutely! I\'m available from Tuesday to Friday.', fromMe: true, time: '10:35 AM' },
  { id: '5', text: 'Perfect! We will send you the AI interview link shortly. Please complete it at your convenience.', fromMe: false, time: '10:36 AM' },
  { id: '6', text: 'We would like to invite you for an interview. Our HR team will reach out within 24 hours.', fromMe: false, time: '10:42 AM' },
];

function MessageBubble({ msg }: any) {
  return (
    <View style={[styles.bubbleWrap, msg.fromMe && styles.bubbleWrapMe]}>
      {!msg.fromMe && (
        <View style={styles.msgAvatar}>
          <Text style={{ fontSize: 14 }}>🏫</Text>
        </View>
      )}
      <View style={[styles.bubble, msg.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.bubbleText, msg.fromMe && styles.bubbleTextMe]}>{msg.text}</Text>
        <Text style={[styles.bubbleTime, msg.fromMe && styles.bubbleTimeME]}>{msg.time}</Text>
      </View>
    </View>
  );
}

export function ChatScreen({ navigation, route }: any) {
  const { conversation } = route.params || { conversation: { name: 'Delhi Public School', avatar: '🏫', jobTitle: 'Math Teacher' } };
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const flatRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: input.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.surface} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={{ fontSize: 20 }}>{conversation.avatar}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{conversation.name}</Text>
            <Text style={styles.headerRole}>{conversation.jobTitle}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Text style={{ fontSize: 20 }}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Date divider */}
      <View style={styles.dateDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Today</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => <MessageBubble msg={item} />}
        onLayout={() => flatRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Text style={{ fontSize: 22 }}>📎</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.inputPlaceholder}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Text style={{ fontSize: 20 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.screen, paddingTop: 52, paddingBottom: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 3,
  },
  backBtn: { width: 40 },
  backArrow: { fontSize: 32, color: COLORS.text, lineHeight: 32 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  headerName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  headerRole: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  callBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center',
  },

  dateDivider: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16, gap: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },

  messageList: { paddingHorizontal: SPACING.screen, paddingBottom: 16 },

  bubbleWrap: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  bubbleWrapMe: { justifyContent: 'flex-end' },
  msgAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.backgroundAlt, alignItems: 'center', justifyContent: 'center',
  },
  bubble: {
    maxWidth: '75%', borderRadius: RADIUS.xl, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  bubbleText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  bubbleTextMe: { color: '#FFF' },
  bubbleTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  bubbleTimeME: { color: '#FFFFFF99' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    gap: 8,
  },
  attachBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1, backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.inputBorder,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12,
    fontSize: 15, color: COLORS.text, maxHeight: 120,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.border },
});
