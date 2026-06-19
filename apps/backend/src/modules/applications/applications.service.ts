import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus } from '../../schemas/application.schema';
import { Job, JobDocument } from '../../schemas/job.schema';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';
import { School, SchoolDocument } from '../../schemas/school.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  async apply(jobId: string, userId: string, coverLetter: string) {
    const job = await this.jobModel.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'active') throw new BadRequestException('This job is no longer accepting applications');

    const teacher = await this.teacherModel.findOne({ userId });
    if (!teacher) throw new NotFoundException('Teacher profile not found');

    const existing = await this.applicationModel.findOne({ jobId, teacherId: teacher._id });
    if (existing) throw new ConflictException('You have already applied for this job');

    const application = await this.applicationModel.create({
      jobId,
      teacherId: teacher._id,
      userId,
      schoolId: job.schoolId,
      status: ApplicationStatus.APPLIED,
      coverLetter,
      resumeUrl: teacher.resumeUrl,
      statusHistory: [{ status: ApplicationStatus.APPLIED, changedAt: new Date() }],
    });

    await this.jobModel.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });

    return { success: true, data: application, message: 'Application submitted successfully' };
  }

  async getTeacherApplications(userId: string, status?: string) {
    const teacher = await this.teacherModel.findOne({ userId });
    if (!teacher) throw new NotFoundException('Teacher not found');

    const query: any = { teacherId: teacher._id };
    if (status) query.status = status;

    const applications = await this.applicationModel
      .find(query)
      .populate('jobId', 'title city state salaryMin salaryMax subjects')
      .populate('schoolId', 'schoolName logoUrl city')
      .sort({ createdAt: -1 });

    return { success: true, data: applications };
  }

  async getJobApplications(jobId: string, status?: string) {
    const query: any = { jobId };
    if (status) query.status = status;

    const applications = await this.applicationModel
      .find(query)
      .populate('teacherId')
      .populate({
        path: 'userId',
        select: 'firstName lastName avatar phone email',
      })
      .sort({ aiScreeningScore: -1, createdAt: -1 });

    return { success: true, data: applications };
  }

  async findOne(id: string) {
    const application = await this.applicationModel
      .findById(id)
      .populate('jobId')
      .populate('teacherId')
      .populate('schoolId', 'schoolName logoUrl');

    if (!application) throw new NotFoundException('Application not found');
    return { success: true, data: application };
  }

  async updateStatus(id: string, status: string, note: string, changedBy: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) throw new NotFoundException('Application not found');

    application.status = status as ApplicationStatus;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      note,
      changedBy: changedBy as any,
    });

    await application.save();
    return { success: true, data: application, message: `Application ${status}` };
  }

  async sendOffer(id: string, offerData: any, userId: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) throw new NotFoundException('Application not found');

    application.status = ApplicationStatus.OFFER_SENT;
    application.offer = {
      ...offerData,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    application.statusHistory.push({
      status: ApplicationStatus.OFFER_SENT,
      changedAt: new Date(),
      note: 'Offer letter sent',
      changedBy: userId as any,
    });

    await application.save();
    return { success: true, data: application, message: 'Offer sent successfully' };
  }

  async respondToOffer(id: string, action: 'accept' | 'reject', signature: string, userId: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== ApplicationStatus.OFFER_SENT) {
      throw new BadRequestException('No pending offer found');
    }

    if (action === 'accept') {
      application.status = ApplicationStatus.OFFER_ACCEPTED;
      application.offer.acceptedAt = new Date();
      application.offer.digitalSignature = signature;
    } else {
      application.status = ApplicationStatus.OFFER_REJECTED;
      application.offer.rejectedAt = new Date();
    }

    application.statusHistory.push({
      status: application.status,
      changedAt: new Date(),
      note: `Offer ${action}ed by teacher`,
      changedBy: userId as any,
    });

    await application.save();

    if (action === 'accept') {
      await this.schoolModel.findByIdAndUpdate(application.schoolId, { $inc: { totalHires: 1 } });
    }

    return { success: true, data: application, message: `Offer ${action}ed` };
  }

  async withdraw(id: string, userId: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) throw new NotFoundException('Application not found');

    application.status = ApplicationStatus.WITHDRAWN;
    application.statusHistory.push({
      status: ApplicationStatus.WITHDRAWN,
      changedAt: new Date(),
      note: 'Withdrawn by teacher',
      changedBy: userId as any,
    });

    await application.save();
    return { success: true, message: 'Application withdrawn' };
  }
}
