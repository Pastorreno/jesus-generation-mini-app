import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LEVEL_COLOR: Record<number, string> = {
  1: '#4a9eff', 2: '#44aa44', 3: '#ffaa00', 4: '#ff6600', 5: '#cc0000',
};
const LEVEL_TAGLINE: Record<number, string> = {
  1: 'Your journey begins. Foundations of Faith.',
  2: 'Disciplines forged here become pillars later.',
  3: 'You are becoming the culture of the house.',
  4: 'You are ready to make disciples who make disciples.',
  5: 'You are the pipeline. Now build it.',
};
const OMEGA_SECTION: Record<number, string> = {
  1: 'Section 1 — Foundations of Faith',
  2: 'Section 2 — Disciplines of the Disciple',
  3: 'Section 3 — The Culture of the House',
  4: 'Section 4 — The Making of a Leader',
  5: 'Section 5 — Systems & Multiplication',
};
const ANIMAL_EMOJI: Record<string, string> = {
  'Lion': '🦁', 'Otter': '🦦', 'Golden Retriever': '🐕', 'Beaver': '🦫',
};

type Leader = Record<string, number | string | boolean | null>;

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: '#1e1e1e', borderRadius: 4 }}>
        <div style={{ height: '100%', borderRadius: 4, background: color, width: `${score}%` }} />
      </div>
      <span style={{ color, fontSize: 13, fontWeight: 700, width: 32, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

function barColor(score: number) {
  return score >= 70 ? '#44aa44' : score >= 40 ? '#ffaa00' : '#cc0000';
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const isUUID = /^[0-9a-f-]{36}$/.test(id);
  const { data: leader } = await supabase
    .from('leaders')
    .select('*')
    .eq(isUUID ? 'id' : 'member_id', id)
    .single();

  if (!leader) notFound();

  const l = leader as Leader;
  const level    = (l.pipeline_level as number) ?? 1;
  const lps      = Math.round((l.lps_score as number) ?? 0);
  const levelColor = LEVEL_COLOR[level] ?? '#cc0000';

  // 3 C's — computed from stored domain scores
  const character     = Math.round(((l.score_consistency as number ?? 0) + (l.score_fasting_prayer as number ?? 0) + (l.score_partnership as number ?? 0)) / 3);
  const competency    = Math.round(((l.score_outreach as number ?? 0) + (l.score_coaching as number ?? 0)) / 2);
  const comprehension = Math.round(((l.score_bible_depth as number ?? 0) + (l.score_discipleship as number ?? 0)) / 2);

  // FAT sub-scores
  const faithful  = Math.round(((l.score_consistency as number ?? 0) + (l.score_fasting_prayer as number ?? 0)) / 2);
  const available = Math.round((l.score_partnership as number) ?? 0);
  const teachable = Math.round(((l.score_coaching as number ?? 0) + (l.score_discipleship as number ?? 0)) / 2);
  const treasure  = Math.round((l.score_stewardship as number) ?? 0);

  // Omega modules from DB
  let modules: string[] = [];
  try {
    modules = JSON.parse((l.omega_focus_modules as string) ?? '[]');
  } catch { modules = []; }

  // AI-generated profile paragraphs
  const profileText = (l.leadership_profile as string) ?? '';
  const profileParagraphs = profileText.split('\n\n').filter(p => p.trim().length > 0);

  // AI-generated focus module note
  const focusNote = (l.spiritual_growth_notes as string) ?? '';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Level hero ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0000 100%)', borderBottom: '1px solid #1e1e1e', padding: '52px 24px', textAlign: 'center' }}>
        <p style={{ color: levelColor, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>
          Kingdom Mandate Level
        </p>
        <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 900, margin: '0 0 8px', letterSpacing: -1 }}>
          Level {level} — {l.pipeline_level_name as string}
        </h1>
        <p style={{ color: '#666', fontSize: 15, margin: '0 0 28px' }}>{LEVEL_TAGLINE[level]}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#111', border: `1px solid ${levelColor}33`, borderRadius: 20, padding: '12px 28px' }}>
          <span style={{ color: '#555', fontSize: 13 }}>Kingdom Readiness Score</span>
          <span style={{ color: levelColor, fontSize: 26, fontWeight: 800 }}>{lps}</span>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── AI Profile ─────────────────────────────────────────────────────── */}
        {profileParagraphs.length > 0 && (
          <div style={{ background: '#111', border: `1px solid ${levelColor}22`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <p style={{ color: levelColor, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>
              Your Kingdom Mandate Profile
            </p>
            {profileParagraphs.map((para, i) => (
              <p key={i} style={{ color: i === 0 ? '#ddd' : '#999', fontSize: 15, lineHeight: 1.75, margin: i < profileParagraphs.length - 1 ? '0 0 16px' : 0 }}>
                {para}
              </p>
            ))}
          </div>
        )}

        {/* ── 3 C's ──────────────────────────────────────────────────────────── */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>The 3 C&#39;s</p>
          {[
            { label: 'Character',     score: character,     note: 'Faithful · Available · Teachable'    },
            { label: 'Competency',    score: competency,    note: 'Outreach · Coaching · Leadership'    },
            { label: 'Comprehension', score: comprehension, note: 'Bible Depth · Discipleship Knowledge' },
          ].map(({ label, score, note }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{label}</span>
                <span style={{ color: '#444', fontSize: 12 }}>{note}</span>
              </div>
              <ScoreBar score={score} color={barColor(score)} />
            </div>
          ))}
        </div>

        {/* ── FAT Breakdown ───────────────────────────────────────────────────── */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Character Breakdown — F.A.T.</p>
          {[
            { label: 'Faithful',  score: faithful,  desc: 'Keeps spiritual commitments. Disciplines maintained. Shows up.' },
            { label: 'Available', score: available, desc: 'Steps in to serve. Supports leadership. Team-first posture.'   },
            { label: 'Teachable', score: teachable, desc: 'Receives correction. Stays humble. Develops others.'           },
          ].map(({ label, score, desc }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{label}</span>
                <span style={{ color: '#444', fontSize: 12, marginLeft: 10 }}>{desc}</span>
              </div>
              <ScoreBar score={score} color={barColor(score)} />
            </div>
          ))}
        </div>

        {/* ── 3 T's ───────────────────────────────────────────────────────────── */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>The 3 T&#39;s</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Time</p>
              <p style={{ color: '#333', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>—</p>
              <p style={{ color: '#333', fontSize: 11, lineHeight: 1.4, margin: 0 }}>Tracked via weekly check-ins</p>
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Talent</p>
              <p style={{ fontSize: 22, margin: '0 0 4px' }}>{ANIMAL_EMOJI[l.animal_primary as string] ?? '—'}</p>
              <p style={{ color: '#aaa', fontSize: 12, fontWeight: 700, margin: '0 0 2px' }}>{l.animal_primary as string}</p>
              <p style={{ color: '#444', fontSize: 11, margin: 0 }}>{l.animal_secondary as string}</p>
            </div>
            <div style={{ background: '#0a0a0a', border: `1px solid ${barColor(treasure)}33`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Treasure</p>
              <p style={{ color: barColor(treasure), fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{treasure}</p>
              <p style={{ color: '#444', fontSize: 11, lineHeight: 1.4, margin: 0 }}>Stewardship of finances & resources</p>
            </div>
          </div>
        </div>

        {/* ── Love Language ───────────────────────────────────────────────────── */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Love Language</p>
          <p style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: '0 0 4px' }}>{l.ll_primary as string}</p>
          <p style={{ color: '#555', fontSize: 13, margin: 0 }}>Secondary: {l.ll_secondary as string}</p>
        </div>

        {/* ── Omega Training Recommendation ───────────────────────────────────── */}
        <div style={{ background: '#0f0f0f', border: `1px solid ${levelColor}33`, borderRadius: 16, padding: 28, marginBottom: 16 }}>
          <p style={{ color: levelColor, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Saturated Church — Omega Series
          </p>
          <p style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: '0 0 16px' }}>
            {OMEGA_SECTION[(l.omega_section_assigned as number) ?? 1]}
          </p>

          {/* Recommended module order */}
          {modules.length > 0 && (
            <div style={{ marginBottom: focusNote ? 20 : 0 }}>
              <p style={{ color: '#444', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Recommended Module Order</p>
              {modules.map((mod, i) => (
                <div key={mod} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? levelColor : '#1e1e1e',
                    color: i === 0 ? '#fff' : '#555',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i + 1}</span>
                  <span style={{ color: i === 0 ? '#fff' : '#555', fontSize: 14, fontWeight: i === 0 ? 700 : 400 }}>
                    {mod}
                  </span>
                  {i === 0 && (
                    <span style={{ color: levelColor, fontSize: 11, fontWeight: 700 }}>START HERE</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AI focus note */}
          {focusNote && (
            <div style={{ background: '#111', borderRadius: 10, padding: 16, borderLeft: `3px solid ${levelColor}` }}>
              <p style={{ color: '#888', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{focusNote}</p>
            </div>
          )}
        </div>

        {/* ── What's next ─────────────────────────────────────────────────────── */}
        <div style={{ background: '#0f0f0f', border: '1px solid #cc000033', borderRadius: 16, padding: 24 }}>
          <p style={{ color: '#cc0000', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>What Happens Next</p>
          {[
            'Your results are being reviewed by Pastor Reno & Pastor Rachel',
            'A mentor from The Thirty will be assigned to you',
            'Your first Omega module begins this week',
            'You will receive a weekly check-in every Monday',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <span style={{ color: '#cc0000', flexShrink: 0 }}>→</span>
              <span style={{ color: '#777', fontSize: 14, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
