import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
  APPLIED = 'applied',
  AI_SCREENED = 'ai_screened',
  SHORTLISTED = 'shortlisted',
  AI_INTERVIEW = 'ai_interview',
  AI_INTERVIEW_DONE = 'ai_interview_done',
  SCHOOL_INTERVIEW = 'school_interview',
  OFFER_SENT = 'offer_sent',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_REJECTED = 'offer_rejected',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Schema({ timestamps: true, collection: 'applications' })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @Prop()
  coverLetter: string;

  @Prop()
  resumeUrl: string;

  // AI Screening Results
  @Prop({ default: 0 })
  aiScreeningScore: number;

  @Prop()
  aiScreeningFeedback: string;

  @Prop()
  aiScreenedAt: Date;

  // AI Interview Results
  @Prop({ default: 0 })
  aiInterviewScore: number;

  @Prop({ type: Object })
  aiInterviewReport: {
    communicationScore: number;
    confidenceScore: number;
    teachingScore: number;
    subjectScore: number;
    overallScore: number;
    recommendation: string;
    feedback: string;
    completedAt: Date;
  };

  // Offer Details
  @Prop({ type: Object })
  offer: {
    salary: number;
    joiningDate: Date;
    offerLetterUrl: string;
    issuedAt: Date;
    expiresAt: Date;
    acceptedAt: Date;
    rejectedAt: Date;
    rejectionReason: string;
    digitalSignature: string;
  };

  @Prop([
    {
      status: String,
      changedAt: Date,
      note: String,
      changedBy: { type: Types.ObjectId, ref: 'User' },
    },
  ])
  statusHistory: Array<{
    status: string;
    changedAt: Date;
    note: string;
    changedBy: Types.ObjectId;
  }>;

  @Prop({ default: false })
  isViewed: boolean;

  @Prop()
  viewedAt: Date;

  @Prop()
  notes: string; // Internal school notes
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.index({ jobId: 1, teacherId: 1 }, { unique: true });
ApplicationSchema.index({ teacherId: 1 });
ApplicationSchema.index({ schoolId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ createdAt: -1 });
