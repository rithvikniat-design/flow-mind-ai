import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'flowmind_secret_jwt_key_123_456',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  GROK_API_KEY: process.env.GROK_API_KEY || '',
  IS_SUPABASE_CONFIGURED: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  IS_GROK_CONFIGURED: !!process.env.GROK_API_KEY,
};
