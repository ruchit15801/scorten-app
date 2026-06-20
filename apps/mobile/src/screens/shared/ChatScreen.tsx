import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { COLORS, SPACING, RADIUS } from '../../constants/colors';

const MOCK_MSGS = [
  { id: '1', text: 'Hello! We reviewed your profile and are very impressed with your qualifications.', fromMe: false, time: '10:30' },
  { id: '2', text: "Thank you! I'm very interested in the Mathematics Teacher position.", fromMe: true, time: '10:32' },
  { id: '3', text: "We'd like to schedule an AI interview. Are you available this week?", fromMe: false, time: '10:33' },
  { id: '4', text: 'Yes, absolutely! Available Tuesday to Friday.', fromMe: true, time: '10:35' },
  { id: '5', text: 'Perfect! We will send you the AI interview link shortly.', fromMe: false, time: '10:36' },
];

function Bubble({ msg }: { msg: any }) {
  return (
    <View style={[bubble.wrap, msg.fromMe && bubble.wrapMe]}>
      {!msg.fromMe && (
        <View style={bubble.avatar}>
          <Icon name="school" size={16} color={COLORS.primary} />
        </View>
      )}
      <View style={[bubble.box, msg.fromMe ? bubble.boxMe : bubble.boxThem]}>
        <Text style={[bubble.text, msg.fromMe && bubble.textMe]}>{msg.text}</Text>
        <Text style={[bubble.time, msg.fromMe && bubble.timeMe]}>{msg.time}</Text>
      </View>
    </View>
  );
}

const bubble = StyleSheet.create({
  wrap: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  wrapMe: { justifyContent: 'flex-end' },
  avatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  box: { maxWidth: '76%', borderRadius: 18, padding: 12, paddingHorizontal: 14 },
  boxMe: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  boxThem: {
    backgroundColor: COLORS.surface, borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  text: { fontSize: 15, color: COLORS.text, lineHeight: 21 },
  textMe: { color: '#FFF' },
  time: { fontSize: 10, color: COLORS.textMuted, marginTop: 5, alignSelf: 'flex-end' },
  timeMe: { color: '#FFFFFF80' },
});

export function ChatScreen({ navigation, route }: any) {
  const conv = route.params?.conversation || { name: 'Delhi Public School', jobTitle: 'Math Teacher', isOnline: true };
  const [messages, setMessages] = useState(MOCK_MSGS);
  const [input, setInput] = useState('');
  const flatRef = useRef<FlatList>(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { id: Date.now().toString(), text: input.trim(), fromMe: true, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) }]);
    setInput('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor={COLORS.surface} barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Icon name="school" size={20} color={COLORS.primary} />
            {conv.isOnline && <View style={styles.onlineDot} />}
          </View>
          <View>
            <Text style={styles.headerName}>{conv.name}</Text>
            <Text style={styles.headerSub}>{conv.jobTitle} · {conv.isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="call-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="videocam-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date separator */}
      <View style={styles.dateSep}>
        <View style={styles.sepLine} />
        <Text style={styles.sepText}>Today</Text>
        <View style={styles.sepLine} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.msgList}
        renderItem={({ item }) => <Bubble msg={item} />}
        onLayout={() => flatRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Icon name="add-circle" size={26} color={COLORS.textMuted} />
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
          onSubmitEditing={send}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
          onPress={send}
          disabled={!input.trim()}
        >
          <Icon name="send" size={18} color={input.trim() ? '#FFF' : COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F4FF' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingTop: 50, paddingBottom: 12,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 4,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success,
    borderWidth: 2, borderColor: COLORS.surface,
  },
  headerName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  headerSub: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  headerActions: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  dateSep: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, gap: 10 },
  sepLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  sepText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', backgroundColor: '#F5F4FF', paddingHorizontal: 8 },
  msgList: { paddingHorizontal: SPACING.screen, paddingBottom: 8 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 10, paddingVertical: 10,
    backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 6,
  },
  attachBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1, backgroundColor: COLORS.inputBg, borderRadius: RADIUS.xl,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
    paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11,
    fontSize: 15, color: COLORS.text, maxHeight: 110,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  sendBtnOff: { backgroundColor: COLORS.backgroundAlt, shadowOpacity: 0, elevation: 0 },
});
