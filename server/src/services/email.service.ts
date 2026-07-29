import { BrevoClient } from '@getbrevo/brevo';
import { env } from '../config/env';

const apiInstance = new BrevoClient({ apiKey: process.env.BREVO_API_KEY || '' });

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const verifyUrl = `${env.clientUrl}/verify-email?token=${token}`;

  await apiInstance.transactionalEmails.sendTransacEmail({
    subject: "Emailingizni tasdiqlang - GPT Chat",
    to: [{ email: to }],
    sender: { 
      name: "GPT Chat", 
      email: env.fromEmail || "asadbekyusupov.info@gmail.com" 
    },
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Xush kelibsiz!</h2>
        <p>Akkountingizni tasdiqlash uchun quyidagi kodni kiriting yoki havolaga o'ting:</p>
        <h1 style="color: #7c3aed; letter-spacing: 4px; word-break: break-all;">${token}</h1>
        <br/>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 8px;">Akkountni tasdiqlash</a>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;

  await apiInstance.transactionalEmails.sendTransacEmail({
    subject: "Parolni tiklash - GPT Chat",
    to: [{ email: to }],
    sender: { 
      name: "GPT Chat", 
      email: env.fromEmail || "asadbekyusupov.info@gmail.com" 
    },
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Parolni tiklash</h2>
        <p>Salom ${name}, parolingizni tiklash uchun quyidagi tugmani bosing:</p>
        <br/>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 8px;">Parolni tiklash</a>
      </div>
    `
  });
}
