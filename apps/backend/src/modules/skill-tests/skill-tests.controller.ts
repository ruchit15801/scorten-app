import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkillTestsService } from './skill-tests.service';

@ApiTags('SkillTests')
@Controller({ path: 'skill-tests', version: '1' })
export class SkillTestsController {
  constructor(private readonly service: SkillTestsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
