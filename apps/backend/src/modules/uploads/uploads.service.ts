import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  async findAll() {
    return { success: true, data: [], message: 'Uploads module - implement as needed' };
  }
}
