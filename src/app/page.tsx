"use client";

import { useEffect, useState } from "react";
import { S1_QUESTIONS, S2_ROWS, S3_QUESTIONS } from "@/lib/questions";

// Answer types (defined inline to avoid importing server-only @/lib/scoring)
type S1Answers = Record<number, "A" | "B" | "C" | "D">;
type S2Answers = Record<number, { lion: number; otter: number; gr: number; beaver: number }>;
type S3Answers = Record<number, "A" | "B">;

// ── Types ──────────────────────────────────────────────────────────────────

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

type AssessmentStep = "intake" | "s1" | "s2" | "s3" | "submitting";
type DashTab = "profile" | "plan" | "coaching" | "progress" | "bible";

interface Intake { name: string; email: string; phone: string; telegram: string; }

// ── Constants ──────────────────────────────────────────────────────────────

const LEVEL_COLOR: Record<number, string> = {
  1: "#4a9eff", 2: "#44aa44", 3: "#ffaa00", 4: "#ff6600", 5: "#cc0000",
};
const ANIMAL_EMOJI: Record<string, string> = {
  lion: "🦁", otter: "🦦", retriever: "🐕", beaver: "🦫",
};

// ── Assessment sub-components ──────────────────────────────────────────────

function IntakeStep({ values, onChange, onNext, telegramName }: {
  values: Intake;
  onChange: (v: Intake) => void;
  onNext: () => void;
  telegramName: string;
}) {
  const valid = values.name.trim().length > 0;
  return (
    <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <p style={{ color: "#cc0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, margin: "0 0 6px" }}>Leadership Pipeline</p>
      <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2 }}>Kingdom Mandate Assessment</h1>
      <p style={{ color: "#666", fontSize: 13, margin: "0 0 28px", lineHeight: 1.7 }}>
        Measures your Kingdom Readiness Score across eight spiritual domains. Be honest — this is a mirror, not a test.
      </p>
      {[
        { key: "name" as const, label: "Full Name", type: "text", placeholder: "Your full name", required: true },
        { key: "email" as const, label: "Email (optional)", type: "email", placeholder: "you@email.com", required: false },
        { key: "phone" as const, label: "Phone (optional)", type: "tel", placeholder: "(555) 000-0000", required: false },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: 14 }}>
          <label style={{ color: "#aaa", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>
            {f.label}{f.required && <span style={{ color: "#cc0000" }}> *</span>}
          </label>
          <input
            type={f.type}
            placeholder={f.placeholder}
            value={values[f.key]}
            onChange={e => onChange({ ...values, [f.key]: e.target.value })}
            style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "13px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }}
          />
        </div>
      ))}
      <input type="hidden" value={values.telegram} />
      <button
        onClick={() => {
          fetch("/api/assessment/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, telegram: telegramName }) }).catch(() => {});
          onNext();
        }}
        disabled={!valid}
        style={{ width: "100%", padding: 15, marginTop: 8, background: valid ? "#cc0000" : "#1a1a1a", color: valid ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed" }}
      >
        Begin Assessment →
      </button>
    </div>
  );
}

function S1Step({ question, selected, onSelect, onNext, index, total }: {
  question: { number: number; text: string; options: { label: "A" | "B" | "C" | "D"; text: string }[] };
  selected: "A" | "B" | "C" | "D" | undefined;
  onSelect: (a: "A" | "B" | "C" | "D") => void;
  onNext: () => void;
  index: number;
  total: number;
}) {
  return (
    <div style={{ padding: "20px", maxWidth: 480, margin: "0 auto" }}>
      <p style={{ color: "#555", fontSize: 12, fontWeight: 600, margin: "0 0 16px" }}>Section 1 · Question {index + 1} of {total}</p>
      <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, lineHeight: 1.55, margin: "0 0 24px" }}>{question.text}</p>
      {question.options.map(opt => (
        <button key={opt.label} onClick={() => onSelect(opt.label)} style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 18px", marginBottom: 10, background: selected === opt.label ? "#1a0000" : "#111", border: `2px solid ${selected === opt.label ? "#cc0000" : "#1e1e1e"}`, borderRadius: 12, color: selected === opt.label ? "#fff" : "#999", fontSize: 13, cursor: "pointer", lineHeight: 1.5 }}>
          <span style={{ color: "#cc0000", fontWeight: 700, marginRight: 8 }}>{opt.label}</span>{opt.text}
        </button>
      ))}
      <button onClick={onNext} disabled={!selected} style={{ width: "100%", padding: 14, marginTop: 6, background: selected ? "#cc0000" : "#1a1a1a", color: selected ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: selected ? "pointer" : "not-allowed" }}>
        {index < total - 1 ? "Next →" : "Continue to Section 2 →"}
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
  function setRank(rowNum: number, col: "lion" | "otter" | "gr" | "beaver", val: number) {
    onChange({ ...answers, [rowNum]: { ...(answers[rowNum] ?? { lion: 0, otter: 0, gr: 0, beaver: 0 }), [col]: val } });
  }
  return (
    <div style={{ padding: "20px", maxWidth: 480, margin: "0 auto" }}>
      <p style={{ color: "#cc0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 6px" }}>Section 2 of 3</p>
      <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Animal Instincts</h2>
      <p style={{ color: "#666", fontSize: 12, margin: "0 0 20px", lineHeight: 1.6 }}>Rank all four words per row: <strong style={{ color: "#aaa" }}>4 = Most Like Me</strong> → <strong style={{ color: "#aaa" }}>1 = Least</strong>. Each number once per row.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #1e1e1e" }}>
        {["🦁 Lion", "🦦 Otter", "🐕 Golden", "🦫 Beaver"].map(h => (
          <div key={h} style={{ textAlign: "center", color: "#555", fontSize: 10, fontWeight: 700 }}>{h}</div>
        ))}
      </div>
      {S2_ROWS.map(row => {
        const a = answers[row.rowNumber] ?? { lion: 0, otter: 0, gr: 0, beaver: 0 };
        return (
          <div key={row.rowNumber} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 10, padding: "10px 6px", background: "#111", borderRadius: 10, border: "1px solid #1e1e1e" }}>
            {(["lion", "otter", "gr", "beaver"] as const).map((col, ci) => {
              const label = [row.lion, row.otter, row.gr, row.beaver][ci];
              return (
                <div key={col} style={{ textAlign: "center" }}>
                  <p style={{ color: "#ccc", fontSize: 10, margin: "0 0 5px", lineHeight: 1.3 }}>{label}</p>
                  <select value={a[col] || ""} onChange={e => setRank(row.rowNumber, col, Number(e.target.value))} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "5px 2px", color: a[col] ? "#fff" : "#555", fontSize: 13, textAlign: "center" }}>
                    <option value="">—</option>
                    {[4, 3, 2, 1].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        );
      })}
      <button onClick={onNext} disabled={!allFilled} style={{ width: "100%", padding: 14, marginTop: 12, background: allFilled ? "#cc0000" : "#1a1a1a", color: allFilled ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: allFilled ? "pointer" : "not-allowed" }}>
        Continue to Section 3 →
      </button>
    </div>
  );
}

function S3Step({ question, selected, onSelect, onNext, index, total }: {
  question: { number: number; optionA: string; optionB: string };
  selected: "A" | "B" | undefined;
  onSelect: (a: "A" | "B") => void;
  onNext: () => void;
  index: number;
  total: number;
}) {
  return (
    <div style={{ padding: "20px", maxWidth: 480, margin: "0 auto" }}>
      <p style={{ color: "#555", fontSize: 12, fontWeight: 600, margin: "0 0 10px" }}>Section 3 · {index + 1} of {total}</p>
      <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>Choose the statement that resonates more:</p>
      {(["A", "B"] as const).map(opt => (
        <button key={opt} onClick={() => onSelect(opt)} style={{ display: "block", width: "100%", textAlign: "left", padding: "20px 18px", marginBottom: 14, background: selected === opt ? "#1a0000" : "#111", border: `2px solid ${selected === opt ? "#cc0000" : "#1e1e1e"}`, borderRadius: 14, color: selected === opt ? "#fff" : "#999", fontSize: 14, cursor: "pointer", lineHeight: 1.6 }}>
          {opt === "A" ? question.optionA : question.optionB}
        </button>
      ))}
      <button onClick={onNext} disabled={!selected} style={{ width: "100%", padding: 14, marginTop: 4, background: selected ? "#cc0000" : "#1a1a1a", color: selected ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: selected ? "pointer" : "not-allowed" }}>
        {index < total - 1 ? "Next →" : "Submit Assessment →"}
      </button>
    </div>
  );
}

// ── Assessment flow wrapper ────────────────────────────────────────────────

function AssessmentFlow({ telegramUserId, telegramName, onComplete }: {
  telegramUserId: number | null;
  telegramName: string;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<AssessmentStep>("intake");
  const [intake, setIntake] = useState<Intake>({ name: telegramName, email: "", phone: "", telegram: telegramName });
  const [s1Answers, setS1Answers] = useState<S1Answers>({});
  const [s2Answers, setS2Answers] = useState<S2Answers>({});
  const [s3Answers, setS3Answers] = useState<S3Answers>({});
  const [q1Index, setQ1Index] = useState(0);
  const [q3Index, setQ3Index] = useState(0);
  const [error, setError] = useState("");

  const totalQ = S1_QUESTIONS.length + 1 + S3_QUESTIONS.length;
  let done = 0;
  if (step === "s1") done = q1Index;
  else if (step === "s2") done = S1_QUESTIONS.length;
  else if (step === "s3") done = S1_QUESTIONS.length + 1 + q3Index;
  else if (step === "submitting") done = totalQ;
  const pct = Math.round((done / totalQ) * 100);

  async function submit() {
    setStep("submitting");
    setError("");
    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: { ...intake, telegram: telegramName }, s1Answers, s2Answers, s3Answers, telegramUserId }),
      });
      const data = await res.json() as { leaderId?: string; error?: string };
      if (data.error || !data.leaderId) throw new Error(data.error ?? "No ID returned");
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed. Please try again.");
      setStep("s3");
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      {/* Progress bar */}
      {step !== "intake" && step !== "submitting" && (
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 4, background: "#1e1e1e", borderRadius: 2 }}>
            <div style={{ height: 4, width: `${pct}%`, background: "#cc0000", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
          <span style={{ color: "#555", fontSize: 11, flexShrink: 0 }}>{pct}%</span>
        </div>
      )}

      {error && (
        <div style={{ background: "#1a0000", border: "1px solid #cc0000", borderRadius: 8, margin: "12px 20px", padding: "10px 14px", color: "#ff6666", fontSize: 13 }}>{error}</div>
      )}

      {step === "intake" && <IntakeStep values={intake} onChange={setIntake} onNext={() => setStep("s1")} telegramName={telegramName} />}

      {step === "s1" && (
        <S1Step
          question={S1_QUESTIONS[q1Index]}
          selected={s1Answers[S1_QUESTIONS[q1Index].number]}
          onSelect={ans => setS1Answers(prev => ({ ...prev, [S1_QUESTIONS[q1Index].number]: ans }))}
          onNext={() => q1Index < S1_QUESTIONS.length - 1 ? setQ1Index(i => i + 1) : setStep("s2")}
          index={q1Index}
          total={S1_QUESTIONS.length}
        />
      )}

      {step === "s2" && <S2Step answers={s2Answers} onChange={setS2Answers} onNext={() => setStep("s3")} />}

      {step === "s3" && (
        <S3Step
          question={S3_QUESTIONS[q3Index]}
          selected={s3Answers[S3_QUESTIONS[q3Index].number]}
          onSelect={ans => setS3Answers(prev => ({ ...prev, [S3_QUESTIONS[q3Index].number]: ans }))}
          onNext={() => q3Index < S3_QUESTIONS.length - 1 ? setQ3Index(i => i + 1) : submit()}
          index={q3Index}
          total={S3_QUESTIONS.length}
        />
      )}

      {step === "submitting" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16 }}>
          <div style={{ fontSize: 44 }}>⏳</div>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>Calculating your profile...</h2>
          <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Analyzing your responses across all three sections.</p>
        </div>
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

