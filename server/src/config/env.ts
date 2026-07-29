import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'GROQ_API_KEY',
  'RESEND_API_KEY',
  'CLIENT_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  mongodbUri: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  groqApiKey: process.env.GROQ_API_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  clientUrl: process.env.CLIENT_URL!,
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  fromEmail: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
};
