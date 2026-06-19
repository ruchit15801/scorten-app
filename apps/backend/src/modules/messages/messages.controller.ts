import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
