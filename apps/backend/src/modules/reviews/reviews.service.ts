import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  async findAll() {
    return { success: true, data: [], message: 'Reviews module - implement as needed' };
  }
}
