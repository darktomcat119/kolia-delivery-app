import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });
config(); // fallback to .env

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Admin client — bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Create a client scoped to a specific user's JWT
export function createSupabaseClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
