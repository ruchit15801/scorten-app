import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

export enum CourseCategory {
  TEACHING_SKILLS = 'teaching_skills',
  CLASSROOM_MANAGEMENT = 'classroom_management',
  TECHNOLOGY = 'technology',
  COMMUNICATION = 'communication',
  SUBJECT_EXPERTISE = 'subject_expertise',
  LEADERSHIP = 'leadership',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Schema({ timestamps: true, collection: 'courses' })
export class Course {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: CourseCategory, required: true })
  category: CourseCategory;

  @Prop({ enum: CourseLevel, default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @Prop({ required: true })
  price: number;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  previewVideoUrl: string;

  @Prop([String])
  tags: string[];

  @Prop([String])
  objectives: string[];

  @Prop([String])
  requirements: string[];

  @Prop({ default: 0 })
  totalDuration: number; // minutes

  @Prop([
    {
      title: String,
      order: Number,
      lessons: [
        {
          title: String,
          videoUrl: String,
          duration: Number,
          order: Number,
          isFree: Boolean,
          resources: [{ title: String, url: String }],
        },
      ],
    },
  ])
  sections: Array<{
    title: string;
    order: number;
    lessons: Array<{
      title: string;
      videoUrl: string;
      duration: number;
      order: number;
      isFree: boolean;
      resources: Array<{ title: string; url: string }>;
    }>;
  }>;

  @Prop([
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
  ])
  assessment: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;

  @Prop()
  certificateTemplate: string;

  @Prop({ default: 0 })
  totalEnrollments: number;

  @Prop({ default: 4.0 })
  rating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  instructor: Types.ObjectId;

  @Prop()
  instructorName: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ category: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ rating: -1 });

// Course Enrollment Schema
@Schema({ timestamps: true, collection: 'course_enrollments' })
export class CourseEnrollment {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: 0 })
  progress: number; // 0-100 percentage

  @Prop([String])
  completedLessons: string[];

  @Prop({ default: 0 })
  assessmentScore: number;

  @Prop({ default: false })
  isCertificateIssued: boolean;

  @Prop()
  certificateUrl: string;

  @Prop()
  certificateIssuedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  paymentId: Types.ObjectId;
}

export const CourseEnrollmentSchema = SchemaFactory.createForClass(CourseEnrollment);
CourseEnrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });
