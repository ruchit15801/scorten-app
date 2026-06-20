import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SchoolDocument = School & Document;

export enum SchoolType {
  GOVERNMENT = 'government',
  PRIVATE = 'private',
  INTERNATIONAL = 'international',
  CBSE = 'cbse',
  ICSE = 'icse',
  STATE_BOARD = 'state_board',
  IB = 'ib',
  CAMBRIDGE = 'cambridge',
}

export enum SchoolStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true, collection: 'schools' })
export class School {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // ─── Scorten School ID ────────────────────────────────────────────────────────
  // Auto-generated unique ID: SCH-YYYY-XXXXX (e.g. SCH-2026-A3F7K)
  // Used for easy identification, searching, and sharing
  @Prop({ unique: true, sparse: true, trim: true, uppercase: true })
  scortenId: string;

  @Prop({ required: true, trim: true })
  schoolName: string;

  // Official government affiliation / UDISE / registration number
  @Prop({ trim: true })
  affiliationNumber: string;

  @Prop()
  registrationNumber: string;

  @Prop({ enum: SchoolType })
  schoolType: SchoolType;

  @Prop()
  board: string;

  @Prop()
  established: number;

  @Prop()
  principalName: string;

  @Prop()
  website: string;

  @Prop()
  description: string;

  @Prop()
  logoUrl: string;

  @Prop([String])
  photos: string[];

  // Address
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  pincode: string;

  @Prop({ country: String })
  country: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: { type: [Number], default: [0, 0] },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  // Subscription
  @Prop({ default: false })
  isSubscribed: boolean;

  @Prop()
  subscriptionPlan: string; // 'basic' | 'pro' | 'enterprise'

  @Prop()
  subscriptionExpiresAt: Date;

  @Prop({ default: 0 })
  aiCredits: number;

  // Verification
  @Prop({ enum: SchoolStatus, default: SchoolStatus.PENDING })
  verificationStatus: SchoolStatus;

  @Prop()
  verifiedAt: Date;

  @Prop()
  verifiedBy: Types.ObjectId;

  @Prop([String])
  documents: string[];

  // Stats
  @Prop({ default: 0 })
  totalJobsPosted: number;

  @Prop({ default: 0 })
  totalHires: number;

  @Prop({ default: 0 })
  averageHiringDays: number;

  @Prop({ default: 4.0 })
  rating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: false })
  isFeatured: boolean;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

SchoolSchema.index({ userId: 1 });
SchoolSchema.index({ scortenId: 1 });
SchoolSchema.index({ affiliationNumber: 1 });
SchoolSchema.index({ city: 1, state: 1 });
SchoolSchema.index({ verificationStatus: 1 });
SchoolSchema.index({ location: '2dsphere' });
