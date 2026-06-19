import { Injectable } from '@nestjs/common';

@Injectable()
export class SkillTestsService {
  async findAll() {
    return { success: true, data: [], message: 'SkillTests module - implement as needed' };
  }
}
