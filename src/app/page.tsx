"use client";

import { useEffect, useState } from "react";
import { S1_QUESTIONS, S2_ROWS, S3_QUESTIONS } from "@/lib/questions";

type S1Answers = Record<number, "A" | "B" | "C" | "D">;
type S2Answers = Record<number, { lion: number; otter: number; gr: number; beaver: number }>;
type S3Answers = Record<number, "A" | "B">;
type AssessmentStep = "intake" | "s1" | "s2" | "s3" | "submitting";
interface Intake { name: string; email: string; phone: string; }

type Profile = {
  first_name: string; overall_score: number; character_score: number;
  competency_score: number; consistency_score: number; level: string;
  level_number: number; dominant_animal: string; secondary_animal: string;
  strengths: string; growth_areas: string; calling_direction: string;
  ministry_placement: string; assessed_at: string;
};
type CoachingEntry = { id: string; sent_at: string; message_text: string; response_text: string | null; day_type: string; };
type DashTab = "profile" | "plan" | "coaching" | "progress" | "bible";
const LEVEL_COLOR: Record<number, string> = { 1: "#4a9eff", 2: "#44aa44", 3: "#ffaa00", 4: "#ff6600", 5: "#cc0000" };
const ANIMAL_EMOJI: Record<string, string> = { lion: "🦁", otter: "🦦", retriever: "🐕", beaver: "🦫" };

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [coaching, setCoaching] = useState<CoachingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Assessment state
  const [step, setStep] = useState<AssessmentStep>("intake");
  const [intake, setIntake] = useState<Intake>({ name: "", email: "", phone: "" });
  const [s1Answers, setS1Answers] = useState<S1Answers>({});
  const [s2Answers, setS2Answers] = useState<S2Answers>({});
  const [s3Answers, setS3Answers] = useState<S3Answers>({});
  const [q1Index, setQ1Index] = useState(0);
  const [q3Index, setQ3Index] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void; initData?: string; initDataUnsafe?: { user?: { id?: number; first_name?: string } } } } }).Telegram?.WebApp;
    if (!tg) { setLoading(false); return; }
    tg.ready?.(); tg.expand?.();
    const name = tg.initDataUnsafe?.user?.first_name ?? "";
    setUserName(name);
    setIntake(i => ({ ...i, name }));
    const id = tg.initDataUnsafe?.user?.id;
    if (!id) { setLoading(false); return; }
    setUserId(id);
    fetch(`/api/profile?user_id=${id}`)
      .then(r => r.json())
      .then((d: { profile?: Profile; coaching?: CoachingEntry[] }) => {
        setProfile(d.profile ?? null);
        setCoaching(d.coaching ?? []);
        setHasProfile(!!d.profile);
      })
      .catch(() => { setHasProfile(false); })
      .finally(() => setLoading(false));
  }, [mounted]);

  if (!mounted || loading) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  if (!userId) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Open in Telegram</div>;
  if (hasProfile) return <DashboardView profile={profile} coaching={coaching} />;

  // Assessment
  const totalQ = S1_QUESTIONS.length + 1 + S3_QUESTIONS.length;
  let done = step === "s1" ? q1Index : step === "s2" ? S1_QUESTIONS.length : step === "s3" ? S1_QUESTIONS.length + 1 + q3Index : step === "submitting" ? totalQ : 0;
  const pct = Math.round((done / totalQ) * 100);

  async function submit() {
    setStep("submitting");
    try {
      const res = await fetch("/api/assessment/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ intake: { ...intake, telegram: userName }, s1Answers, s2Answers, s3Answers, telegramUserId: userId }) });
      const data = await res.json() as { leaderId?: string; error?: string };
      if (!data.leaderId) throw new Error(data.error ?? "failed");
      // Reload profile
      const res2 = await fetch(`/api/profile?user_id=${userId}`);
      const d2 = await res2.json() as { profile?: Profile; coaching?: CoachingEntry[] };
      setProfile(d2.profile ?? null);
      setCoaching(d2.coaching ?? []);
      setHasProfile(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Submission failed");
      setStep("s3");
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "system-ui" }}>
      {step !== "intake" && step !== "submitting" && (
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 4, background: "#1e1e1e", borderRadius: 2 }}><div style={{ height: 4, width: `${pct}%`, background: "#cc0000", borderRadius: 2 }} /></div>
          <span style={{ color: "#555", fontSize: 11 }}>{pct}%</span>
        </div>
      )}

      {step === "intake" && (
        <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
          <p style={{ color: "#cc0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, margin: "0 0 6px" }}>Leadership Pipeline</p>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>Kingdom Mandate Assessment</h1>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px", lineHeight: 1.7 }}>Measures your Kingdom Readiness Score across eight spiritual domains.</p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#aaa", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>Full Name *</label>
            <input type="text" value={intake.name} onChange={e => setIntake(i => ({ ...i, name: e.target.value }))} style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "13px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#aaa", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>Email (optional)</label>
            <input type="email" value={intake.email} onChange={e => setIntake(i => ({ ...i, email: e.target.value }))} style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "13px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          <button onClick={() => { fetch("/api/assessment/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...intake, telegram: userName }) }).catch(() => {}); setStep("s1"); }} disabled={!intake.name.trim()}
            style={{ width: "100%", padding: 15, background: intake.name.trim() ? "#cc0000" : "#1a1a1a", color: intake.name.trim() ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: intake.name.trim() ? "pointer" : "not-allowed" }}>
            Begin Assessment →
          </button>
        </div>
      )}

      {step === "s1" && (() => {
        const q = S1_QUESTIONS[q1Index];
        const sel = s1Answers[q.number];
        return (
          <div style={{ padding: "20px", maxWidth: 480, margin: "0 auto" }}>
            <p style={{ color: "#555", fontSize: 12, fontWeight: 600, margin: "0 0 16px" }}>Section 1 · {q1Index + 1} of {S1_QUESTIONS.length}</p>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, lineHeight: 1.55, margin: "0 0 24px" }}>{q.text}</p>
            {q.options.map(opt => (
              <button key={opt.label} onClick={() => setS1Answers(p => ({ ...p, [q.number]: opt.label }))}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 18px", marginBottom: 10, background: sel === opt.label ? "#1a0000" : "#111", border: `2px solid ${sel === opt.label ? "#cc0000" : "#1e1e1e"}`, borderRadius: 12, color: sel === opt.label ? "#fff" : "#999", fontSize: 13, cursor: "pointer", lineHeight: 1.5 }}>
                <span style={{ color: "#cc0000", fontWeight: 700, marginRight: 8 }}>{opt.label}</span>{opt.text}
              </button>
            ))}
            <button onClick={() => q1Index < S1_QUESTIONS.length - 1 ? setQ1Index(i => i + 1) : setStep("s2")} disabled={!sel}
              style={{ width: "100%", padding: 14, marginTop: 6, background: sel ? "#cc0000" : "#1a1a1a", color: sel ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: sel ? "pointer" : "not-allowed" }}>
              {q1Index < S1_QUESTIONS.length - 1 ? "Next →" : "Continue to Section 2 →"}
            </button>
          </div>
        );
      })()}

      {step === "s2" && (() => {
        const allFilled = S2_ROWS.every(r => { const a = s2Answers[r.rowNumber]; if (!a) return false; const v = [a.lion, a.otter, a.gr, a.beaver]; return v.every(x => x >= 1 && x <= 4) && new Set(v).size === 4; });
        return (
          <div style={{ padding: "20px", maxWidth: 480, margin: "0 auto" }}>
            <p style={{ color: "#cc0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 6px" }}>Section 2 of 3</p>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Animal Instincts</h2>
            <p style={{ color: "#666", fontSize: 12, margin: "0 0 16px", lineHeight: 1.6 }}>Rank all four words per row: 4 = Most Like Me → 1 = Least. Each number once per row.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #1e1e1e" }}>
              {["🦁 Lion", "🦦 Otter", "🐕 Golden", "🦫 Beaver"].map(h => <div key={h} style={{ textAlign: "center", color: "#555", fontSize: 10, fontWeight: 700 }}>{h}</div>)}
            </div>
            {S2_ROWS.map(row => {
              const a = s2Answers[row.rowNumber] ?? { lion: 0, otter: 0, gr: 0, beaver: 0 };
              return (
                <div key={row.rowNumber} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 10, padding: "10px 6px", background: "#111", borderRadius: 10, border: "1px solid #1e1e1e" }}>
                  {(["lion", "otter", "gr", "beaver"] as const).map((col, ci) => (
                    <div key={col} style={{ textAlign: "center" }}>
                      <p style={{ color: "#ccc", fontSize: 10, margin: "0 0 5px" }}>{[row.lion, row.otter, row.gr, row.beaver][ci]}</p>
                      <select value={a[col] || ""} onChange={e => setS2Answers(p => ({ ...p, [row.rowNumber]: { ...(p[row.rowNumber] ?? { lion: 0, otter: 0, gr: 0, beaver: 0 }), [col]: Number(e.target.value) } }))}
                        style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "5px 2px", color: a[col] ? "#fff" : "#555", fontSize: 13, textAlign: "center" }}>
                        <option value="">—</option>
                        {[4, 3, 2, 1].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              );
            })}
            <button onClick={() => setStep("s3")} disabled={!allFilled}
              style={{ width: "100%", padding: 14, marginTop: 12, background: allFilled ? "#cc0000" : "#1a1a1a", color: allFilled ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: allFilled ? "pointer" : "not-allowed" }}>
              Continue to Section 3 →
            </button>
          </div>
        );
      })()}

      {step === "s3" && (() => {
        const q = S3_QUESTIONS[q3Index];
        const sel = s3Answers[q.number];
        return (
          <div style={{ padding: "20px", maxWidth: 480, margin: "0 auto" }}>
            <p style={{ color: "#555", fontSize: 12, fontWeight: 600, margin: "0 0 10px" }}>Section 3 · {q3Index + 1} of {S3_QUESTIONS.length}</p>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>Choose the statement that resonates more:</p>
            {(["A", "B"] as const).map(opt => (
              <button key={opt} onClick={() => setS3Answers(p => ({ ...p, [q.number]: opt }))}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "20px 18px", marginBottom: 14, background: sel === opt ? "#1a0000" : "#111", border: `2px solid ${sel === opt ? "#cc0000" : "#1e1e1e"}`, borderRadius: 14, color: sel === opt ? "#fff" : "#999", fontSize: 14, cursor: "pointer", lineHeight: 1.6 }}>
                {opt === "A" ? q.optionA : q.optionB}
              </button>
            ))}
            <button onClick={() => q3Index < S3_QUESTIONS.length - 1 ? setQ3Index(i => i + 1) : submit()} disabled={!sel}
              style={{ width: "100%", padding: 14, background: sel ? "#cc0000" : "#1a1a1a", color: sel ? "#fff" : "#444", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: sel ? "pointer" : "not-allowed" }}>
              {q3Index < S3_QUESTIONS.length - 1 ? "Next →" : "Submit Assessment →"}
            </button>
          </div>
        );
      })()}

      {step === "submitting" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16 }}>
          <div style={{ fontSize: 44 }}>⏳</div>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>Calculating your profile...</h2>
          <p style={{ color: "#555", fontSize: 13, margin: 0 }}>This takes about 30 seconds.</p>
        </div>
      )}
    </div>
  );
}

