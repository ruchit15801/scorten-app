import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument, JobStatus } from '../../schemas/job.schema';
import { School, SchoolDocument } from '../../schemas/school.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  async findAll(filters: JobFilterDto) {
    const query: any = { status: JobStatus.ACTIVE };

    if (filters.subjects?.length) query.subjects = { $in: filters.subjects };
    if (filters.city) query.city = new RegExp(filters.city, 'i');
    if (filters.state) query.state = new RegExp(filters.state, 'i');
    if (filters.jobType) query.jobType = filters.jobType;
    if (filters.board) query.board = filters.board;
    if (filters.experienceMin !== undefined) query.experienceMin = { $lte: filters.experienceMin };
    if (filters.salaryMin) query.salaryMax = { $gte: filters.salaryMin };
    if (filters.search) {
      query.$or = [
        { title: new RegExp(filters.search, 'i') },
        { description: new RegExp(filters.search, 'i') },
        { subjects: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      this.jobModel
        .find(query)
        .populate('schoolId', 'schoolName city state logoUrl rating')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.jobModel.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string) {
    const job = await this.jobModel
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .populate('schoolId', 'schoolName city state logoUrl rating description website');

    if (!job) throw new NotFoundException('Job not found');

    return { success: true, data: job };
  }

  async create(createJobDto: CreateJobDto, userId: string) {
    const school = await this.schoolModel.findOne({ userId });
    if (!school) throw new ForbiddenException('Only schools can post jobs');

    const job = await this.jobModel.create({
      ...createJobDto,
      schoolId: school._id,
      postedBy: userId,
    });

    await this.schoolModel.findByIdAndUpdate(school._id, {
      $inc: { totalJobsPosted: 1 },
    });

    return { success: true, data: job, message: 'Job posted successfully' };
  }

  async update(id: string, updateJobDto: UpdateJobDto, userId: string) {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    if (job.postedBy.toString() !== userId) throw new ForbiddenException('Access denied');

    const updated = await this.jobModel.findByIdAndUpdate(id, updateJobDto, { new: true });
    return { success: true, data: updated };
  }

  async remove(id: string, userId: string) {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    if (job.postedBy.toString() !== userId) throw new ForbiddenException('Access denied');

    await this.jobModel.findByIdAndUpdate(id, { status: JobStatus.CLOSED });
    return { success: true, message: 'Job closed successfully' };
  }

  async getSchoolJobs(userId: string) {
    const school = await this.schoolModel.findOne({ userId });
    if (!school) throw new NotFoundException('School not found');

    const jobs = await this.jobModel
      .find({ schoolId: school._id })
      .sort({ createdAt: -1 });

    return { success: true, data: jobs };
  }

  async togglePause(id: string, userId: string) {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    if (job.postedBy.toString() !== userId) throw new ForbiddenException('Access denied');

    const newStatus = job.status === JobStatus.ACTIVE ? JobStatus.PAUSED : JobStatus.ACTIVE;
    const updated = await this.jobModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });

    return { success: true, data: updated, message: `Job ${newStatus}` };
  }
}
