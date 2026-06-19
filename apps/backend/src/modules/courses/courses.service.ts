import { Injectable } from '@nestjs/common';

@Injectable()
export class CoursesService {
  async findAll() {
    return { success: true, data: [], message: 'Courses module - implement as needed' };
  }
}
