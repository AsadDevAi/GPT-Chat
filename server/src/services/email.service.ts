import { BrevoClient } from '@getbrevo/brevo';
import { env } from '../config/env';

// v6 versiyasi uchun to'g'ri chaqiriq
const apiInstance = new BrevoClient({ apiKey: process.env.BREVO_API_KEY || '' });

export async function sendVerificationEmail(to: string, code: string): Promise<any> {
  try {
    const data = await apiInstance.transactionalEmails.sendTransacEmail({
      subject: "Emailingizni tasdiqlang - GPT Chat",
      to: [{ email: to }],
      sender: {
        name: "GPT Chat",
        email: process.env.SENDER_EMAIL || "asadbekyusupov714@gmail.com"
      },
      htmlContent: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>GPT Chat ga xush kelibsiz!</h2>
          <p>Akkountingizni tasdiqlash kodi:</p>
          <h1 style="color: #7c3aed; letter-spacing: 4px;">${code}</h1>
        </div>
      `
    });

    console.log('Brevo Email Success:', data);
    return data;
  } catch (error) {
    console.error('Brevo Email Error:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(to: string, code: string): Promise<any> {
  try {
    const data = await apiInstance.transactionalEmails.sendTransacEmail({
      subject: "Parolni tiklash - GPT Chat",
      to: [{ email: to }],
      sender: {
        name: "GPT Chat",
        email: process.env.SENDER_EMAIL || "asadbekyusupov714@gmail.com"
      },
      htmlContent: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Parolni tiklash</h2>
          <p>Sizning parolni tiklash kodingiz:</p>
          <h1 style="color: #7c3aed; letter-spacing: 4px;">${code}</h1>
        </div>
      `
    });
    console.log('Brevo Reset Email Success:', data);
    return data;
  } catch (error) {
    console.error('Brevo Reset Email Error:', error);
    throw error;
  }
}
