import { Injectable } from '@nestjs/common';

@Injectable()
export class GigsService {
  async findAll() {
    return { success: true, data: [], message: 'Gigs module - implement as needed' };
  }
}
