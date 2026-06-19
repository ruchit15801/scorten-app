import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InterviewDocument = Interview & Document;

export enum InterviewType {
  AI = 'ai',
  SCHOOL = 'school',
  GIG_SESSION = 'gig_session',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Schema({ timestamps: true, collection: 'interviews' })
export class Interview {
  @Prop({ type: Types.ObjectId, ref: 'Application', required: true })
  applicationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School' })
  schoolId: Types.ObjectId;

  @Prop({ enum: InterviewType, required: true })
  type: InterviewType;

  @Prop({ enum: InterviewStatus, default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @Prop()
  scheduledAt: Date;

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  duration: number; // minutes

  // Video Infrastructure
  @Prop()
  roomId: string; // Agora channel / 100ms room

  @Prop()
  recordingUrl: string;

  // AI Interview Fields
  @Prop([
    {
      questionId: String,
      question: String,
      category: String,
      answer: String,
      answerVideoUrl: String,
      score: Number,
      feedback: String,
      duration: Number,
    },
  ])
  questions: Array<{
    questionId: string;
    question: string;
    category: string; // 'subject' | 'behavioral' | 'classroom' | 'parent_communication'
    answer: string;
    answerVideoUrl: string;
    score: number;
    feedback: string;
    duration: number;
  }>;

  @Prop({ type: Object })
  aiReport: {
    communicationScore: number;
    confidenceScore: number;
    teachingScore: number;
    subjectExpertiseScore: number;
    classroomManagementScore: number;
    overallScore: number;
    recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no_hire';
    strengths: string[];
    improvements: string[];
    summary: string;
  };

  @Prop()
  schoolFeedback: string;

  @Prop({ default: 0 })
  schoolRating: number;

  @Prop()
  meetingLink: string; // for school interviews
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);

InterviewSchema.index({ applicationId: 1 });
InterviewSchema.index({ teacherId: 1 });
InterviewSchema.index({ schoolId: 1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ scheduledAt: 1 });
