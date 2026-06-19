import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(query: any) {
    const filter: any = { profileVisible: true };

    if (query.subjects) filter.subjects = { $in: Array.isArray(query.subjects) ? query.subjects : [query.subjects] };
    if (query.city) filter.city = new RegExp(query.city, 'i');
    if (query.state) filter.state = new RegExp(query.state, 'i');
    if (query.experienceMin) filter.totalExperience = { $gte: query.experienceMin };
    if (query.openToWork === 'true') filter.isOpenToWork = true;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;

    const [teachers, total] = await Promise.all([
      this.teacherModel
        .find(filter)
        .populate('userId', 'firstName lastName avatar email phone')
        .sort({ scortenReputationScore: -1, isFeatured: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.teacherModel.countDocuments(filter),
    ]);

    return {
      success: true,
      data: {
        teachers,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async findOne(id: string) {
    const teacher = await this.teacherModel
      .findById(id)
      .populate('userId', 'firstName lastName avatar');

    if (!teacher) throw new NotFoundException('Teacher not found');
    return { success: true, data: teacher };
  }

  async getMyProfile(userId: string) {
    const teacher = await this.teacherModel
      .findOne({ userId })
      .populate('userId', 'firstName lastName avatar email phone');

    if (!teacher) throw new NotFoundException('Teacher profile not found');
    return { success: true, data: teacher };
  }

  async updateProfile(userId: string, updateData: any) {
    const teacher = await this.teacherModel.findOneAndUpdate(
      { userId },
      { ...updateData },
      { new: true, upsert: true },
    );

    // Check profile completeness
    const isComplete = !!(
      teacher.bio &&
      teacher.subjects?.length &&
      teacher.experience?.length &&
      teacher.education?.length
    );

    await this.userModel.findByIdAndUpdate(userId, { isProfileComplete: isComplete });

    return { success: true, data: teacher, message: 'Profile updated' };
  }

  async toggleAvailability(userId: string) {
    const teacher = await this.teacherModel.findOne({ userId });
    if (!teacher) throw new NotFoundException('Teacher not found');

    teacher.isOpenToWork = !teacher.isOpenToWork;
    await teacher.save();

    return {
      success: true,
      data: { isOpenToWork: teacher.isOpenToWork },
      message: teacher.isOpenToWork ? 'You are now open to work' : 'You are no longer open to work',
    };
  }
}
