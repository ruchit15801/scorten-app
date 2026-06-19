import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';
import { Interview, InterviewDocument } from '../../schemas/interview.schema';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(Interview.name) private interviewModel: Model<InterviewDocument>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: configService.get('OPENAI_API_KEY'),
    });
  }

  /**
   * AI Resume Analysis
   * Extracts structured data from resume text/PDF
   */
  async analyzeResume(resumeText: string): Promise<{
    skills: string[];
    experience: number;
    qualifications: string[];
    subjects: string[];
    summary: string;
    score: number;
  }> {
    const prompt = `
      You are an expert HR analyst for educational institutions.
      Analyze the following teacher resume and extract structured information.
      
      Resume:
      ${resumeText}
      
      Return a JSON object with:
      - skills: array of skills
      - experience: total years of experience (number)
      - qualifications: array of qualifications/degrees
      - subjects: array of subjects they can teach
      - summary: 2-3 sentence professional summary
      - score: profile strength score 0-100
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  }

  /**
   * AI Profile Score Calculator
   * Calculates Scorten Reputation Score
   */
  async calculateProfileScore(teacherId: string): Promise<number> {
    const teacher = await this.teacherModel.findById(teacherId);
    if (!teacher) return 0;

    let score = 0;

    // Profile completeness (30 points)
    if (teacher.bio) score += 5;
    if (teacher.subjects?.length > 0) score += 5;
    if (teacher.experience?.length > 0) score += 8;
    if (teacher.education?.length > 0) score += 7;
    if (teacher.resumeUrl) score += 5;

    // Demo videos (20 points)
    const videoScore = Math.min(teacher.demoVideos?.length * 10, 20);
    score += videoScore;

    // Skill tests (20 points)
    score += Math.min(teacher.skillScore, 20);

    // Reviews (15 points)
    score += Math.min(teacher.reviewScore * 3, 15);

    // Interview score (15 points)
    score += Math.min(teacher.interviewScore * 0.15, 15);

    const finalScore = Math.round(Math.min(score, 100));

    await this.teacherModel.findByIdAndUpdate(teacherId, {
      profileScore: finalScore,
      scortenReputationScore: finalScore,
    });

    return finalScore;
  }

  /**
   * AI Resume Screening for Job Applications
   * Compares teacher profile against job requirements
   */
  async screenApplication(
    teacherProfile: any,
    jobRequirements: any,
  ): Promise<{ score: number; feedback: string; recommendation: string }> {
    const prompt = `
      You are an AI hiring assistant for schools.
      
      Job Requirements:
      ${JSON.stringify(jobRequirements, null, 2)}
      
      Teacher Profile:
      ${JSON.stringify(teacherProfile, null, 2)}
      
      Evaluate the teacher's fit for this job and return a JSON with:
      - score: match score 0-100
      - feedback: detailed feedback (2-3 sentences)
      - recommendation: "strong_match" | "good_match" | "partial_match" | "poor_match"
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  }

  /**
   * Generate AI Interview Questions
   */
  async generateInterviewQuestions(
    subject: string,
    level: string,
    categories: string[],
  ): Promise<Array<{ question: string; category: string; expectedDuration: number }>> {
    const prompt = `
      Generate 8 interview questions for a ${subject} teacher applying for ${level} classes.
      
      Categories to cover: ${categories.join(', ')}
      
      Return a JSON array where each item has:
      - question: the interview question
      - category: one of ${categories.join('/')}
      - expectedDuration: expected answer duration in seconds (30-120)
      
      Questions should be practical, behavioral, and scenario-based.
      Focus on pedagogy, classroom management, and subject expertise.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.questions || result;
  }

  /**
   * Evaluate AI Interview Response
   * Score each answer given by teacher
   */
  async evaluateInterviewAnswer(
    question: string,
    category: string,
    answer: string,
  ): Promise<{ score: number; feedback: string }> {
    const prompt = `
      You are an expert teacher evaluator.
      
      Interview Question (Category: ${category}):
      "${question}"
      
      Teacher's Answer:
      "${answer}"
      
      Evaluate this answer and return JSON with:
      - score: score 0-10
      - feedback: constructive feedback (1-2 sentences)
      
      Consider: clarity, relevance, depth, practical examples, pedagogical understanding.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  }

  /**
   * Generate Final AI Interview Report
   */
  async generateInterviewReport(interviewId: string): Promise<any> {
    const interview = await this.interviewModel.findById(interviewId);
    if (!interview) throw new Error('Interview not found');

    const answersText = interview.questions
      .map((q) => `Q: ${q.question}\nA: ${q.answer}\nScore: ${q.score}/10`)
      .join('\n\n');

    const prompt = `
      You are an expert teacher hiring consultant.
      
      Analyze this AI interview for a teacher position:
      
      ${answersText}
      
      Return a comprehensive JSON report with:
      - communicationScore: 0-100
      - confidenceScore: 0-100
      - teachingScore: 0-100
      - subjectExpertiseScore: 0-100
      - classroomManagementScore: 0-100
      - overallScore: 0-100 (weighted average)
      - recommendation: "strong_hire" | "hire" | "maybe" | "no_hire"
      - strengths: array of 3 strengths
      - improvements: array of 3 areas for improvement
      - summary: paragraph summary for the school HR
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const report = JSON.parse(response.choices[0].message.content);

    // Save report to interview
    await this.interviewModel.findByIdAndUpdate(interviewId, {
      aiReport: report,
      status: 'completed',
      completedAt: new Date(),
    });

    return report;
  }

  /**
   * AI Resume Builder
   * Generate professional resume text from teacher profile
   */
  async generateResume(teacherProfile: any): Promise<string> {
    const prompt = `
      You are a professional resume writer specializing in education sector.
      
      Generate a professional, ATS-friendly resume for this teacher:
      ${JSON.stringify(teacherProfile, null, 2)}
      
      Format it with clear sections:
      - Professional Summary
      - Teaching Experience
      - Education
      - Skills & Competencies
      - Certifications
      - Achievements
      
      Make it compelling, specific, and education-focused.
      Return as plain text with clear formatting.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  }

  /**
   * Analyze Demo Video (uses video transcription)
   */
  async analyzeDemoVideo(videoTranscript: string): Promise<{
    communicationScore: number;
    clarityScore: number;
    engagementScore: number;
    confidenceScore: number;
    overallScore: number;
    feedback: string;
  }> {
    const prompt = `
      You are an expert in teacher evaluation.
      
      Analyze this demo class transcript and evaluate the teacher's performance:
      
      "${videoTranscript}"
      
      Return a JSON with scores 0-100 for:
      - communicationScore: how clearly they communicate
      - clarityScore: how clearly they explain concepts
      - engagementScore: how engaging their teaching style is
      - confidenceScore: how confident they appear
      - overallScore: weighted overall score
      - feedback: 3-4 sentence constructive feedback
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  }
}
