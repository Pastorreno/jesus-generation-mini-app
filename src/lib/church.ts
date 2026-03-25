// 242Go — Church Config Loader
// Resolves which church is active based on the bot token or env var
// Supports both cloud (one Supabase project, church_id filtering)
// and self-hosted (one env var per church instance)

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface ChurchConfig {
  church_id: string;
  name: string;
  pastor_name: string | null;
  bot_token: string;
  admin_telegram_ids: number[];
  app_url: string;
  notion_api_key: string | null;
  notion_database_id: string | null;
}

// ─────────────────────────────────────────────
// GET church config
// Self-hosted: reads from env vars (CHURCH_ID)
// Cloud/SaaS: looks up by bot token
// ─────────────────────────────────────────────
export async function getChurchConfig(bot_token?: string): Promise<ChurchConfig> {
  // Self-hosted: church_id is set as an env var per deployment
  const envChurchId = process.env.CHURCH_ID;

  if (envChurchId) {
    // Pull from DB or fall back to env vars entirely
    const { data } = await supabase
      .from('churches')
      .select('*')
      .eq('church_id', envChurchId)
      .single();

    if (data) {
      return {
        church_id: data.church_id,
        name: data.name,
        pastor_name: data.pastor_name,
        bot_token: data.bot_token ?? process.env.TELEGRAM_BOT_TOKEN!,
        admin_telegram_ids: data.admin_telegram_ids
          ? data.admin_telegram_ids.split(',').map(Number)
          : parseAdminIds(),
        app_url: data.app_url ?? process.env.NEXT_PUBLIC_APP_URL ?? '',
        notion_api_key: data.notion_api_key ?? process.env.NOTION_API_KEY ?? null,
        notion_database_id: data.notion_database_id ?? process.env.NOTION_DATABASE_ID ?? null,
      };
    }
  }

  // Cloud SaaS: resolve by bot token (each church has a unique bot)
  if (bot_token) {
    const { data } = await supabase
      .from('churches')
      .select('*')
      .eq('bot_token', bot_token)
      .single();

    if (data) {
      return {
        church_id: data.church_id,
        name: data.name,
        pastor_name: data.pastor_name,
        bot_token: data.bot_token,
        admin_telegram_ids: data.admin_telegram_ids
          ? data.admin_telegram_ids.split(',').map(Number)
          : [],
        app_url: data.app_url ?? '',
        notion_api_key: data.notion_api_key ?? null,
        notion_database_id: data.notion_database_id ?? null,
      };
    }
  }

  // Fallback: use env vars (single-church deployment)
  return {
    church_id: process.env.CHURCH_ID ?? 'jesus-generation',
    name: process.env.CHURCH_NAME ?? 'Jesus Generation',
    pastor_name: process.env.PASTOR_NAME ?? null,
    bot_token: process.env.TELEGRAM_BOT_TOKEN!,
    admin_telegram_ids: parseAdminIds(),
    app_url: process.env.NEXT_PUBLIC_APP_URL ?? '',
    notion_api_key: process.env.NOTION_API_KEY ?? null,
    notion_database_id: process.env.NOTION_DATABASE_ID ?? null,
  };
}

function parseAdminIds(): number[] {
  return process.env.ADMIN_TELEGRAM_IDS
    ? process.env.ADMIN_TELEGRAM_IDS.split(',').map(Number)
    : [];
}

// ─────────────────────────────────────────────
// REGISTER a new church (called during onboarding)
// ─────────────────────────────────────────────
export async function registerChurch(config: {
  church_id: string;
  name: string;
  pastor_name: string;
  city: string;
  state: string;
  bot_token: string;
  bot_username: string;
  admin_telegram_ids: string;
  app_url: string;
  hosting_type: 'cloud' | 'mac_mini' | 'mini_pc';
  notion_api_key?: string;
  notion_database_id?: string;
}): Promise<void> {
  const { error } = await supabase
    .from('churches')
    .upsert(config, { onConflict: 'church_id' });

  if (error) throw new Error(`registerChurch failed: ${error.message}`);
}

// ─────────────────────────────────────────────
// LIST all active churches (GGI Hub use)
// ─────────────────────────────────────────────
export async function listChurches() {
  const { data } = await supabase
    .from('churches')
    .select('church_id, name, pastor_name, city, state, hosting_type, joined_at')
    .eq('active', true)
    .order('joined_at', { ascending: true });
  return data ?? [];
}
