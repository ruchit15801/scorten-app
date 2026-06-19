import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
  FILLED = 'filled',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  SUBSTITUTE = 'substitute',
}

@Schema({ timestamps: true, collection: 'jobs' })
export class Job {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  postedBy: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  subjects: string[];

  @Prop()
  board: string;

  @Prop([String])
  classes: string[];

  @Prop({ enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType;

  @Prop({ enum: JobStatus, default: JobStatus.ACTIVE })
  status: JobStatus;

  @Prop()
  salaryMin: number;

  @Prop()
  salaryMax: number;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop({ required: true })
  experienceMin: number; // in years

  @Prop()
  experienceMax: number;

  @Prop([String])
  qualifications: string[];

  @Prop([String])
  skills: string[];

  @Prop([String])
  languages: string[];

  @Prop()
  applicationDeadline: Date;

  @Prop({ default: 0 })
  openings: number;

  @Prop({ default: 0 })
  totalApplications: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  aiScreeningEnabled: boolean;

  @Prop({ default: false })
  aiInterviewEnabled: boolean;

  @Prop()
  aiScreeningCriteria: string; // JSON string with criteria

  @Prop([String])
  tags: string[];
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ schoolId: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ subjects: 1 });
JobSchema.index({ city: 1, state: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ isFeatured: -1, createdAt: -1 });
