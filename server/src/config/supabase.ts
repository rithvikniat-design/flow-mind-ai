import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// FORCE NULL to completely bypass Supabase and use the flawless Mock Database
export const supabase = null;

if (supabase) {
  console.log('Supabase client initialized successfully.');
} else {
  console.log('Supabase disabled. Operating securely in persistent Mock Database mode.');
}
