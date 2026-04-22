// Bot role system — controls what each user can access
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type BotRole = 'visitor' | 'member' | 'staff' | 'admin';

const ROLE_RANK: Record<BotRole, number> = {
  visitor: 0,
  member: 1,
  staff: 2,
  admin: 3,
};

export function hasRole(userRole: BotRole, required: BotRole): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}

export async function getRole(telegram_user_id: number): Promise<BotRole> {
  const { data } = await getSupabaseClient()
    .from('bot_roles')
    .select('role')
    .eq('telegram_user_id', telegram_user_id)
    .single();
  return (data?.role as BotRole) ?? 'visitor';
}

export async function setRole(
  telegram_user_id: number,
  first_name: string,
  username: string | null,
  role: BotRole,
  promoted_by: number
): Promise<void> {
  await getSupabaseClient().from('bot_roles').upsert({
    telegram_user_id,
    first_name,
    username,
    role,
    promoted_by,
    promoted_at: new Date().toISOString(),
  });
}

export async function ensureVisitor(
  telegram_user_id: number,
  first_name: string,
  username: string | null
): Promise<BotRole> {
  const { data } = await getSupabaseClient()
    .from('bot_roles')
    .select('role')
    .eq('telegram_user_id', telegram_user_id)
    .single();

  if (!data) {
    await getSupabaseClient().from('bot_roles').insert({
      telegram_user_id,
      first_name,
      username,
      role: 'visitor',
    });
    return 'visitor';
  }
  return data.role as BotRole;
}
