"use client";

import { useEffect, useState } from "react";
import { S1_QUESTIONS, S2_ROWS, S3_QUESTIONS } from "@/lib/questions";

type S1Answers = Record<number, "A" | "B" | "C" | "D">;
type S2Answers = Record<number, { lion: number; otter: number; gr: number; beaver: number }>;
type S3Answers = Record<number, "A" | "B">;
type AssessmentStep = "intake" | "s1" | "s2" | "s3" | "submitting";
interface Intake { name: string; email: string; phone: string; }

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
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
      .then((d: { profile?: unknown }) => { setHasProfile(!!d.profile); })
      .catch(() => { setHasProfile(false); })
      .finally(() => setLoading(false));
  }, [mounted]);

  if (!mounted || loading) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  if (!userId) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Open in Telegram</div>;
  if (hasProfile) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>✅ Has profile — dashboard goes here</div>;

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
