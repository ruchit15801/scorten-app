import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;
export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true, collection: 'conversations' })
export class Conversation {
  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Job' })
  jobId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Application' })
  applicationId: Types.ObjectId;

  @Prop()
  lastMessageAt: Date;

  @Prop()
  lastMessage: string;

  @Prop([
    {
      userId: { type: Types.ObjectId, ref: 'User' },
      unreadCount: Number,
    },
  ])
  unreadCounts: Array<{ userId: Types.ObjectId; unreadCount: number }>;

  @Prop({ default: false })
  isArchived: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
  VIDEO = 'video',
  OFFER = 'offer',
  SYSTEM = 'system',
}

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop()
  content: string;

  @Prop()
  fileUrl: string;

  @Prop()
  fileName: string;

  @Prop()
  fileSize: number;

  @Prop({ type: Object })
  metadata: object; // For offer cards, system messages etc.

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
