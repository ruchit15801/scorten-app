import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeacherDocument = Teacher & Document;

export enum TeachingLevel {
  PRE_PRIMARY = 'pre_primary',
  PRIMARY = 'primary',
  MIDDLE = 'middle',
  SECONDARY = 'secondary',
  SENIOR_SECONDARY = 'senior_secondary',
  COLLEGE = 'college',
  ALL = 'all',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
}

@Schema({ timestamps: true, collection: 'teachers' })
export class Teacher {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop()
  bio: string;

  @Prop([String])
  subjects: string[];

  @Prop([String])
  boards: string[];

  @Prop({ type: [{ enum: TeachingLevel }] })
  teachingLevels: TeachingLevel[];

  @Prop({ type: [{ enum: EmploymentType }] })
  preferredEmploymentTypes: EmploymentType[];

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  pincode: string;

  @Prop({ default: 0 })
  totalExperience: number; // in years

  @Prop()
  expectedSalaryMin: number;

  @Prop()
  expectedSalaryMax: number;

  @Prop()
  currentSalary: number;

  @Prop()
  noticePeriod: number; // days

  @Prop([String])
  languages: string[];

  @Prop([String])
  certifications: string[];

  @Prop([
    {
      institution: String,
      degree: String,
      field: String,
      startYear: Number,
      endYear: Number,
      grade: String,
      certificate: String,
    },
  ])
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear: number;
    grade: string;
    certificate: string;
  }>;

  @Prop([
    {
      school: String,
      position: String,
      subjects: [String],
      startDate: Date,
      endDate: Date,
      isCurrent: Boolean,
      description: String,
      location: String,
    },
  ])
  experience: Array<{
    school: string;
    position: string;
    subjects: string[];
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
    description: string;
    location: string;
  }>;

  @Prop([
    {
      title: String,
      description: String,
      url: String,
      type: String, // 'video' | 'document' | 'image'
      thumbnailUrl: String,
      uploadedAt: Date,
    },
  ])
  portfolio: Array<{
    title: string;
    description: string;
    url: string;
    type: string;
    thumbnailUrl: string;
    uploadedAt: Date;
  }>;

  @Prop([
    {
      url: String,
      title: String,
      duration: Number,
      thumbnailUrl: String,
      aiScore: Number,
      aiAnalysis: Object,
      uploadedAt: Date,
    },
  ])
  demoVideos: Array<{
    url: string;
    title: string;
    duration: number;
    thumbnailUrl: string;
    aiScore: number;
    aiAnalysis: object;
    uploadedAt: Date;
  }>;

  @Prop()
  resumeUrl: string;

  @Prop()
  resumeAiJson: string; // AI parsed resume as JSON

  // Scorten Reputation Score Components
  @Prop({ default: 0 })
  profileScore: number; // 0-100 profile completeness

  @Prop({ default: 0 })
  skillScore: number; // from skill tests

  @Prop({ default: 0 })
  interviewScore: number; // from AI/school interviews

  @Prop({ default: 0 })
  responseScore: number; // response rate to schools

  @Prop({ default: 0 })
  reviewScore: number; // from parent/school reviews

  @Prop({ default: 0 })
  scortenReputationScore: number; // final 0-100

  @Prop({ default: false })
  isOpenToWork: boolean;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop()
  premiumExpiresAt: Date;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  profileVisible: boolean;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

TeacherSchema.index({ userId: 1 });
TeacherSchema.index({ subjects: 1 });
TeacherSchema.index({ city: 1, state: 1 });
TeacherSchema.index({ scortenReputationScore: -1 });
TeacherSchema.index({ isOpenToWork: 1 });
