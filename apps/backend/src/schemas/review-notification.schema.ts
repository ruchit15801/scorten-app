import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

export enum ReviewType {
  SCHOOL_TO_TEACHER = 'school_to_teacher',
  PARENT_TO_TEACHER = 'parent_to_teacher',
  TEACHER_TO_SCHOOL = 'teacher_to_school',
}

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reviewerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  revieweeId: Types.ObjectId;

  @Prop({ enum: ReviewType, required: true })
  type: ReviewType;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ type: Types.ObjectId, ref: 'GigBooking' })
  gigBookingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Application' })
  applicationId: Types.ObjectId;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isFlagged: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ revieweeId: 1 });
ReviewSchema.index({ type: 1 });

// Notification Schema
export enum NotificationType {
  JOB_APPLIED = 'job_applied',
  APPLICATION_SHORTLISTED = 'application_shortlisted',
  APPLICATION_REJECTED = 'application_rejected',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  OFFER_RECEIVED = 'offer_received',
  MESSAGE_RECEIVED = 'message_received',
  GIG_BOOKED = 'gig_booked',
  PAYMENT_SUCCESS = 'payment_success',
  SKILL_TEST_RESULT = 'skill_test_result',
  PROFILE_VERIFIED = 'profile_verified',
  COURSE_COMPLETED = 'course_completed',
  SYSTEM = 'system',
}

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Object })
  data: object; // Deep link data

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt: Date;

  @Prop({ default: false })
  isSent: boolean; // FCM sent

  @Prop()
  sentAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });
