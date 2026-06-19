import { Controller, Get, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SchoolsService } from './schools.service';

@ApiTags('Schools')
@Controller({ path: 'schools', version: '1' })
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  @ApiOperation({ summary: 'Browse verified schools' })
  async findAll(@Query() query: any) {
    return this.schoolsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school public profile' })
  async findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Get('dashboard/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get school dashboard metrics' })
  async getDashboard(@Request() req) {
    return this.schoolsService.getDashboard(req.user.userId);
  }

  @Patch('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update school profile' })
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.schoolsService.updateProfile(req.user.userId, updateData);
  }
}
