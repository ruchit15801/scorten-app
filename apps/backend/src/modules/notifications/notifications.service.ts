import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async findAll() {
    return { success: true, data: [], message: 'Notifications module - implement as needed' };
  }
}
