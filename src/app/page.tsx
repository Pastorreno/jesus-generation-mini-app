"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TgUser = { id: number; first_name: string; username?: string };

type Profile = {
  first_name: string;
  overall_score?: number;
  level?: string;
  level_number?: number;
  character_score?: number;
  competency_score?: number;
  consistency_score?: number;
  animal_primary?: string;   dominant_animal?: string;
  animal_secondary?: string; secondary_animal?: string;
  bot_mode?: string;
  ai_narrative?: string;     profile_card?: string;
  fat_gate_passed?: boolean; fat_gate_triggered?: boolean;
};

const LEVEL_COLOR: Record<number, string> = {
  1: "#4a9eff", 2: "#44aa44", 3: "#ffaa00", 4: "#ff6600", 5: "#cc0000",
};
const ANIMAL_EMOJI: Record<string, string> = {
  Lion: "🦁", Otter: "🦦", "Golden Retriever": "🐕", Beaver: "🦫",
};

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#aaa", fontSize: 12 }}>{label}</span>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, background: "#1e1e1e", borderRadius: 4 }}>
        <div style={{ height: "100%", borderRadius: 4, background: color, width: `${pct}%`, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [tgUser, setTgUser] = useState<TgUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void; initDataUnsafe?: { user?: TgUser } } } }).Telegram?.WebApp;
    if (!tg) { setLoading(false); return; }
    tg.ready?.();
    tg.expand?.();
    const user = tg.initDataUnsafe?.user;
    if (!user?.id) { setLoading(false); return; }
    setTgUser(user);
    fetch(`/api/profile?user_id=${user.id}`)
      .then(r => r.json())
      .then((d: { profile?: Profile }) => setProfile(
        // Only treat as a real profile if assessment was actually completed
        (d.profile?.overall_score ?? 0) > 0 ? d.profile ?? null : null
      ))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const bg = "#0a0a0a";

  if (loading) return (
    <div style={{ background: bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 32, height: 32, border: "3px solid #333", borderTop: "3px solid #cc0000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!tgUser) return (
    <div style={{ background: bg, color: "#555", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
      Open in Telegram
    </div>
  );

  const levelNum = profile?.level_number ?? 0;
  const levelColor = LEVEL_COLOR[levelNum] ?? "#555";
  const name = profile?.first_name ?? tgUser.first_name;
  const animalPrimary = profile?.animal_primary ?? profile?.dominant_animal;
  const animalSecondary = profile?.animal_secondary ?? profile?.secondary_animal;
  const narrative = profile?.ai_narrative ?? profile?.profile_card;
  const fatPassed = profile?.fat_gate_passed ?? (profile?.fat_gate_triggered === false ? true : undefined);

  return (
    <div style={{ background: bg, minHeight: "100vh", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", padding: "20px 16px 40px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "#cc0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 4px" }}>
          ETS Academy
        </p>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 2px" }}>
          {profile ? `Welcome back, ${name}` : `Welcome, ${tgUser.first_name}`}
        </h1>
        {tgUser.username && (
          <p style={{ color: "#444", fontSize: 12, margin: 0 }}>@{tgUser.username}</p>
        )}
      </div>

      {!profile ? (
        /* ── NO PROFILE: launch assessment ── */
        <div>
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 28, marginBottom: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>
              Kingdom Mandate Assessment
            </h2>
            <p style={{ color: "#555", fontSize: 13, lineHeight: 1.7, margin: "0 0 24px" }}>
              30 questions. Measures your leadership level across Character, Competency, and Consistency. Takes about 10 minutes.
            </p>
            <button
              onClick={() => router.push(`/assessment?telegram_id=${tgUser.id}&name=${encodeURIComponent(tgUser.first_name)}&username=${encodeURIComponent(tgUser.username ?? "")}`)}
              style={{
                width: "100%", padding: 16, background: "#cc0000", color: "#fff",
                border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}
            >
              Begin Assessment →
            </button>
          </div>
          <p style={{ color: "#333", fontSize: 12, textAlign: "center" }}>
            No account needed — your Telegram identity is used automatically
          </p>
        </div>
      ) : (
        /* ── HAS PROFILE: full dashboard ── */
        <>
          {/* Level + score */}
          <div style={{ background: "#111", border: `1px solid ${levelColor}33`, borderRadius: 16, padding: "20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Pipeline Level</p>
              <p style={{ color: levelColor, fontSize: 28, fontWeight: 800, margin: "0 0 2px" }}>Level {levelNum}</p>
              <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>{profile.level ?? "—"}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Overall Score</p>
              <p style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0 }}>{profile.overall_score ?? 0}</p>
            </div>
          </div>

          {/* Animal personality */}
          {animalPrimary && (
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{ANIMAL_EMOJI[animalPrimary] ?? "🐾"}</span>
              <div>
                <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 2px" }}>Personality</p>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: 0 }}>
                  {animalPrimary}{animalSecondary ? ` / ${animalSecondary}` : ""}
                </p>
              </div>
              {profile.bot_mode && (
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 2px" }}>Mode</p>
                  <p style={{ color: "#ffaa00", fontSize: 13, fontWeight: 700, margin: 0, textTransform: "capitalize" }}>{profile.bot_mode}</p>
                </div>
              )}
            </div>
          )}

          {/* C/C/C scores */}
          {((profile.character_score ?? 0) > 0 || (profile.competency_score ?? 0) > 0 || (profile.consistency_score ?? 0) > 0) && (
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>C/C/C Breakdown</p>
              <ScoreBar label="Character" value={profile.character_score ?? 0} max={32} color="#4a9eff" />
              <ScoreBar label="Competency" value={profile.competency_score ?? 0} max={28} color="#44aa44" />
              <ScoreBar label="Consistency" value={profile.consistency_score ?? 0} max={40} color="#ffaa00" />
              {fatPassed !== undefined && (
                <p style={{ color: fatPassed ? "#44aa44" : "#cc0000", fontSize: 11, margin: "8px 0 0", fontWeight: 600 }}>
                  {fatPassed ? "✓ F.A.T. Gate passed" : "✗ F.A.T. Gate not yet passed"}
                </p>
              )}
            </div>
          )}

          {/* AI narrative */}
          {narrative && (
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Your Profile</p>
              <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                {narrative.slice(0, 400)}{narrative.length > 400 ? "…" : ""}
              </p>
            </div>
          )}

          {/* Coaching reminder */}
          <div style={{ background: "#0f0f0f", border: "1px solid #44aa4422", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <p style={{ color: "#aaa", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Coaching messages arrive <span style={{ color: "#fff" }}>Mon / Wed / Fri</span> in the bot.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
