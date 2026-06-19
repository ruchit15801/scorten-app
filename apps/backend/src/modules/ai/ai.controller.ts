import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller({ path: 'ai', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze-resume')
  @ApiOperation({ summary: 'AI analyze resume text and extract structured data' })
  async analyzeResume(@Body('resumeText') resumeText: string) {
    const result = await this.aiService.analyzeResume(resumeText);
    return { success: true, data: result };
  }

  @Post('profile-score/:teacherId')
  @ApiOperation({ summary: 'Calculate Scorten Reputation Score for teacher' })
  async calculateProfileScore(@Param('teacherId') teacherId: string) {
    const score = await this.aiService.calculateProfileScore(teacherId);
    return { success: true, data: { score } };
  }

  @Post('generate-interview-questions')
  @ApiOperation({ summary: 'Generate AI interview questions for a subject' })
  async generateQuestions(
    @Body('subject') subject: string,
    @Body('level') level: string,
    @Body('categories') categories: string[],
  ) {
    const questions = await this.aiService.generateInterviewQuestions(
      subject,
      level,
      categories || ['subject_expertise', 'classroom_management', 'behavioral', 'parent_communication'],
    );
    return { success: true, data: questions };
  }

  @Post('evaluate-answer')
  @ApiOperation({ summary: 'AI evaluate a single interview answer' })
  async evaluateAnswer(
    @Body('question') question: string,
    @Body('category') category: string,
    @Body('answer') answer: string,
  ) {
    const result = await this.aiService.evaluateInterviewAnswer(question, category, answer);
    return { success: true, data: result };
  }

  @Post('interview-report/:interviewId')
  @ApiOperation({ summary: 'Generate full AI interview report' })
  async generateReport(@Param('interviewId') interviewId: string) {
    const report = await this.aiService.generateInterviewReport(interviewId);
    return { success: true, data: report };
  }

  @Post('generate-resume')
  @ApiOperation({ summary: 'AI generate professional resume from teacher profile' })
  async generateResume(@Body('teacherProfile') teacherProfile: object) {
    const resume = await this.aiService.generateResume(teacherProfile);
    return { success: true, data: { resume } };
  }
}
