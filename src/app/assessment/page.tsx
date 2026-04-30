'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { S1_ITEMS, S2_ROWS, S3_QUESTIONS, S4_QUESTIONS, S5_QUESTIONS, S6_ITEMS } from '@/lib/questions';
import type { S1Answers, S2Answers, S3Answers, S4Answers, S5Answers, S6Answers } from '@/lib/scoring';

type Step = 'intake' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 'submitting';

interface Intake { name: string; email: string; phone: string; telegram: string; city: string; state: string; role: string; church_name: string; }

const STORAGE_KEY = 'ets_assessment_v2';
const save = (d: object) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };
const load = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const clear = () => { try { localStorage.removeItem(STORAGE_KEY); } catch {} };

const SCALE = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intake');
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [intake, setIntake] = useState<Intake>({ name: '', email: '', phone: '', telegram: '', city: '', state: '', role: '', church_name: '' });
  const [s1, setS1] = useState<S1Answers>({});
  const [s2, setS2] = useState<S2Answers>({});
  const [s3, setS3] = useState<S3Answers>({});
  const [s4, setS4] = useState<S4Answers>({});
  const [s5, setS5] = useState<S5Answers>({});
  const [s6, setS6] = useState<S6Answers>({});
  const [resumed, setResumed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tgId = params.get('telegram_id');
    const tgName = params.get('name');
    const tgUsername = params.get('username');
    if (tgId) {
      setTelegramId(Number(tgId));
      setIntake({ name: tgName ? decodeURIComponent(tgName) : '', email: '', phone: '', telegram: tgUsername ? decodeURIComponent(tgUsername) : '', city: '', state: '', role: '', church_name: '' });
    }
    const saved = load();
    if (saved?.step && saved.step !== 'intake') {
      setIntake(saved.intake ?? { name: '', email: '', phone: '', telegram: '', city: '', state: '', role: '', church_name: '' });
      setS1(saved.s1 ?? {}); setS2(saved.s2 ?? {}); setS3(saved.s3 ?? {});
      setS4(saved.s4 ?? {}); setS5(saved.s5 ?? {}); setS6(saved.s6 ?? {});
      setStep(saved.step);
      setResumed(true);
    } else if (tgId && tgName) {
      setStep('s1');
    }
  }, []);

  useEffect(() => {
    if (step === 'intake' || step === 'submitting') return;
    save({ step, intake, s1, s2, s3, s4, s5, s6 });
  }, [step, intake, s1, s2, s3, s4, s5, s6]);

  // Progress
  const totalQ = 40 + 10 + 20 + 27 + 8 + 20;
  const answered = Object.keys(s1).length + Object.keys(s2).length + Object.keys(s3).length +
    Object.keys(s4).length + Object.keys(s5).length + Object.keys(s6).length;
  const pct = Math.round((answered / totalQ) * 100);

  async function handleSubmit() {
    setStep('submitting');
    clear();
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake, s1Answers: s1, s2Answers: s2, s3Answers: s3, s4Answers: s4, s5Answers: s5, s6Answers: s6, telegram_user_id: telegramId }),
      });
      const { leaderId, error } = await res.json() as { leaderId?: string; error?: string };
      if (error || !leaderId) throw new Error(error ?? 'No ID');
      if (telegramId) router.push('/');
      else router.push(`/assessment/results/${leaderId}`);
    } catch {
      alert('Something went wrong. Please try again.');
      setStep('s6');
    }
  }

  const bg = '#0a0a0a';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid #1e1e1e', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#cc0000', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, margin: 0 }}>ETS Academy</p>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '2px 0 0' }}>Spiritual DNA Assessment</p>
        </div>
        {step !== 'intake' && step !== 'submitting' && (
          <p style={{ color: '#555', fontSize: 12, margin: 0 }}>{pct}%</p>
        )}
      </div>

      {/* Progress bar */}
      {step !== 'intake' && step !== 'submitting' && (
        <div style={{ height: 3, background: '#1e1e1e' }}>
          <div style={{ height: '100%', background: '#cc0000', width: `${pct}%`, transition: 'width 0.3s ease' }} />
        </div>
      )}

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 16px 60px' }}>

        {resumed && step !== 'intake' && step !== 'submitting' && (
          <div style={{ background: '#0f1a0f', border: '1px solid #44aa4433', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#44aa44', fontSize: 13 }}>Progress restored</span>
            <button onClick={() => { clear(); setStep('s1'); setS1({}); setS2({}); setS3({}); setS4({}); setS5({}); setS6({}); setResumed(false); }} style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer' }}>Start over</button>
          </div>
        )}

        {step === 'intake' && <IntakeStep values={intake} onChange={setIntake} onNext={() => setStep('s1')} />}

        {step === 's1' && (
          <LikertSection
            title="Section 1 of 6 — Spiritual Maturity"
            subtitle="Rate each statement honestly. 1 = Never, 5 = Always."
            items={S1_ITEMS}
            answers={s1}
            onAnswer={(num, val) => setS1(p => ({ ...p, [num]: val as 1|2|3|4|5 }))}
            onNext={() => setStep('s2')}
            onBack={() => setStep('intake')}
          />
        )}

        {step === 's2' && (
          <S2Step answers={s2} onChange={setS2} onNext={() => setStep('s3')} onBack={() => setStep('s1')} />
        )}

        {step === 's3' && (
          <PairSection
            title="Section 3 of 6 — Love Language"
            subtitle="Choose the statement that resonates with you more."
            questions={S3_QUESTIONS.map(q => ({ number: q.number, optionA: q.optionA, optionB: q.optionB }))}
            answers={s3}
            onAnswer={(num, val) => setS3(p => ({ ...p, [num]: val as 'A'|'B' }))}
            onNext={() => setStep('s4')}
            onBack={() => setStep('s2')}
          />
        )}

        {step === 's4' && (
          <PairSection
            title="Section 4 of 6 — Spiritual Gifts"
            subtitle="Choose the statement that resonates with you more."
            questions={S4_QUESTIONS.map(q => ({ number: q.number, optionA: q.optionA, optionB: q.optionB }))}
            answers={s4}
            onAnswer={(num, val) => setS4(p => ({ ...p, [num]: val as 'A'|'B' }))}
            onNext={() => setStep('s5')}
            onBack={() => setStep('s3')}
          />
        )}

        {step === 's5' && (
          <PairSection
            title="Section 5 of 6 — Leadership Style"
            subtitle="Choose the statement that sounds most like you."
            questions={S5_QUESTIONS.map(q => ({ number: q.number, optionA: q.optionA, optionB: q.optionB }))}
            answers={s5}
            onAnswer={(num, val) => setS5(p => ({ ...p, [num]: val as 'A'|'B' }))}
            onNext={() => setStep('s6')}
            onBack={() => setStep('s4')}
          />
        )}

        {step === 's6' && (
          <LikertSection
            title="Section 6 of 6 — Emotional Intelligence"
            subtitle="Rate each statement honestly. 1 = Never, 5 = Always."
            items={S6_ITEMS}
            answers={s6}
            onAnswer={(num, val) => setS6(p => ({ ...p, [num]: val as 1|2|3|4|5 }))}
            onNext={handleSubmit}
            onBack={() => setStep('s5')}
            isLast
          />
        )}

        {step === 'submitting' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🔥</div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Building your profile...</h2>
            <p style={{ color: '#555', fontSize: 14 }}>Analyzing your responses across all 6 sections.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INTAKE ───────────────────────────────────────────────────────────────────
function IntakeStep({ values, onChange, onNext }: { values: Intake; onChange: (v: Intake) => void; onNext: () => void }) {
  const valid = values.name.trim().length > 0 && values.city.trim().length > 0 && values.role.length > 0;

  const ROLES = ['Member', 'Leader', 'Pastor', 'Church Planter', 'Evangelist', 'Other'];

  return (
    <div>
      <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Before We Begin</p>
      <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Spiritual DNA Assessment</h1>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 28, lineHeight: 1.7 }}>
        6 sections · ~15 minutes · Built on Acts 2:42-47, the Great Commission, and Acts 1:8.
      </p>

      {/* Name */}
      {(['name','email','phone'] as const).map(k => (
        <div key={k} style={{ marginBottom: 14 }}>
          <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            {k === 'phone' ? 'Phone (optional)' : k.charAt(0).toUpperCase() + k.slice(1)}
            {k === 'name' && <span style={{ color: '#cc0000' }}> *</span>}
          </label>
          <input
            type={k === 'email' ? 'email' : k === 'phone' ? 'tel' : 'text'}
            value={values[k]}
            onChange={e => onChange({ ...values, [k]: e.target.value })}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '13px 16px', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
      ))}

      {/* Location */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>City <span style={{ color: '#cc0000' }}>*</span></label>
          <input value={values.city} onChange={e => onChange({ ...values, city: e.target.value })} placeholder="Your city" style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '13px 16px', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>State</label>
          <input value={values.state} onChange={e => onChange({ ...values, state: e.target.value })} placeholder="State" style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '13px 16px', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
        </div>
      </div>

      {/* Role */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>Your Role <span style={{ color: '#cc0000' }}>*</span></label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {ROLES.map(r => (
            <button key={r} onClick={() => onChange({ ...values, role: r })} style={{ padding: '10px 8px', background: values.role === r ? '#cc0000' : '#111', border: `1px solid ${values.role === r ? '#cc0000' : '#2a2a2a'}`, borderRadius: 8, color: values.role === r ? '#fff' : '#888', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Church name — show if not just a member */}
      {values.role && values.role !== 'Member' && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Church / Ministry Name</label>
          <input value={values.church_name} onChange={e => onChange({ ...values, church_name: e.target.value })} placeholder="Name of your church or ministry" style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '13px 16px', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
        </div>
      )}

      <button onClick={onNext} disabled={!valid} style={{ width: '100%', padding: 16, marginTop: 8, background: valid ? '#cc0000' : '#1a1a1a', color: valid ? '#fff' : '#444', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: valid ? 'pointer' : 'not-allowed' }}>
        Begin Assessment →
      </button>
    </div>
  );
}

// ─── LIKERT SECTION ───────────────────────────────────────────────────────────
function LikertSection({ title, subtitle, items, answers, onAnswer, onNext, onBack, isLast }: {
  title: string; subtitle: string;
  items: { number: number; text: string }[];
  answers: Record<number, number>;
  onAnswer: (num: number, val: number) => void;
  onNext: () => void;
  onBack?: () => void;
  isLast?: boolean;
}) {
  const answered = items.filter(i => answers[i.number]).length;
  const allDone = answered === items.length;

  return (
    <div>
      <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{title}</p>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>{subtitle}</p>

      {items.map(item => {
        const sel = answers[item.number];
        return (
          <div key={item.number} style={{ marginBottom: 24, padding: '16px', background: '#111', borderRadius: 12, border: `1px solid ${sel ? '#cc000033' : '#1e1e1e'}` }}>
            <p style={{ color: '#ddd', fontSize: 14, lineHeight: 1.6, margin: '0 0 14px' }}>{item.text}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {SCALE.map(s => (
                <button
                  key={s.value}
                  onClick={() => onAnswer(item.number, s.value)}
                  style={{
                    flex: 1, padding: '10px 4px', border: `2px solid ${sel === s.value ? '#cc0000' : '#2a2a2a'}`,
                    borderRadius: 8, background: sel === s.value ? '#cc0000' : '#0a0a0a',
                    color: sel === s.value ? '#fff' : '#555', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', textAlign: 'center', lineHeight: 1.3,
                  }}
                >
                  <div style={{ fontSize: 14, marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 9 }}>{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ position: 'sticky', bottom: 16, display: 'flex', gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ padding: '16px 20px', background: '#111', color: '#555', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>← Back</button>
        )}
        <button
          onClick={onNext}
          disabled={!allDone}
          style={{ flex: 1, padding: 16, background: allDone ? '#cc0000' : '#1a1a1a', color: allDone ? '#fff' : '#444', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: allDone ? 'pointer' : 'not-allowed' }}
        >
          {isLast ? 'Submit Assessment →' : `Continue → (${answered}/${items.length})`}
        </button>
      </div>
    </div>
  );
}

// ─── PAIR SECTION (S3/S4/S5) ─────────────────────────────────────────────────
function PairSection({ title, subtitle, questions, answers, onAnswer, onNext, onBack }: {
  title: string; subtitle: string;
  questions: { number: number; optionA: string; optionB: string }[];
  answers: Record<number, string>;
  onAnswer: (num: number, val: string) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const answered = questions.filter(q => answers[q.number]).length;
  const allDone = answered === questions.length;

  return (
    <div>
      <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{title}</p>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>{subtitle}</p>

      {questions.map(q => {
        const sel = answers[q.number];
        return (
          <div key={q.number} style={{ marginBottom: 16 }}>
            {(['A', 'B'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => onAnswer(q.number, opt)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '16px 18px', marginBottom: 8,
                  background: sel === opt ? '#1a0000' : '#111',
                  border: `2px solid ${sel === opt ? '#cc0000' : '#1e1e1e'}`,
                  borderRadius: 12, color: sel === opt ? '#fff' : '#999',
                  fontSize: 14, cursor: 'pointer', lineHeight: 1.6,
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'border-color 0.1s, background 0.1s',
                }}
              >
                {opt === 'A' ? q.optionA : q.optionB}
              </button>
            ))}
          </div>
        );
      })}

      <div style={{ position: 'sticky', bottom: 16, display: 'flex', gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ padding: '16px 20px', background: '#111', color: '#555', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>← Back</button>
        )}
        <button
          onClick={onNext}
          disabled={!allDone}
          style={{ flex: 1, padding: 16, background: allDone ? '#cc0000' : '#1a1a1a', color: allDone ? '#fff' : '#444', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: allDone ? 'pointer' : 'not-allowed' }}
        >
          {`Continue → (${answered}/${questions.length})`}
        </button>
      </div>
    </div>
  );
}

// ─── S2 ANIMAL RANKING ────────────────────────────────────────────────────────
function S2Step({ answers, onChange, onNext, onBack }: { answers: S2Answers; onChange: (a: S2Answers) => void; onNext: () => void; onBack?: () => void }) {
  const allFilled = S2_ROWS.every(r => {
    const a = answers[r.rowNumber];
    if (!a) return false;
    const vals = [a.lion, a.otter, a.gr, a.beaver];
    return vals.every(v => v >= 1 && v <= 4) && new Set(vals).size === 4;
  });

  function setRank(rowNum: number, col: 'lion'|'otter'|'gr'|'beaver', val: number) {
    onChange({ ...answers, [rowNum]: { ...(answers[rowNum] ?? { lion:0, otter:0, gr:0, beaver:0 }), [col]: val } });
  }

  const cols = ['lion','otter','gr','beaver'] as const;

  return (
    <div>
      <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Section 2 of 6 — Temperament</p>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
        For each row, rank all four words: <strong style={{ color: '#aaa' }}>4 = Most Like Me</strong> down to <strong style={{ color: '#aaa' }}>1 = Least Like Me</strong>. Use each number once per row.
      </p>

      {S2_ROWS.map(row => (
        <div key={row.rowNumber} style={{ marginBottom: 12, padding: '14px 12px', background: '#111', borderRadius: 12, border: '1px solid #1e1e1e' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {cols.map(col => (
              <div key={col} style={{ textAlign: 'center' }}>
                <p style={{ color: '#ddd', fontSize: 12, marginBottom: 8, lineHeight: 1.3, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {row[col]}
                </p>
                <select
                  value={answers[row.rowNumber]?.[col] || ''}
                  onChange={e => setRank(row.rowNumber, col, Number(e.target.value))}
                  style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${answers[row.rowNumber]?.[col] ? '#cc000066' : '#2a2a2a'}`, borderRadius: 6, padding: '8px 4px', color: answers[row.rowNumber]?.[col] ? '#fff' : '#555', fontSize: 15, textAlign: 'center' }}
                >
                  <option value="">—</option>
                  {[4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {onBack && (
          <button onClick={onBack} style={{ padding: '16px 20px', background: '#111', color: '#555', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>← Back</button>
        )}
        <button onClick={onNext} disabled={!allFilled} style={{ flex: 1, padding: 16, background: allFilled ? '#cc0000' : '#1a1a1a', color: allFilled ? '#fff' : '#444', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: allFilled ? 'pointer' : 'not-allowed' }}>
          Continue →
        </button>
      </div>
    </div>
  );
}
