"use client";

import { useEffect, useState } from "react";

type Profile = {
  first_name: string;
  overall_score: number;
  character_score: number;
  competency_score: number;
  consistency_score: number;
  level: string;
  level_number: number;
  dominant_animal: string;
  secondary_animal: string;
  strengths: string;
  growth_areas: string;
  calling_direction: string;
  ministry_placement: string;
  profile_card: string;
  fat_gate_triggered: boolean;
  assessed_at: string;
};

type CoachingEntry = {
  id: string;
  sent_at: string;
  message_text: string;
  response_text: string | null;
  day_type: string;
};

const LEVEL_COLOR: Record<number, string> = {
  1: '#4a9eff', 2: '#44aa44', 3: '#ffaa00', 4: '#ff6600', 5: '#cc0000',
};

const ANIMAL_EMOJI: Record<string, string> = {
  lion: '🦁', otter: '🦦', retriever: '🐕', beaver: '🦫',
};

type Tab = 'profile' | 'plan' | 'coaching' | 'progress' | 'bible';

export default function DashboardPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [coaching, setCoaching] = useState<CoachingEntry[]>([]);
  const [tab, setTab] = useState<Tab>('profile');
  const [bibleQuery, setBibleQuery] = useState('');
  const [bibleResponse, setBibleResponse] = useState('');
  const [bibleLoading, setBibleLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void; initData?: string; initDataUnsafe?: { user?: { id?: number } } } } }).Telegram?.WebApp;
    if (!tg) { setLoading(false); return; }

    tg.ready?.();
    tg.expand?.();

    const initData = tg.initData;
    const fallbackId = tg.initDataUnsafe?.user?.id;

    if (!initData) {
      // fallback for dev/testing
      if (fallbackId) { setUserId(fallbackId); fetchData(fallbackId); }
      else setLoading(false);
      return;
    }

    fetch('/api/telegram-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then(res => res.json())
      .then(data => {
        const id = data.user?.id;
        if (id) { setUserId(id); fetchData(id); }
        else setLoading(false);
      })
      .catch(() => {
        if (fallbackId) { setUserId(fallbackId); fetchData(fallbackId); }
        else setLoading(false);
      });
  }, []);

  async function fetchData(id: number) {
    try {
      const res = await fetch(`/api/profile?user_id=${id}`);
      const data = await res.json();
      setProfile(data.profile ?? null);
      setCoaching(data.coaching ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function askBible() {
    if (!bibleQuery.trim()) return;
    setBibleLoading(true);
    setBibleResponse('');
    try {
      const res = await fetch('/api/bible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: bibleQuery }),
      });
      const data = await res.json();
      setBibleResponse(data.answer ?? 'No response.');
    } catch {
      setBibleResponse('Unable to reach Bible Buddy right now.');
    } finally {
      setBibleLoading(false);
    }
  }

  const color = LEVEL_COLOR[profile?.level_number ?? 1] ?? '#4a9eff';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', fontSize: 14 }}>
      Loading...
    </div>
  );

  if (!userId || !profile) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
      <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>No Profile Yet</h2>
      <p style={{ color: '#666', fontSize: 14, margin: 0 }}>Send /start to @leadershippipelinebot to take your assessment.</p>
    </div>
  );

  const daysSinceAssessment = profile.assessed_at
    ? Math.floor((Date.now() - new Date(profile.assessed_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const progress90 = Math.min(100, Math.round((daysSinceAssessment / 90) * 100));

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: color + '22', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {ANIMAL_EMOJI[profile.dominant_animal] ?? '⭐'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.first_name}</div>
            <div style={{ color, fontSize: 12, fontWeight: 600 }}>{profile.level.charAt(0).toUpperCase() + profile.level.slice(1)} · Level {profile.level_number}/5</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color }}>{profile.overall_score}</div>
            <div style={{ fontSize: 10, color: '#555' }}>/ 100</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {(['profile', 'plan', 'coaching', 'progress', 'bible'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px 0', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${color}` : '2px solid transparent',
              color: tab === t ? '#fff' : '#555', fontSize: 11, fontWeight: tab === t ? 700 : 400, cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap',
            }}>{t === 'bible' ? '📖' : t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Scores */}
            <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Scores</div>
              {[
                { label: 'Character', score: profile.character_score, max: 32 },
                { label: 'Competency', score: profile.competency_score, max: 28 },
                { label: 'Consistency', score: profile.consistency_score, max: 40 },
              ].map(({ label, score, max }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{label}</span>
                    <span style={{ color: '#888' }}>{score}/{max} · {Math.round((score / max) * 100)}%</span>
                  </div>
                  <div style={{ height: 4, background: '#1e1e1e', borderRadius: 2 }}>
                    <div style={{ height: 4, width: `${(score / max) * 100}%`, background: color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Personality */}
            <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Personality</div>
              <div style={{ fontSize: 14 }}>
                {ANIMAL_EMOJI[profile.dominant_animal]} {profile.dominant_animal.charAt(0).toUpperCase() + profile.dominant_animal.slice(1)}
                {profile.secondary_animal && ` · ${ANIMAL_EMOJI[profile.secondary_animal]} ${profile.secondary_animal.charAt(0).toUpperCase() + profile.secondary_animal.slice(1)}`}
              </div>
            </div>

            {/* Strengths */}
            {profile.strengths && (
              <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Strengths</div>
                <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{profile.strengths}</div>
              </div>
            )}

            {/* Growth Areas */}
            {profile.growth_areas && (
              <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Growth Areas</div>
                <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{profile.growth_areas}</div>
              </div>
            )}

            {/* Calling */}
            {profile.calling_direction && (
              <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Calling Direction</div>
                <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{profile.calling_direction}</div>
              </div>
            )}
          </div>
        )}

        {/* PLAN TAB */}
        {tab === 'plan' && (
          <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>90-Day Development Plan</div>
            {profile.ministry_placement ? (
              <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{profile.ministry_placement}</div>
            ) : (
              <div style={{ color: '#555', fontSize: 13 }}>Complete your assessment to receive your plan.</div>
            )}
          </div>
        )}

        {/* COACHING TAB */}
        {tab === 'coaching' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {coaching.length === 0 ? (
              <div style={{ color: '#555', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>No coaching messages yet. Check back Monday.</div>
            ) : coaching.map(entry => (
              <div key={entry.id} style={{ background: '#111', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: color, fontWeight: 600, textTransform: 'uppercase' }}>{entry.day_type}</span>
                  <span style={{ fontSize: 11, color: '#555' }}>{new Date(entry.sent_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6, marginBottom: entry.response_text ? 12 : 0 }}>{entry.message_text}</div>
                {entry.response_text && (
                  <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 10, fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                    <span style={{ color: '#555' }}>Your reply: </span>{entry.response_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROGRESS TAB */}
        {tab === 'progress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 90-day cycle */}
            <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>90-Day Cycle</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span>Day {daysSinceAssessment}</span>
                <span style={{ color: '#555' }}>Day 90</span>
              </div>
              <div style={{ height: 8, background: '#1e1e1e', borderRadius: 4 }}>
                <div style={{ height: 8, width: `${progress90}%`, background: color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 8 }}>
                {progress90 >= 100 ? '🔄 Retest due — send /retest to the bot' : `${90 - daysSinceAssessment} days until retest`}
              </div>
            </div>

            {/* Level pipeline */}
            <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Pipeline</div>
              {['Seeker', 'Disciple', 'Servant', 'Leader', 'Multiplier'].map((name, i) => {
                const lvl = i + 1;
                const active = lvl === profile.level_number;
                const done = lvl < profile.level_number;
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? color + '33' : active ? color : '#1e1e1e', border: `2px solid ${done || active ? color : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: done || active ? color : '#444', flexShrink: 0 }}>
                      {done ? '✓' : lvl}
                    </div>
                    <span style={{ fontSize: 13, color: active ? '#fff' : done ? '#888' : '#444', fontWeight: active ? 700 : 400 }}>{name}</span>
                    {active && <span style={{ marginLeft: 'auto', fontSize: 10, color, fontWeight: 600 }}>CURRENT</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* BIBLE TAB */}
        {tab === 'bible' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#111', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 12, lineHeight: 1.5 }}>
                📖 <strong style={{ color: '#fff' }}>Bible Buddy</strong> — Ask anything about scripture, theology, or faith.
              </div>
              <textarea
                value={bibleQuery}
                onChange={e => setBibleQuery(e.target.value)}
                placeholder="What does the Bible say about leadership?"
                rows={3}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 13, padding: '10px 12px', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                onClick={askBible}
                disabled={bibleLoading || !bibleQuery.trim()}
                style={{ marginTop: 10, width: '100%', padding: '10px 0', background: bibleLoading ? '#1a1a1a' : '#1a3a1a', border: `1px solid ${bibleLoading ? '#333' : '#2a5a2a'}`, borderRadius: 8, color: bibleLoading ? '#555' : '#44cc44', fontSize: 13, fontWeight: 600, cursor: bibleLoading ? 'default' : 'pointer' }}
              >
                {bibleLoading ? 'Searching scripture...' : 'Ask Bible Buddy'}
              </button>
            </div>
            {bibleResponse && (
              <div style={{ background: '#111', borderRadius: 12, padding: 16, fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {bibleResponse}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
