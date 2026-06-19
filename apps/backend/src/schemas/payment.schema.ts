import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentType {
  SCHOOL_SUBSCRIPTION = 'school_subscription',
  TEACHER_PREMIUM = 'teacher_premium',
  AI_INTERVIEW_CREDIT = 'ai_interview_credit',
  GIG_PAYMENT = 'gig_payment',
  PROFILE_BOOST = 'profile_boost',
  FEATURED_LISTING = 'featured_listing',
  COURSE_PURCHASE = 'course_purchase',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: PaymentType, required: true })
  type: PaymentType;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  gst: number;

  @Prop()
  currency: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop()
  razorpayOrderId: string;

  @Prop()
  razorpayPaymentId: string;

  @Prop()
  razorpaySignature: string;

  @Prop()
  refId: string; // jobId, gigId, subscriptionId etc.

  @Prop({ type: Object })
  metadata: object;

  @Prop()
  description: string;

  @Prop()
  invoiceUrl: string;

  @Prop()
  failureReason: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ type: 1 });
PaymentSchema.index({ createdAt: -1 });

// Wallet Transaction Schema
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Schema({ timestamps: true, collection: 'wallet_transactions' })
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ required: true })
  amount: number;

  @Prop()
  balance: number; // balance after transaction

  @Prop()
  description: string;

  @Prop()
  refId: string;

  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  paymentId: Types.ObjectId;
}

export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction);
