import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatState {
  conversations: any[];
  activeConversation: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  isConnected: boolean;
  unreadCount: number;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: {},
  isConnected: false,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<any[]>) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const convId = action.payload.conversationId;
      if (!state.messages[convId]) state.messages[convId] = [];
      state.messages[convId].push(action.payload);
    },
    setTyping: (state, action: PayloadAction<{ conversationId: string; userId: string; isTyping: boolean }>) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) state.typingUsers[conversationId] = [];
      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(id => id !== userId);
      }
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
});

export const {
  setConversations, setActiveConversation, setMessages, addMessage,
  setTyping, setConnected, setUnreadCount,
} = chatSlice.actions;
export default chatSlice.reducer;
