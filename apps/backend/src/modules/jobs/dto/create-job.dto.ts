import { IsString, IsArray, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobType } from '../../../schemas/job.schema';

export class CreateJobDto {
  @ApiProperty({ example: 'Mathematics Teacher - Grade 9-12' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ example: ['Mathematics', 'Statistics'] })
  @IsArray()
  subjects: string[];

  @ApiProperty({ example: 'CBSE' })
  @IsOptional()
  @IsString()
  board?: string;

  @ApiProperty({ example: ['9', '10', '11', '12'] })
  @IsOptional()
  @IsArray()
  classes?: string[];

  @ApiProperty({ enum: JobType })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiProperty({ example: 30000 })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiProperty({ example: 50000 })
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @ApiProperty({ example: 'New Delhi' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Delhi' })
  @IsString()
  state: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  experienceMin: number;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  experienceMax?: number;

  @ApiProperty({ example: ['B.Ed', 'M.Sc Mathematics'] })
  @IsOptional()
  @IsArray()
  qualifications?: string[];

  @ApiProperty({ example: 3 })
  @IsOptional()
  @IsNumber()
  openings?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  aiScreeningEnabled?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  aiInterviewEnabled?: boolean;
}