function Dashboard({ profile, coaching }: { profile: Profile; coaching: CoachingEntry[] }) {
  const [tab, setTab] = useState<DashTab>("profile");
  const [bibleQuery, setBibleQuery] = useState("");
  const [bibleResponse, setBibleResponse] = useState("");
  const [bibleLoading, setBibleLoading] = useState(false);

  const color = LEVEL_COLOR[profile.level_number] ?? "#4a9eff";
  const daysSince = profile.assessed_at
    ? Math.floor((Date.now() - new Date(profile.assessed_at).getTime()) / 86400000)
    : 0;
  const progress90 = Math.min(100, Math.round((daysSince / 90) * 100));

  async function askBible() {
    if (!bibleQuery.trim()) return;
    setBibleLoading(true);
    setBibleResponse("");
    try {
      const res = await fetch("/api/bible", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: bibleQuery }) });
      const data = await res.json() as { answer?: string };
      setBibleResponse(data.answer ?? "No response.");
    } catch { setBibleResponse("Unable to reach Bible Buddy right now."); }
    finally { setBibleLoading(false); }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: color + "22", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {ANIMAL_EMOJI[profile.dominant_animal] ?? "⭐"}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{profile.first_name}</div>
            <div style={{ color, fontSize: 11, fontWeight: 600 }}>{profile.level.charAt(0).toUpperCase() + profile.level.slice(1)} · Level {profile.level_number}/5</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{profile.overall_score}</div>
            <div style={{ fontSize: 10, color: "#555" }}>/ 100</div>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {(["profile", "plan", "coaching", "progress", "bible"] as DashTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 0", background: "none", border: "none", borderBottom: tab === t ? `2px solid ${color}` : "2px solid transparent", color: tab === t ? "#fff" : "#555", fontSize: 10, fontWeight: tab === t ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>
              {t === "bible" ? "📖" : t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Scores</div>
              {[{ label: "Character", score: profile.character_score, max: 32 }, { label: "Competency", score: profile.competency_score, max: 28 }, { label: "Consistency", score: profile.consistency_score, max: 40 }].map(({ label, score, max }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>{label}</span><span style={{ color: "#888" }}>{score}/{max} · {Math.round((score / max) * 100)}%</span>
                  </div>
                  <div style={{ height: 4, background: "#1e1e1e", borderRadius: 2 }}>
                    <div style={{ height: 4, width: `${(score / max) * 100}%`, background: color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
            {profile.dominant_animal && (
              <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Personality</div>
                <div style={{ fontSize: 13 }}>{ANIMAL_EMOJI[profile.dominant_animal]} {profile.dominant_animal.charAt(0).toUpperCase() + profile.dominant_animal.slice(1)}{profile.secondary_animal && ` · ${ANIMAL_EMOJI[profile.secondary_animal]} ${profile.secondary_animal.charAt(0).toUpperCase() + profile.secondary_animal.slice(1)}`}</div>
              </div>
            )}
            {profile.strengths && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Strengths</div><div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, whiteSpace: "pre-line" }}>{profile.strengths}</div></div>}
            {profile.growth_areas && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Growth Areas</div><div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, whiteSpace: "pre-line" }}>{profile.growth_areas}</div></div>}
            {profile.calling_direction && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Calling Direction</div><div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{profile.calling_direction}</div></div>}
          </div>
        )}

        {tab === "plan" && (
          <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>90-Day Development Plan</div>
            {profile.ministry_placement
              ? <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.8, whiteSpace: "pre-line" }}>{profile.ministry_placement}</div>
              : <div style={{ color: "#555", fontSize: 13 }}>Your plan will appear here after your coach reviews your profile.</div>}
          </div>
        )}

        {tab === "coaching" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {coaching.length === 0
              ? <div style={{ color: "#555", fontSize: 13, textAlign: "center", paddingTop: 40 }}>No coaching messages yet. Check back Monday.</div>
              : coaching.map(entry => (
                <div key={entry.id} style={{ background: "#111", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color, fontWeight: 600, textTransform: "uppercase" }}>{entry.day_type}</span>
                    <span style={{ fontSize: 10, color: "#555" }}>{new Date(entry.sent_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{entry.message_text}</div>
                  {entry.response_text && <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 8, marginTop: 10, fontSize: 12, color: "#888" }}><span style={{ color: "#555" }}>Your reply: </span>{entry.response_text}</div>}
                </div>
              ))}
          </div>
        )}

        {tab === "progress" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>90-Day Cycle</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}><span>Day {daysSince}</span><span style={{ color: "#555" }}>Day 90</span></div>
              <div style={{ height: 8, background: "#1e1e1e", borderRadius: 4 }}><div style={{ height: 8, width: `${progress90}%`, background: color, borderRadius: 4 }} /></div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{progress90 >= 100 ? "🔄 Retest due — send /retest to the bot" : `${90 - daysSince} days until retest`}</div>
            </div>
            <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Pipeline</div>
              {["Seeker", "Disciple", "Servant", "Leader", "Multiplier"].map((name, i) => {
                const lvl = i + 1; const active = lvl === profile.level_number; const done = lvl < profile.level_number;
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: done ? color + "33" : active ? color : "#1e1e1e", border: `2px solid ${done || active ? color : "#333"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: done || active ? color : "#444", flexShrink: 0 }}>{done ? "✓" : lvl}</div>
                    <span style={{ fontSize: 13, color: active ? "#fff" : done ? "#888" : "#444", fontWeight: active ? 700 : 400 }}>{name}</span>
                    {active && <span style={{ marginLeft: "auto", fontSize: 10, color, fontWeight: 600 }}>CURRENT</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "bible" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 10, lineHeight: 1.5 }}>📖 <strong style={{ color: "#fff" }}>Bible Buddy</strong> — Ask anything about scripture or faith.</div>
              <textarea value={bibleQuery} onChange={e => setBibleQuery(e.target.value)} placeholder="What does the Bible say about leadership?" rows={3} style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, padding: "10px 12px", resize: "none", outline: "none", boxSizing: "border-box" }} />
              <button onClick={askBible} disabled={bibleLoading || !bibleQuery.trim()} style={{ marginTop: 8, width: "100%", padding: "10px 0", background: bibleLoading ? "#1a1a1a" : "#1a3a1a", border: `1px solid ${bibleLoading ? "#333" : "#2a5a2a"}`, borderRadius: 8, color: bibleLoading ? "#555" : "#44cc44", fontSize: 13, fontWeight: 600, cursor: bibleLoading ? "default" : "pointer" }}>
                {bibleLoading ? "Searching scripture..." : "Ask Bible Buddy"}
              </button>
            </div>
            {bibleResponse && <div style={{ background: "#111", borderRadius: 12, padding: 14, fontSize: 13, color: "#ccc", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{bibleResponse}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [coaching, setCoaching] = useState<CoachingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void; initData?: string; initDataUnsafe?: { user?: { id?: number; first_name?: string; username?: string } } } } }).Telegram?.WebApp;
    if (!tg) { setLoading(false); return; }
    tg.ready?.();
    tg.expand?.();

    const name = tg.initDataUnsafe?.user?.first_name ?? tg.initDataUnsafe?.user?.username ?? "";
    setUserName(name);

    const initData = tg.initData;
    const fallbackId = tg.initDataUnsafe?.user?.id;

    if (!initData) {
      if (fallbackId) { setUserId(fallbackId); fetchProfile(fallbackId); }
      else setLoading(false);
      return;
    }

    fetch("/api/telegram-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData }) })
      .then(r => r.json())
      .then((data: { user?: { id?: number } }) => {
        const id = data.user?.id;
        if (id) { setUserId(id); fetchProfile(id); }
        else setLoading(false);
      })
      .catch(() => {
        if (fallbackId) { setUserId(fallbackId); fetchProfile(fallbackId); }
        else setLoading(false);
      });
  }, [mounted]);

  async function fetchProfile(id: number) {
    try {
      const res = await fetch(`/api/profile?user_id=${id}`);
      const data = await res.json() as { profile?: Profile; coaching?: CoachingEntry[] };
      setProfile(data.profile ?? null);
      setCoaching(data.coaching ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  if (!mounted || loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0a", color: "#fff", fontSize: 14 }}>Loading...</div>
  );

  // No Telegram context
  if (!userId) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0a", color: "#fff", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 14 }}>📋</div>
      <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Open in Telegram</h2>
      <p style={{ color: "#666", fontSize: 13, margin: 0 }}>This app must be opened from @leadershippipelinebot.</p>
    </div>
  );

  // Assessment flow (no profile yet, or user tapped "Take Assessment")
  if (!profile || showAssessment) return (
    <AssessmentFlow
      telegramUserId={userId}
      telegramName={userName}
      onComplete={() => { setShowAssessment(false); fetchProfile(userId!); }}
    />
  );

  // Dashboard
  return <Dashboard profile={profile} coaching={coaching} />;
}