function DashboardView({ profile, coaching }: { profile: Profile | null; coaching: CoachingEntry[] }) {
  const [tab, setTab] = useState<DashTab>("profile");
  const [bibleQuery, setBibleQuery] = useState("");
  const [bibleResponse, setBibleResponse] = useState("");
  const [bibleLoading, setBibleLoading] = useState(false);
  if (!profile) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  const color = LEVEL_COLOR[profile.level_number] ?? "#4a9eff";
  const daysSince = profile.assessed_at ? Math.floor((Date.now() - new Date(profile.assessed_at).getTime()) / 86400000) : 0;
  const p90 = Math.min(100, Math.round((daysSince / 90) * 100));
  async function askBible() {
    if (!bibleQuery.trim()) return;
    setBibleLoading(true); setBibleResponse("");
    try { const r = await fetch("/api/bible", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: bibleQuery }) }); const d = await r.json() as { answer?: string }; setBibleResponse(d.answer ?? "No response."); }
    catch { setBibleResponse("Unable to reach Bible Buddy."); }
    finally { setBibleLoading(false); }
  }
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "system-ui", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ padding: "18px 20px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: color + "22", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{ANIMAL_EMOJI[profile.dominant_animal] ?? "⭐"}</div>
          <div><div style={{ fontWeight: 700, fontSize: 15 }}>{profile.first_name}</div><div style={{ color, fontSize: 11, fontWeight: 600 }}>{profile.level.charAt(0).toUpperCase() + profile.level.slice(1)} · Level {profile.level_number}/5</div></div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ fontSize: 22, fontWeight: 800, color }}>{profile.overall_score}</div><div style={{ fontSize: 10, color: "#555" }}>/ 100</div></div>
        </div>
        <div style={{ display: "flex" }}>
          {(["profile", "plan", "coaching", "progress", "bible"] as DashTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 0", background: "none", border: "none", borderBottom: tab === t ? `2px solid ${color}` : "2px solid transparent", color: tab === t ? "#fff" : "#555", fontSize: 10, fontWeight: tab === t ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>{t === "bible" ? "📖" : t}</button>
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
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span>{label}</span><span style={{ color: "#888" }}>{score}/{max} · {Math.round((score / max) * 100)}%</span></div>
                  <div style={{ height: 4, background: "#1e1e1e", borderRadius: 2 }}><div style={{ height: 4, width: `${(score / max) * 100}%`, background: color, borderRadius: 2 }} /></div>
                </div>
              ))}
            </div>
            {profile.dominant_animal && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Personality</div><div style={{ fontSize: 13 }}>{ANIMAL_EMOJI[profile.dominant_animal]} {profile.dominant_animal.charAt(0).toUpperCase() + profile.dominant_animal.slice(1)}{profile.secondary_animal && ` · ${ANIMAL_EMOJI[profile.secondary_animal]} ${profile.secondary_animal.charAt(0).toUpperCase() + profile.secondary_animal.slice(1)}`}</div></div>}
            {profile.strengths && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Strengths</div><div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, whiteSpace: "pre-line" }}>{profile.strengths}</div></div>}
            {profile.growth_areas && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Growth Areas</div><div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, whiteSpace: "pre-line" }}>{profile.growth_areas}</div></div>}
            {profile.calling_direction && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Calling Direction</div><div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{profile.calling_direction}</div></div>}
          </div>
        )}
        {tab === "plan" && <div style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>90-Day Development Plan</div>{profile.ministry_placement ? <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.8, whiteSpace: "pre-line" }}>{profile.ministry_placement}</div> : <div style={{ color: "#555", fontSize: 13 }}>Your plan will appear after your coach reviews your profile.</div>}</div>}
        {tab === "coaching" && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{coaching.length === 0 ? <div style={{ color: "#555", fontSize: 13, textAlign: "center", paddingTop: 40 }}>No coaching messages yet.</div> : coaching.map(e => <div key={e.id} style={{ background: "#111", borderRadius: 12, padding: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 10, color, fontWeight: 600, textTransform: "uppercase" }}>{e.day_type}</span><span style={{ fontSize: 10, color: "#555" }}>{new Date(e.sent_at).toLocaleDateString()}</span></div><div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{e.message_text}</div>{e.response_text && <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 8, marginTop: 10, fontSize: 12, color: "#888" }}><span style={{ color: "#555" }}>Your reply: </span>{e.response_text}</div>}</div>)}</div>}
        {tab === "progress" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>90-Day Cycle</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}><span>Day {daysSince}</span><span style={{ color: "#555" }}>Day 90</span></div>
              <div style={{ height: 8, background: "#1e1e1e", borderRadius: 4 }}><div style={{ height: 8, width: `${p90}%`, background: color, borderRadius: 4 }} /></div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{p90 >= 100 ? "🔄 Retest due — send /retest to the bot" : `${90 - daysSince} days until retest`}</div>
            </div>
            <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Pipeline</div>
              {["Seeker", "Disciple", "Servant", "Leader", "Multiplier"].map((name, i) => {
                const lvl = i + 1; const active = lvl === profile.level_number; const done = lvl < profile.level_number;
                return <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div style={{ width: 26, height: 26, borderRadius: "50%", background: done ? color + "33" : active ? color : "#1e1e1e", border: `2px solid ${done || active ? color : "#333"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: done || active ? color : "#444", flexShrink: 0 }}>{done ? "✓" : lvl}</div><span style={{ fontSize: 13, color: active ? "#fff" : done ? "#888" : "#444", fontWeight: active ? 700 : 400 }}>{name}</span>{active && <span style={{ marginLeft: "auto", fontSize: 10, color, fontWeight: 600 }}>CURRENT</span>}</div>;
              })}
            </div>
          </div>
        )}
        {tab === "bible" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#111", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>📖 <strong style={{ color: "#fff" }}>Bible Buddy</strong> — Ask anything about scripture.</div>
              <textarea value={bibleQuery} onChange={e => setBibleQuery(e.target.value)} placeholder="What does the Bible say about leadership?" rows={3} style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, padding: "10px 12px", resize: "none", outline: "none", boxSizing: "border-box" }} />
              <button onClick={askBible} disabled={bibleLoading || !bibleQuery.trim()} style={{ marginTop: 8, width: "100%", padding: "10px 0", background: bibleLoading ? "#1a1a1a" : "#1a3a1a", border: `1px solid ${bibleLoading ? "#333" : "#2a5a2a"}`, borderRadius: 8, color: bibleLoading ? "#555" : "#44cc44", fontSize: 13, fontWeight: 600, cursor: bibleLoading ? "default" : "pointer" }}>{bibleLoading ? "Searching..." : "Ask Bible Buddy"}</button>
            </div>
            {bibleResponse && <div style={{ background: "#111", borderRadius: 12, padding: 14, fontSize: 13, color: "#ccc", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{bibleResponse}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
