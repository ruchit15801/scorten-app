import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole, AuthProvider } from '../../schemas/user.schema';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';
import { School, SchoolDocument } from '../../schemas/school.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpService } from './otp.service';

// ─── Scorten ID Generator ──────────────────────────────────────────────────────
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusable chars
function randomChars(len: number): string {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return result;
}
function makeSchoolSCortenId(): string {
  const year = new Date().getFullYear();
  const timePart = Date.now().toString(36).toUpperCase().slice(-3);
  const randPart = randomChars(2);
  return `SCH-${year}-${timePart}${randPart}`;
}


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    const { email, phone, password, role, firstName, lastName } = registerDto;

    // ── 1. Check for duplicate email / phone ────────────────────────────────
    const existingUser = await this.userModel.findOne({
      $or: [
        { email },
        ...(phone ? [{ phone }] : []),
      ],
    });
    if (existingUser) {
      throw new ConflictException('An account with this email or phone already exists');
    }

    // ── 2. For school: validate affiliation number uniqueness ───────────────
    if (role === UserRole.SCHOOL) {
      if (!registerDto.affiliationNumber || registerDto.affiliationNumber.trim().length < 5) {
        throw new BadRequestException('A valid affiliation/registration number is required for school registration');
      }
      if (!registerDto.schoolName || registerDto.schoolName.trim().length < 3) {
        throw new BadRequestException('School name is required');
      }
      const dupAff = await this.schoolModel.findOne({
        affiliationNumber: registerDto.affiliationNumber.trim().toUpperCase(),
      });
      if (dupAff) {
        throw new ConflictException(
          'A school with this affiliation number is already registered. If this is your school, please sign in.',
        );
      }
    }

    // ── 3. Hash password ────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── 4. Create User record ───────────────────────────────────────────────
    const user = await this.userModel.create({
      firstName: role === UserRole.SCHOOL ? (registerDto.principalName || registerDto.schoolName || 'School') : firstName,
      lastName:  role === UserRole.SCHOOL ? 'Admin' : (lastName || ''),
      email,
      phone,
      password: hashedPassword,
      role,
      authProvider: AuthProvider.LOCAL,
    });

    // ── 5. Create role-specific profile ────────────────────────────────────
    let schoolProfile: any = null;

    if (role === UserRole.TEACHER) {
      await this.teacherModel.create({ userId: user._id });

    } else if (role === UserRole.SCHOOL) {
      // Generate a server-side guaranteed-unique Scorten ID
      const scortenId = await this.generateUniqueSCortenId(
        registerDto.scortenId, // use client suggestion if provided
      );

      schoolProfile = await this.schoolModel.create({
        userId:            user._id,
        scortenId,
        schoolName:        registerDto.schoolName!.trim(),
        affiliationNumber: registerDto.affiliationNumber!.trim().toUpperCase(),
        board:             registerDto.board || 'CBSE',
        principalName:     registerDto.principalName?.trim() || '',
        city:              registerDto.city?.trim() || '',
        state:             registerDto.state?.trim() || '',
        address:           registerDto.city?.trim() || '',
      });
    }

    // ── 6. Send verification OTP ────────────────────────────────────────────
    if (phone) {
      await this.otpService.sendOtp(phone, 'verification');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.role, user.email);

    return {
      success: true,
      message: role === UserRole.SCHOOL
        ? `School registered! Your Scorten ID is ${schoolProfile?.scortenId}.`
        : 'Registration successful. Please verify your phone number.',
      data: {
        user: this.sanitizeUser(user),
        ...(schoolProfile ? { scortenId: schoolProfile.scortenId, schoolProfile } : {}),
        ...tokens,
      },
    };
  }

  /**
   * Login with email & password
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel
      .findOne({ email })
      .select('+password +refreshToken');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('Your account has been suspended. Contact support.');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = await this.generateTokens(user._id.toString(), user.role, user.email);
    await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: this.sanitizeUser(user),
        ...tokens,
      },
    };
  }

  /**
   * Send OTP to phone
   */
  async sendOtp(phone: string) {
    await this.otpService.sendOtp(phone, 'login');
    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  /**
   * Verify OTP and login / register
   */
  async verifyOtp(otpVerifyDto: OtpVerifyDto) {
    const { phone, otp, role } = otpVerifyDto;

    const isValid = await this.otpService.verifyOtp(phone, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    let user = await this.userModel.findOne({ phone });

    if (!user) {
      // Auto-register via OTP
      user = await this.userModel.create({
        firstName: 'User',
        lastName: '',
        phone,
        email: `${phone}@scorten.temp`,
        role: role || UserRole.TEACHER,
        isPhoneVerified: true,
        authProvider: AuthProvider.LOCAL,
      });

      if (user.role === UserRole.TEACHER) {
        await this.teacherModel.create({ userId: user._id });
      }
    } else {
      user.isPhoneVerified = true;
      user.lastLoginAt = new Date();
      await user.save();
    }

    const tokens = await this.generateTokens(user._id.toString(), user.role, user.email);
    await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: this.sanitizeUser(user),
        ...tokens,
        isNewUser: !user.isProfileComplete,
      },
    };
  }

  /**
   * Google login
   */
  async googleLogin(token: string, role: string) {
    // Verify Google token (simplified - use google-auth-library in production)
    const googleUser = await this.verifyGoogleToken(token);

    let user = await this.userModel.findOne({ googleId: googleUser.sub });

    if (!user) {
      user = await this.userModel.findOne({ email: googleUser.email });
      if (user) {
        user.googleId = googleUser.sub;
        user.authProvider = AuthProvider.GOOGLE;
        await user.save();
      } else {
        user = await this.userModel.create({
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          email: googleUser.email,
          googleId: googleUser.sub,
          role: role || UserRole.TEACHER,
          isEmailVerified: true,
          authProvider: AuthProvider.GOOGLE,
          avatar: googleUser.picture,
        });

        if (user.role === UserRole.TEACHER) {
          await this.teacherModel.create({ userId: user._id });
        } else if (user.role === UserRole.SCHOOL) {
          await this.schoolModel.create({
            userId: user._id,
            schoolName: `${user.firstName}'s School`,
            address: '',
            city: '',
            state: '',
          });
        }
      }
    }

    const tokens = await this.generateTokens(user._id.toString(), user.role, user.email);
    await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      success: true,
      message: 'Google login successful',
      data: {
        user: this.sanitizeUser(user),
        ...tokens,
        isNewUser: !user.isProfileComplete,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userModel.findById(payload.sub).select('+refreshToken');
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user._id.toString(), user.role, user.email);
      await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);

      return {
        success: true,
        data: tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }

    await this.otpService.sendOtp(user.phone || email, 'password_reset');

    return {
      success: true,
      message: 'Password reset OTP sent',
    };
  }

  /**
   * Reset password
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.otpService.verifyOtp(user.phone || email, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.refreshToken = null;
    await user.save();

    return {
      success: true,
      message: 'Password reset successful',
    };
  }

  /**
   * Get current user
   */
  async getMe(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    let profile = null;
    if (user.role === UserRole.TEACHER) {
      profile = await this.teacherModel.findOne({ userId });
    } else if (user.role === UserRole.SCHOOL) {
      profile = await this.schoolModel.findOne({ userId });
    }

    return {
      success: true,
      data: {
        user: this.sanitizeUser(user),
        profile,
      },
    };
  }

  /**
   * Logout
   */
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Update FCM token
   */
  async updateFcmToken(userId: string, fcmToken: string) {
    await this.userModel.findByIdAndUpdate(userId, { fcmToken });
    return { success: true, message: 'FCM token updated' };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private async generateTokens(userId: string, role: string, email: string) {
    const payload = { sub: userId, role, email };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashed });
  }

  private sanitizeUser(user: UserDocument) {
    const obj = user.toObject();
    const { password, refreshToken, ...sanitized } = obj;
    return sanitized;
  }

  /**
   * Generate a Scorten School ID that is guaranteed unique in the DB.
   * Tries the client-provided ID first; on collision generates a fresh one.
   * Retries up to 5 times.
   */
  private async generateUniqueSCortenId(suggested?: string): Promise<string> {
    const MAX_ATTEMPTS = 5;

    // Validate and try the suggested ID first
    if (suggested && /^SCH-\d{4}-[A-Z0-9]{5}$/.test(suggested.toUpperCase())) {
      const exists = await this.schoolModel.findOne({ scortenId: suggested.toUpperCase() });
      if (!exists) return suggested.toUpperCase();
    }

    // Generate fresh IDs until unique
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const id = makeSchoolSCortenId();
      const exists = await this.schoolModel.findOne({ scortenId: id });
      if (!exists) return id;
      // tiny wait to shift the timestamp-based suffix
      await new Promise(r => setTimeout(r, 5));
    }

    // Extremely unlikely but safe fallback
    throw new ConflictException('Could not generate a unique Scorten ID. Please try again.');
  }

  private async verifyGoogleToken(token: string): Promise<any> {
    // In production, use: const { OAuth2Client } = require('google-auth-library')
    // For now, decode the JWT token directly (simplified)
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    );
    return decoded;
  }
}
