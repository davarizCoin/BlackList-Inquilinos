import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vwvgzmveehzhmwrgvpug.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uCem4zx9CIhPUYbdcSXyFw_twGGodo0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
