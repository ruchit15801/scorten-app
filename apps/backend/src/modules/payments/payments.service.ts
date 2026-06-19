import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async findAll() {
    return { success: true, data: [], message: 'Payments module - implement as needed' };
  }
}
