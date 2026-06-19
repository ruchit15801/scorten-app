import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument, SchoolStatus } from '../../schemas/school.schema';
import { Job, JobDocument, JobStatus } from '../../schemas/job.schema';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
  ) {}

  async findAll(query: any) {
    const filter: any = { verificationStatus: SchoolStatus.VERIFIED };
    if (query.city) filter.city = new RegExp(query.city, 'i');
    if (query.state) filter.state = new RegExp(query.state, 'i');
    if (query.schoolType) filter.schoolType = query.schoolType;

    const schools = await this.schoolModel
      .find(filter)
      .select('-documents')
      .sort({ isFeatured: -1, rating: -1 });

    return { success: true, data: schools };
  }

  async findOne(id: string) {
    const school = await this.schoolModel.findById(id).select('-documents');
    if (!school) throw new NotFoundException('School not found');
    return { success: true, data: school };
  }

  async getDashboard(userId: string) {
    const school = await this.schoolModel.findOne({ userId });
    if (!school) throw new NotFoundException('School not found');

    const [openJobs, totalApplications] = await Promise.all([
      this.jobModel.countDocuments({ schoolId: school._id, status: JobStatus.ACTIVE }),
      this.jobModel.aggregate([
        { $match: { schoolId: school._id } },
        { $group: { _id: null, total: { $sum: '$totalApplications' } } },
      ]),
    ]);

    return {
      success: true,
      data: {
        school,
        metrics: {
          openJobs,
          totalApplications: totalApplications[0]?.total || 0,
          totalHires: school.totalHires,
          aiCredits: school.aiCredits,
          isSubscribed: school.isSubscribed,
          subscriptionPlan: school.subscriptionPlan,
        },
      },
    };
  }

  async updateProfile(userId: string, updateData: any) {
    const school = await this.schoolModel.findOneAndUpdate(
      { userId },
      { ...updateData },
      { new: true },
    );
    if (!school) throw new NotFoundException('School not found');
    return { success: true, data: school };
  }
}
