import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import Twilio from 'twilio';

interface OtpEntry {
  otp: string;
  purpose: string;
  expiresAt: Date;
  attempts: number;
}

@Injectable()
export class OtpService {
  private otpStore: Map<string, OtpEntry> = new Map();
  // private twilioClient: Twilio.Twilio;

  constructor(private configService: ConfigService) {
    // this.twilioClient = Twilio(
    //   configService.get('TWILIO_ACCOUNT_SID'),
    //   configService.get('TWILIO_AUTH_TOKEN'),
    // );
  }

  /**
   * Generate and send OTP
   */
  async sendOtp(phoneOrEmail: string, purpose: string): Promise<void> {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.otpStore.set(`${phoneOrEmail}_${purpose}`, {
      otp,
      purpose,
      expiresAt,
      attempts: 0,
    });

    // In development, log OTP
    if (this.configService.get('NODE_ENV') !== 'production') {
      console.log(`[OTP] ${phoneOrEmail} - ${purpose}: ${otp}`);
    } else {
      // Send via Twilio SMS
      // await this.twilioClient.messages.create({
      //   body: `Your Scorten OTP is: ${otp}. Valid for 10 minutes.`,
      //   from: this.configService.get('TWILIO_PHONE_NUMBER'),
      //   to: phoneOrEmail,
      // });
    }
  }

  /**
   * Verify OTP
   */
  async verifyOtp(phoneOrEmail: string, otp: string, purpose?: string): Promise<boolean> {
    // Try all purposes if not specified
    const purposes = purpose ? [purpose] : ['login', 'verification', 'password_reset'];

    for (const p of purposes) {
      const key = `${phoneOrEmail}_${p}`;
      const entry = this.otpStore.get(key);

      if (!entry) continue;

      // Check expiry
      if (new Date() > entry.expiresAt) {
        this.otpStore.delete(key);
        continue;
      }

      // Check attempts
      if (entry.attempts >= 3) {
        this.otpStore.delete(key);
        return false;
      }

      if (entry.otp === otp) {
        this.otpStore.delete(key);
        return true;
      }

      entry.attempts++;
    }

    return false;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
