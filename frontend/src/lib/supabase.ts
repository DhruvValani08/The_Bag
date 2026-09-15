import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.error('Supabase URL is missing. Check .env');
}
if (!supabaseAnonKey) {
  console.error('Supabase anon key is missing. Check .env');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

