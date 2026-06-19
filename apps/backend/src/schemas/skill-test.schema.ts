import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SkillTestDocument = SkillTest & Document;

export enum SkillTestSubject {
  MATHEMATICS = 'mathematics',
  ENGLISH = 'english',
  SCIENCE = 'science',
  COMPUTER = 'computer',
  SOCIAL_SCIENCE = 'social_science',
  HINDI = 'hindi',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  BIOLOGY = 'biology',
}

@Schema({ timestamps: true, collection: 'skill_tests' })
export class SkillTest {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: SkillTestSubject, required: true })
  subject: SkillTestSubject;

  @Prop()
  level: string; // 'primary' | 'secondary' | 'senior_secondary'

  @Prop({ default: 30 })
  duration: number; // minutes

  @Prop({ default: 60 })
  passingScore: number; // percentage

  @Prop([
    {
      question: String,
      type: String, // 'mcq' | 'true_false' | 'fill_blank'
      options: [String],
      correctAnswer: Number,
      explanation: String,
      marks: Number,
      difficulty: String,
    },
  ])
  questions: Array<{
    question: string;
    type: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    marks: number;
    difficulty: string;
  }>;

  @Prop({ default: 0 })
  totalMarks: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  totalAttempts: number;
}

export const SkillTestSchema = SchemaFactory.createForClass(SkillTest);

// Skill Test Result Schema
@Schema({ timestamps: true, collection: 'skill_test_results' })
export class SkillTestResult {
  @Prop({ type: Types.ObjectId, ref: 'SkillTest', required: true })
  testId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher' })
  teacherId: Types.ObjectId;

  @Prop({ required: true })
  score: number; // percentage

  @Prop({ required: true })
  marksObtained: number;

  @Prop({ required: true })
  totalMarks: number;

  @Prop({ required: true })
  timeTaken: number; // seconds

  @Prop({ default: false })
  isPassed: boolean;

  @Prop([
    {
      questionId: String,
      selectedAnswer: Number,
      isCorrect: Boolean,
      timeTaken: Number,
    },
  ])
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeTaken: number;
  }>;

  @Prop()
  rank: number; // National rank

  @Prop()
  certificateUrl: string;

  @Prop({ default: false })
  isCertificateIssued: boolean;
}

export const SkillTestResultSchema = SchemaFactory.createForClass(SkillTestResult);
SkillTestResultSchema.index({ testId: 1, userId: 1 });
SkillTestResultSchema.index({ score: -1 });
