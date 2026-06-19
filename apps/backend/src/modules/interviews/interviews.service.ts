import { Injectable } from '@nestjs/common';

@Injectable()
export class InterviewsService {
  async findAll() {
    return { success: true, data: [], message: 'Interviews module - implement as needed' };
  }
}
