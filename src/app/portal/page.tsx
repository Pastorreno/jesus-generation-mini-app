import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

type BotRole = 'visitor' | 'member' | 'staff' | 'admin';
const ROLE_RANK: Record<BotRole, number> = { visitor: 0, member: 1, staff: 2, admin: 3 };
function hasRole(userRole: BotRole, required: BotRole) {
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}

const LEVEL_COLOR: Record<number, { text: string; bg: string; bar: string }> = {
  1: { text: '#4a9eff', bg: '#0a1220', bar: '#4a9eff' },
  2: { text: '#44aa44', bg: '#0a1a0a', bar: '#44aa44' },
  3: { text: '#ffaa00', bg: '#1a1200', bar: '#ffaa00' },
  4: { text: '#ff6600', bg: '#1a0e00', bar: '#ff6600' },
  5: { text: '#cc0000', bg: '#1a0000', bar: '#cc0000' },
};

const LEVEL_NAMES: Record<number, string> = {
  1: 'Seeker', 2: 'Builder', 3: 'Cultivator', 4: 'Trainer', 5: 'Multiplier',
};

const DOMAIN_KEYS = [
  { key: 'score_bible_depth',    label: 'Bible' },
  { key: 'score_fasting_prayer', label: 'Fasting' },
  { key: 'score_consistency',    label: 'Consist.' },
  { key: 'score_discipleship',   label: 'Disciple' },
  { key: 'score_outreach',       label: 'Outreach' },
  { key: 'score_stewardship',    label: 'Steward' },
  { key: 'score_partnership',    label: 'Partner' },
  { key: 'score_coaching',       label: 'Coaching' },
];

