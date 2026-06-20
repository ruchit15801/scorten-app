import {
  IsEmail, IsString, IsEnum, MinLength,
  IsOptional, IsMobilePhone, Matches, Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../schemas/user.schema';

export class RegisterDto {
  // ─── Teacher Fields ──────────────────────────────────────────────────────────
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  // ─── School Fields ───────────────────────────────────────────────────────────
  @ApiProperty({ example: 'Delhi Public School', required: false })
  @IsOptional()
  @IsString()
  schoolName?: string;

  /**
   * Official government affiliation / UDISE / registration number.
   * Minimum 5 characters.
   */
  @ApiProperty({ example: '2730001', required: false })
  @IsOptional()
  @IsString()
  @Length(5, 50, { message: 'Affiliation number must be 5–50 characters' })
  affiliationNumber?: string;

  @ApiProperty({ example: 'CBSE', required: false })
  @IsOptional()
  @IsString()
  board?: string;

  @ApiProperty({ example: 'Dr. Ramesh Kumar', required: false })
  @IsOptional()
  @IsString()
  principalName?: string;

  @ApiProperty({ example: 'New Delhi', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Delhi', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  /**
   * Client-generated Scorten ID (SCH-YYYY-XXXXX).
   * Backend will validate format and guarantee uniqueness;
   * if collision detected, backend will regenerate.
   */
  @ApiProperty({ example: 'SCH-2026-A3F7K', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(SCH|TCH)-\d{4}-[A-Z0-9]{5}$/, {
    message: 'scortenId must match format SCH-YYYY-XXXXX',
  })
  scortenId?: string;

  // ─── Common Fields ───────────────────────────────────────────────────────────
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @ApiProperty({ example: 'StrongPass@123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.TEACHER })
  @IsEnum(UserRole)
  role: UserRole;
}
