import { Controller, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeachersService } from './teachers.service';

@ApiTags('Teachers')
@Controller({ path: 'teachers', version: '1' })
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'Search teachers with filters (for schools)' })
  async findAll(@Query() query: any) {
    return this.teachersService.findAll(query);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my teacher profile' })
  async getMyProfile(@Request() req) {
    return this.teachersService.getMyProfile(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher public profile' })
  async findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update my teacher profile' })
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.teachersService.updateProfile(req.user.userId, updateData);
  }

  @Patch('profile/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle open to work status' })
  async toggleAvailability(@Request() req) {
    return this.teachersService.toggleAvailability(req.user.userId);
  }
}
