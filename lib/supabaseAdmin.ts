/**
 * Server-only Supabase admin client using the Service Role key.
 * This bypasses Row Level Security — NEVER import in client components.
 * Only use in Next.js Route Handlers (app/api/**) or Server Actions.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  // Only warn; don't throw — build still succeeds without it
  if (typeof window === 'undefined') {
    console.warn('[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is not set. Admin mutations will fail.');
  }
}

export const supabaseAdmin = createClient(supabaseUrl || '', serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
