import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GigsService } from './gigs.service';

@ApiTags('Gigs')
@Controller({ path: 'gigs', version: '1' })
export class GigsController {
  constructor(private readonly service: GigsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
