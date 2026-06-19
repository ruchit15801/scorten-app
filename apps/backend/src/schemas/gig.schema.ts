import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GigDocument = Gig & Document;

export enum GigStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
}

export enum GigBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true, collection: 'gigs' })
export class Gig {
  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  subjects: string[];

  @Prop([String])
  classes: string[];

  @Prop([String])
  boards: string[];

  @Prop({ required: true })
  hourlyRate: number;

  @Prop()
  sessionDuration: number; // minutes (30, 60, 90)

  @Prop([String])
  availableDays: string[];

  @Prop([String])
  availableSlots: string[];

  @Prop()
  mode: string; // 'online' | 'offline' | 'both'

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop([String])
  languages: string[];

  @Prop()
  thumbnailUrl: string;

  @Prop([String])
  tags: string[];

  @Prop({ enum: GigStatus, default: GigStatus.ACTIVE })
  status: GigStatus;

  @Prop({ default: 0 })
  totalBookings: number;

  @Prop({ default: 0 })
  totalEarnings: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: false })
  isFeatured: boolean;
}

export const GigSchema = SchemaFactory.createForClass(Gig);

GigSchema.index({ teacherId: 1 });
GigSchema.index({ subjects: 1 });
GigSchema.index({ city: 1 });
GigSchema.index({ status: 1 });
GigSchema.index({ rating: -1 });

// Gig Booking Schema
@Schema({ timestamps: true, collection: 'gig_bookings' })
export class GigBooking {
  @Prop({ type: Types.ObjectId, ref: 'Gig', required: true })
  gigId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  parentId: Types.ObjectId;

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ required: true })
  duration: number; // minutes

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  platformFee: number;

  @Prop({ default: 0 })
  teacherPayout: number;

  @Prop({ enum: GigBookingStatus, default: GigBookingStatus.PENDING })
  status: GigBookingStatus;

  @Prop()
  roomId: string; // Video room ID

  @Prop()
  paymentId: string;

  @Prop()
  refundId: string;

  @Prop()
  notes: string;

  @Prop()
  cancellationReason: string;
}

export const GigBookingSchema = SchemaFactory.createForClass(GigBooking);