type Leader = Record<string, number | string | boolean | null>;

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Auth user role
  const { data: myRecord } = await service
    .from('bot_roles')
    .select('*')
    .eq('email', user.email)
    .single();
  const myRole: BotRole = (myRecord?.role as BotRole) ?? 'visitor';

  if (!hasRole(myRole, 'staff')) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Access Pending</h2>
          <p style={{ color: '#555', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            A staff member or admin will grant you portal access.<br />
            Your role: <span style={{ color: '#fff' }}>{myRole}</span>
          </p>
        </div>
      </div>
    );
  }

  // Load all leaders with full pipeline data
  const { data: leaders } = await service
    .from('leaders')
    .select('*')
    .order('pipeline_level', { ascending: false, nullsFirst: false });

  const all = (leaders ?? []) as Leader[];

  // Pipeline distribution
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let assessed = 0;
  let notAssessed = 0;
  for (const l of all) {
    if (l.pipeline_level) {
      dist[l.pipeline_level as number] = (dist[l.pipeline_level as number] ?? 0) + 1;
      assessed++;
    } else {
      notAssessed++;
    }
  }
  const maxDist = Math.max(...Object.values(dist), 1);

  const needsAttention = all.filter(l => l.needs_attention_flag);
  const promotionPending = all.filter(l => l.promotion_requested);
  const onTrack = all.filter(l => l.pipeline_level && !l.needs_attention_flag && !l.promotion_requested);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 6px' }}>
          Leadership Portal
        </p>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0 }}>
          Pipeline Dashboard
        </h1>
      </div>

      {/* Status row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Leaders', value: all.length,         color: '#fff'     },
          { label: 'Assessed',      value: assessed,           color: '#44aa44'  },
          { label: 'Not Assessed',  value: notAssessed,        color: '#555'     },
          { label: 'Needs Attention', value: needsAttention.length, color: '#cc0000' },
          { label: 'Promotion Pending', value: promotionPending.length, color: '#ffaa00' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '18px 16px' }}>
            <p style={{ color: '#444', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 26, fontWeight: 800, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>

        {/* Pipeline distribution */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Pipeline Distribution</p>
          {[5, 4, 3, 2, 1].map(level => {
            const c = LEVEL_COLOR[level];
            const count = dist[level] ?? 0;
            const pct = Math.round((count / maxDist) * 100);
            return (
              <div key={level} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: c.text, fontSize: 12, fontWeight: 600 }}>
                    L{level} {LEVEL_NAMES[level]}
                  </span>
                  <span style={{ color: '#444', fontSize: 12 }}>{count}</span>
                </div>
                <div style={{ height: 4, background: '#1e1e1e', borderRadius: 4 }}>
                  <div style={{ height: '100%', borderRadius: 4, background: c.bar, width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Needs attention */}
          <div style={{ background: '#111', border: '1px solid #cc000033', borderRadius: 14, padding: 18, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#cc0000', display: 'inline-block', flexShrink: 0 }} />
              <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                Needs Attention ({needsAttention.length})
              </p>
            </div>
            {needsAttention.length === 0 ? (
              <p style={{ color: '#333', fontSize: 13 }}>All clear</p>
            ) : (
              needsAttention.slice(0, 4).map(l => (
                <div key={String(l.id)} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#fff', fontSize: 13 }}>{l.name as string}</span>
                  <span style={{ color: '#555', fontSize: 12 }}>L{l.pipeline_level ?? '?'}</span>
                </div>
              ))
            )}
          </div>

          {/* Promotion pending */}
          <div style={{ background: '#111', border: '1px solid #ffaa0033', borderRadius: 14, padding: 18, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffaa00', display: 'inline-block', flexShrink: 0 }} />
              <p style={{ color: '#ffaa00', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                Promotion Pending ({promotionPending.length})
              </p>
            </div>
            {promotionPending.length === 0 ? (
              <p style={{ color: '#333', fontSize: 13 }}>No pending reviews</p>
            ) : (
              promotionPending.slice(0, 4).map(l => (
                <div key={String(l.id)} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#fff', fontSize: 13 }}>{l.name as string}</span>
                  <span style={{ color: '#ffaa00', fontSize: 12 }}>L{l.pipeline_level} → L{(l.pipeline_level as number) + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full leaders table */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>All Leaders</h2>
          <span style={{ color: '#444', fontSize: 13 }}>{all.length} total</span>
        </div>

        {all.map((l, i) => {
          const level = l.pipeline_level as number | null;
          const c = level ? LEVEL_COLOR[level] : null;
          const lps = l.lps_score != null ? Math.round(l.lps_score as number) : null;
          const isLast = i === all.length - 1;

          return (
            <div
              key={String(l.id)}
              style={{
                padding: '16px 24px',
                borderBottom: isLast ? 'none' : '1px solid #141414',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}
            >
              {/* Row top: name + level badge + KRS score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, flex: 1, minWidth: 140 }}>
                  {l.name as string}
                </span>

                {l.member_id && (
                  <span style={{ color: '#333', fontSize: 11 }}>{l.member_id as string}</span>
                )}

                {level && c ? (
                  <span style={{
                    background: c.bg, border: `1px solid ${c.text}44`,
                    borderRadius: 20, padding: '3px 10px',
                    color: c.text, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
                  }}>
                    L{level} {LEVEL_NAMES[level]}
                  </span>
                ) : (
                  <span style={{ color: '#333', fontSize: 12 }}>Not assessed</span>
                )}

                {lps != null && (
                  <span style={{ color: '#aaa', fontSize: 13, fontWeight: 700 }}>KRS {lps}</span>
                )}

                {l.needs_attention_flag && (
                  <span style={{ color: '#cc0000', fontSize: 11, fontWeight: 700 }}>⚠ Attention</span>
                )}
                {l.promotion_requested && (
                  <span style={{ color: '#ffaa00', fontSize: 11, fontWeight: 700 }}>↑ Promotion</span>
                )}
              </div>

              {/* Row middle: animal + love language + omega */}
              {(l.animal_primary || l.ll_primary || l.omega_section_assigned) && (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {l.animal_primary && (
                    <span style={{ color: '#555', fontSize: 12 }}>
                      {animalEmoji(l.animal_primary as string)} {l.animal_primary as string}
                      {l.animal_secondary ? ` / ${l.animal_secondary as string}` : ''}
                    </span>
                  )}
                  {l.ll_primary && (
                    <span style={{ color: '#555', fontSize: 12 }}>
                      ♡ {l.ll_primary as string}
                    </span>
                  )}
                  {l.omega_section_assigned && (
                    <span style={{ color: '#555', fontSize: 12 }}>
                      Omega §{l.omega_section_assigned as number}
                    </span>
                  )}
                  {l.primary_language && (
                    <span style={{ color: '#444', fontSize: 12 }}>
                      {l.primary_language as string}{l.secondary_language ? ` / ${l.secondary_language as string}` : ''}
                    </span>
                  )}
                </div>
              )}

              {/* Row bottom: KRS domain bars (only for assessed leaders) */}
              {lps != null && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
                  {DOMAIN_KEYS.map(d => {
                    const score = Math.round((l[d.key] as number) ?? 0);
                    const barColor = score >= 70 ? '#44aa44' : score >= 40 ? '#ffaa00' : '#cc0000';
                    return (
                      <div key={d.key} style={{ textAlign: 'center' }}>
                        <div style={{ height: 3, background: '#1e1e1e', borderRadius: 2, marginBottom: 3 }}>
                          <div style={{ height: '100%', borderRadius: 2, background: barColor, width: `${score}%` }} />
                        </div>
                        <span style={{ color: '#333', fontSize: 9 }}>{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {all.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#333' }}>No leaders yet</div>
        )}
      </div>

      {/* On track summary */}
      <div style={{ marginTop: 16, padding: '14px 20px', background: '#0f0f0f', border: '1px solid #44aa4422', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#44aa44', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ color: '#44aa44', fontSize: 13, fontWeight: 600 }}>{onTrack.length} on track</span>
        <span style={{ color: '#333', fontSize: 13 }}>— no flags, no pending reviews</span>
      </div>
    </div>
  );
}

function animalEmoji(animal: string): string {
  const map: Record<string, string> = {
    'Lion': '🦁', 'Otter': '🦦', 'Golden Retriever': '🐕', 'Beaver': '🦫',
  };
  return map[animal] ?? '';
}
