'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { S1_QUESTIONS, S2_ROWS, S3_QUESTIONS } from '@/lib/questions';
import type { S1Answers, S2Answers, S3Answers } from '@/lib/scoring';

type Step = 'intake' | 'section1' | 'section2' | 'section3' | 'submitting';

interface Intake {
  name: string;
  email: string;
  phone: string;
  telegram: string;
}

const STORAGE_KEY = 'jgc_assessment_progress';

function saveProgress(data: object) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function AssessmentPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('intake');
  const [q1Index, setQ1Index] = useState(0);
  const [q3Index, setQ3Index] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [telegramId, setTelegramId] = useState<number | null>(null);

  const [intake, setIntake] = useState<Intake>({ name: '', email: '', phone: '', telegram: '' });
  const [s1Answers, setS1Answers] = useState<S1Answers>({});
  const [s2Answers, setS2Answers] = useState<S2Answers>({});
  const [s3Answers, setS3Answers] = useState<S3Answers>({});

  // Restore progress on mount; auto-skip intake if telegram params present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tgId = params.get('telegram_id');
    const tgName = params.get('name');
    const tgUsername = params.get('username');

    if (tgId) {
      setTelegramId(Number(tgId));
      setIntake({
        name: tgName ? decodeURIComponent(tgName) : '',
        email: '',
        phone: '',
        telegram: tgUsername ? decodeURIComponent(tgUsername) : '',
      });
    }

    const saved = loadProgress();
    if (saved?.step && saved.step !== 'intake') {
      setIntake(saved.intake ?? { name: '', email: '', phone: '', telegram: '' });
      setS1Answers(saved.s1Answers ?? {});
      setS2Answers(saved.s2Answers ?? {});
      setS3Answers(saved.s3Answers ?? {});
      setQ1Index(saved.q1Index ?? 0);
      setQ3Index(saved.q3Index ?? 0);
      setStep(saved.step);
      setResumed(true);
    } else if (tgId && tgName) {
      // Skip intake form — go straight to questions
      setStep('section1');
    }
  }, []);

  // Save progress whenever answers change
  useEffect(() => {
    if (step === 'intake' || step === 'submitting') return;
    saveProgress({ step, intake, s1Answers, s2Answers, s3Answers, q1Index, q3Index });
  }, [step, intake, s1Answers, s2Answers, s3Answers, q1Index, q3Index]);

  const totalSteps = 24 + 1 + 20;
  let currentProgress = 0;
  if (step === 'section1') currentProgress = q1Index;
  else if (step === 'section2') currentProgress = 24;
  else if (step === 'section3') currentProgress = 25 + q3Index;
  else if (step === 'submitting') currentProgress = totalSteps;
  const progressPct = Math.round((currentProgress / totalSteps) * 100);

  // Save intake to Supabase immediately on Begin — captures contact even if they don't finish
  async function handleIntakeSubmit() {
    setStep('section1');
    fetch('/api/assessment/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intake),
    }).catch(() => {}); // fire and forget — don't block the assessment flow
  }

  async function handleSubmit() {
    setStep('submitting');
    clearProgress();
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake, s1Answers, s2Answers, s3Answers, telegram_user_id: telegramId }),
      });
      const { leaderId, error } = await res.json() as { leaderId?: string; error?: string };
      if (error || !leaderId) throw new Error(error ?? 'No ID returned');
      // If opened from mini app, go back to dashboard; otherwise show results page
      if (telegramId) {
        router.push('/');
      } else {
        router.push(`/assessment/results/${leaderId}`);
      }
    } catch {
      alert('Something went wrong submitting. Please try again.');
      setStep('section3');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid #1e1e1e', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#cc0000', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, margin: 0 }}>Jesus Generation</p>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '2px 0 0' }}>Leadership Assessment</p>
        </div>
        {step !== 'intake' && step !== 'submitting' && (
          <p style={{ color: '#555', fontSize: 12, margin: 0 }}>{progressPct}%</p>
        )}
      </div>

      {/* Progress bar */}
      {step !== 'intake' && step !== 'submitting' && (
        <div style={{ height: 3, background: '#1e1e1e' }}>
          <div style={{ height: '100%', background: '#cc0000', width: `${progressPct}%`, transition: 'width 0.3s ease' }} />
        </div>
      )}

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>

        {step === 'intake' && (
          <IntakeStep values={intake} onChange={setIntake} onNext={handleIntakeSubmit} />
        )}

        {resumed && step !== 'intake' && step !== 'submitting' && (
          <div style={{ background: '#0f1a0f', border: '1px solid #44aa4433', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#44aa44', fontSize: 13 }}>Progress restored — picking up where you left off</span>
            <button onClick={() => { clearProgress(); setStep('intake'); setQ1Index(0); setQ3Index(0); setS1Answers({}); setS2Answers({}); setS3Answers({}); setResumed(false); }} style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer' }}>
              Start over
            </button>
          </div>
        )}

        {step === 'section1' && (
          <S1Step
            question={S1_QUESTIONS[q1Index]}
            selected={s1Answers[S1_QUESTIONS[q1Index].number]}
            onSelect={(ans) => setS1Answers(prev => ({ ...prev, [S1_QUESTIONS[q1Index].number]: ans }))}
            onNext={() => {
              if (q1Index < S1_QUESTIONS.length - 1) setQ1Index(i => i + 1);
              else setStep('section2');
            }}
            questionIndex={q1Index}
            total={S1_QUESTIONS.length}
          />
        )}

        {step === 'section2' && (
          <S2Step
            answers={s2Answers}
            onChange={setS2Answers}
            onNext={() => setStep('section3')}
          />
        )}

        {step === 'section3' && (
          <S3Step
            question={S3_QUESTIONS[q3Index]}
            selected={s3Answers[S3_QUESTIONS[q3Index].number]}
            onSelect={(ans) => setS3Answers(prev => ({ ...prev, [S3_QUESTIONS[q3Index].number]: ans }))}
            onNext={() => {
              if (q3Index < S3_QUESTIONS.length - 1) setQ3Index(i => i + 1);
              else handleSubmit();
            }}
            questionIndex={q3Index}
            total={S3_QUESTIONS.length}
          />
        )}

        {step === 'submitting' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⏳</div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Calculating your profile...</h2>
            <p style={{ color: '#555', fontSize: 14 }}>Analyzing your responses across all three sections.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function IntakeStep({ values, onChange, onNext }: {
  values: Intake;
  onChange: (v: Intake) => void;
  onNext: () => void;
}) {
  const valid = values.name.trim().length > 0 && values.email.trim().length > 0;

  const fields = [
    { key: 'name' as const,     label: 'Full Name',          type: 'text',  placeholder: 'Your full name',    required: true  },
    { key: 'email' as const,    label: 'Email Address',      type: 'email', placeholder: 'you@email.com',     required: true  },
    { key: 'phone' as const,    label: 'Phone Number',       type: 'tel',   placeholder: '(555) 000-0000',    required: false },
    { key: 'telegram' as const, label: 'Telegram Username',  type: 'text',  placeholder: '@username',         required: false },
  ];

  return (
    <div>
      <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Before We Begin</p>
      <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Kingdom Mandate Assessment</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
        This assessment measures your Kingdom Readiness Score across eight spiritual domains. Be honest — this isn't a test you pass or fail. It is a mirror.
      </p>

      {fields.map(f => (
        <div key={f.key} style={{ marginBottom: 16 }}>
          <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            {f.label}{f.required && <span style={{ color: '#cc0000' }}> *</span>}
          </label>
          <input
            type={f.type}
            placeholder={f.placeholder}
            value={values[f.key]}
            onChange={e => onChange({ ...values, [f.key]: e.target.value })}
            style={{
              width: '100%', background: '#111', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 15,
              boxSizing: 'border-box', outline: 'none',
            }}
          />
        </div>
      ))}

      <button
        onClick={onNext}
        disabled={!valid}
        style={{
          width: '100%', padding: 16, marginTop: 8,
          background: valid ? '#cc0000' : '#1a1a1a',
          color: valid ? '#fff' : '#444',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: valid ? 'pointer' : 'not-allowed',
        }}
      >
        Begin Assessment →
      </button>
    </div>
  );
}

function S1Step({ question, selected, onSelect, onNext, questionIndex, total }: {
  question: { number: number; text: string; options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[] };
  selected: 'A' | 'B' | 'C' | 'D' | undefined;
  onSelect: (ans: 'A' | 'B' | 'C' | 'D') => void;
  onNext: () => void;
  questionIndex: number;
  total: number;
}) {
  return (
    <div>
      <p style={{ color: '#555', fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
        Question {questionIndex + 1} of {total}
      </p>
      <p style={{ color: '#fff', fontSize: 17, fontWeight: 600, lineHeight: 1.55, marginBottom: 28 }}>
        {question.text}
      </p>

      {question.options.map(opt => (
        <button
          key={opt.label}
          onClick={() => onSelect(opt.label)}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '16px 20px', marginBottom: 12,
            background: selected === opt.label ? '#1a0000' : '#111',
            border: `2px solid ${selected === opt.label ? '#cc0000' : '#1e1e1e'}`,
            borderRadius: 12, color: selected === opt.label ? '#fff' : '#999',
            fontSize: 14, cursor: 'pointer', lineHeight: 1.5,
          }}
        >
          <span style={{ color: '#cc0000', fontWeight: 700, marginRight: 10 }}>{opt.label}</span>
          {opt.text}
        </button>
      ))}

      <button
        onClick={onNext}
        disabled={!selected}
        style={{
          width: '100%', padding: 16, marginTop: 8,
          background: selected ? '#cc0000' : '#1a1a1a',
          color: selected ? '#fff' : '#444',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: selected ? 'pointer' : 'not-allowed',
        }}
      >
        {questionIndex < total - 1 ? 'Next →' : 'Continue to Section 2 →'}
      </button>
    </div>
  );
}

function S2Step({ answers, onChange, onNext }: {
  answers: S2Answers;
  onChange: (a: S2Answers) => void;
  onNext: () => void;
}) {
  const allFilled = S2_ROWS.every(r => {
    const a = answers[r.rowNumber];
    if (!a) return false;
    const vals = [a.lion, a.otter, a.gr, a.beaver];
    return vals.every(v => v >= 1 && v <= 4) && new Set(vals).size === 4;
  });

  function setRank(rowNum: number, col: 'lion' | 'otter' | 'gr' | 'beaver', val: number) {
    onChange({
      ...answers,
      [rowNum]: { ...(answers[rowNum] ?? { lion: 0, otter: 0, gr: 0, beaver: 0 }), [col]: val },
    });
  }

  return (
    <div>
      <p style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Section 2 of 3</p>
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Animal Instincts</h2>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
        For each row, rank all four words: <strong style={{ color: '#aaa' }}>4 = Most Like Me</strong> down to <strong style={{ color: '#aaa' }}>1 = Least Like Me</strong>. Each number must be used once per row.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12, padding: '0 0 10px', borderBottom: '1px solid #1e1e1e' }}>
        {['🦁 Lion', '🦦 Otter', '🐕 Golden', '🦫 Beaver'].map(h => (
          <div key={h} style={{ textAlign: 'center', color: '#555', fontSize: 11, fontWeight: 700 }}>{h}</div>
        ))}
      </div>

      {S2_ROWS.map(row => {
        const a = answers[row.rowNumber] ?? { lion: 0, otter: 0, gr: 0, beaver: 0 };
        const cols = [
          { key: 'lion' as const, label: row.lion },
          { key: 'otter' as const, label: row.otter },
          { key: 'gr' as const, label: row.gr },
          { key: 'beaver' as const, label: row.beaver },
        ];
        return (
          <div key={row.rowNumber} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12, padding: '12px 8px', background: '#111', borderRadius: 10, border: '1px solid #1e1e1e' }}>
            {cols.map(col => (
              <div key={col.key} style={{ textAlign: 'center' }}>
                <p style={{ color: '#ccc', fontSize: 11, marginBottom: 6, lineHeight: 1.3 }}>{col.label}</p>
                <select
                  value={a[col.key] || ''}
                  onChange={e => setRank(row.rowNumber, col.key, Number(e.target.value))}
                  style={{
                    width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a',
                    borderRadius: 6, padding: '6px 2px', color: a[col.key] ? '#fff' : '#555',
                    fontSize: 14, textAlign: 'center',
                  }}
                >
                  <option value="">—</option>
                  {[4, 3, 2, 1].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>
        );
      })}

      <button
        onClick={onNext}
        disabled={!allFilled}
        style={{
          width: '100%', padding: 16, marginTop: 16,
          background: allFilled ? '#cc0000' : '#1a1a1a',
          color: allFilled ? '#fff' : '#444',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: allFilled ? 'pointer' : 'not-allowed',
        }}
      >
        Continue to Section 3 →
      </button>
    </div>
  );
}

function S3Step({ question, selected, onSelect, onNext, questionIndex, total }: {
  question: { number: number; optionA: string; optionB: string };
  selected: 'A' | 'B' | undefined;
  onSelect: (ans: 'A' | 'B') => void;
  onNext: () => void;
  questionIndex: number;
  total: number;
}) {
  return (
    <div>
      <p style={{ color: '#555', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
        Love Languages — {questionIndex + 1} of {total}
      </p>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
        Choose the statement that resonates with you more:
      </p>

      {(['A', 'B'] as const).map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '22px 20px', marginBottom: 16,
            background: selected === opt ? '#1a0000' : '#111',
            border: `2px solid ${selected === opt ? '#cc0000' : '#1e1e1e'}`,
            borderRadius: 14, color: selected === opt ? '#fff' : '#999',
            fontSize: 15, cursor: 'pointer', lineHeight: 1.6,
          }}
        >
          {opt === 'A' ? question.optionA : question.optionB}
        </button>
      ))}

      <button
        onClick={onNext}
        disabled={!selected}
        style={{
          width: '100%', padding: 16, marginTop: 4,
          background: selected ? '#cc0000' : '#1a1a1a',
          color: selected ? '#fff' : '#444',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: selected ? 'pointer' : 'not-allowed',
        }}
      >
        {questionIndex < total - 1 ? 'Next →' : 'Submit Assessment →'}
      </button>
    </div>
  );
}
