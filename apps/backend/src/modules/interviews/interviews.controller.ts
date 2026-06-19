import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';

@ApiTags('Interviews')
@Controller({ path: 'interviews', version: '1' })
export class InterviewsController {
  constructor(private readonly service: InterviewsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
