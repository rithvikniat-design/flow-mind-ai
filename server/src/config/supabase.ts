import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = config.IS_SUPABASE_CONFIGURED
  ? createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
  : null;

if (supabase) {
  console.log('Supabase client initialized successfully.');
} else {
  console.log('Supabase credentials missing. Operating in persistent Mock Database mode.');
}
