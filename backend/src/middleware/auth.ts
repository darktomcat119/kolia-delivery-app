import type { Context, Next } from 'hono';
import { supabaseAdmin } from '../lib/supabase.js';
import type { AuthUser } from '../types/index.js';

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing authorization token', code: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' }, 401);
  }

  // Fetch profile for role
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  c.set('user', {
    id: user.id,
    email: user.email!,
    role: profile?.role ?? 'customer',
  });

  await next();
}
