import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.resendApiKey);

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${env.clientUrl}/verify-email?token=${token}`;

  await resend.emails.send({
    from: env.fromEmail,
    to,
    subject: 'Verify your email address',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f0f; color: #fff; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a2a;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 24px;">✦</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #fff;">Verify your email</h1>
            </div>
            <p style="color: #a0a0a0; line-height: 1.6; margin-bottom: 32px;">
              Hi ${name}, click the button below to verify your email address and activate your account.
            </p>
            <a href="${verifyUrl}" style="display: block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 16px; margin-bottom: 32px;">
              Verify Email Address
            </a>
            <p style="color: #666; font-size: 13px; text-align: center;">
              This link expires in 24 hours. If you didn't create an account, you can ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;

  await resend.emails.send({
    from: env.fromEmail,
    to,
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f0f; color: #fff; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a2a;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #fff;">Reset your password</h1>
            </div>
            <p style="color: #a0a0a0; line-height: 1.6; margin-bottom: 32px;">
              Hi ${name}, click the button below to reset your password. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display: block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 16px; margin-bottom: 32px;">
              Reset Password
            </a>
            <p style="color: #666; font-size: 13px; text-align: center;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}
