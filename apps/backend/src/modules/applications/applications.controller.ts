import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';

@ApiTags('Applications')
@Controller({ path: 'applications', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Teacher - Apply for job
  @Post('apply/:jobId')
  @ApiOperation({ summary: 'Apply for a job' })
  async apply(
    @Param('jobId') jobId: string,
    @Request() req,
    @Body('coverLetter') coverLetter: string,
  ) {
    return this.applicationsService.apply(jobId, req.user.userId, coverLetter);
  }

  // Teacher - Get my applications
  @Get('my-applications')
  @ApiOperation({ summary: 'Get all my job applications (teacher)' })
  async getMyApplications(@Request() req, @Query('status') status: string) {
    return this.applicationsService.getTeacherApplications(req.user.userId, status);
  }

  // Teacher - Withdraw application
  @Patch(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw a job application' })
  async withdraw(@Param('id') id: string, @Request() req) {
    return this.applicationsService.withdraw(id, req.user.userId);
  }

  // School - Get applications for a job
  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get all applications for a job (school)' })
  async getJobApplications(
    @Param('jobId') jobId: string,
    @Query('status') status: string,
  ) {
    return this.applicationsService.getJobApplications(jobId, status);
  }

  // School - Update application status
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update application status (school)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note: string,
    @Request() req,
  ) {
    return this.applicationsService.updateStatus(id, status, note, req.user.userId);
  }

  // School - Send offer
  @Post(':id/offer')
  @ApiOperation({ summary: 'Send job offer to teacher' })
  async sendOffer(@Param('id') id: string, @Body() offerData: any, @Request() req) {
    return this.applicationsService.sendOffer(id, offerData, req.user.userId);
  }

  // Teacher - Accept/Reject offer
  @Patch(':id/offer-response')
  @ApiOperation({ summary: 'Accept or reject a job offer (teacher)' })
  async respondToOffer(
    @Param('id') id: string,
    @Body('action') action: 'accept' | 'reject',
    @Body('signature') signature: string,
    @Request() req,
  ) {
    return this.applicationsService.respondToOffer(id, action, signature, req.user.userId);
  }

  // Get single application
  @Get(':id')
  @ApiOperation({ summary: 'Get application details' })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }
}
