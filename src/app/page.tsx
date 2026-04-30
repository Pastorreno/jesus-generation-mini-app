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
  dominant_animal?: string;
  secondary_animal?: string;
  bot_mode?: string;
  profile_card?: string;
  spiritual_gift_primary?: string;
  spiritual_gift_secondary?: string;
  spiritual_gift_tertiary?: string;
  leadership_style_primary?: string;
  eq_overall?: number;
};

const LEVEL_COLOR: Record<number, string> = {
  1: "#4a9eff", 2: "#44aa44", 3: "#ffaa00", 4: "#ff6600", 5: "#cc0000",
};
const ANIMAL_EMOJI: Record<string, string> = {
  Lion: "🦁", Otter: "🦦", "Golden Retriever": "🐕", Beaver: "🦫",
};
const STYLE_EMOJI: Record<string, string> = {
  Director: "🎯", Coach: "🤝", Supporter: "🛡️", Delegator: "🚀",
};

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ color: "#aaa", fontSize: 12 }}>{label}</span>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 5, background: "#1e1e1e", borderRadius: 4 }}>
        <div style={{ height: "100%", borderRadius: 4, background: color, width: `${value}%`, transition: "width 0.6s ease" }} />
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
    tg.ready?.(); tg.expand?.();
    const user = tg.initDataUnsafe?.user;
    if (!user?.id) { setLoading(false); return; }
    setTgUser(user);

    // Capture identity immediately — fire and forget
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: user.id, first_name: user.first_name, username: user.username ?? '' }),
    }).catch(() => {});

    fetch(`/api/profile?user_id=${user.id}`)
      .then(r => r.json())
      .then((d: { profile?: Profile }) => setProfile(
        (d.profile?.overall_score ?? 0) > 0 ? d.profile ?? null : null
      ))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ background: "#0a0a0a", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 32, height: 32, border: "3px solid #333", borderTop: "3px solid #cc0000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!tgUser) return (
    <div style={{ background: "#0a0a0a", color: "#555", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
      Open in Telegram
    </div>
  );

  const levelNum = profile?.level_number ?? 0;
  const levelColor = LEVEL_COLOR[levelNum] ?? "#555";
  const name = profile?.first_name ?? tgUser.first_name;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", padding: "20px 16px 48px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "#cc0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 4px" }}>ETS Academy</p>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 2px" }}>
          {profile ? `Welcome back, ${name}` : `Welcome, ${tgUser.first_name}`}
        </h1>
        {tgUser.username && <p style={{ color: "#444", fontSize: 12, margin: 0 }}>@{tgUser.username}</p>}
      </div>

      {!profile ? (
        <div>
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 28, marginBottom: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>Spiritual DNA Assessment</h2>
            <p style={{ color: "#555", fontSize: 13, lineHeight: 1.7, margin: "0 0 8px" }}>
              6 sections · ~15 minutes · Built on Acts 2:42-47
            </p>
            <p style={{ color: "#444", fontSize: 12, lineHeight: 1.6, margin: "0 0 24px" }}>
              Measures your Character, Competency, Comprehension, Spiritual Gifts, Leadership Style, and Emotional Intelligence.
            </p>
            <button
              onClick={() => router.push(`/assessment?telegram_id=${tgUser.id}&name=${encodeURIComponent(tgUser.first_name)}&username=${encodeURIComponent(tgUser.username ?? "")}`)}
              style={{ width: "100%", padding: 16, background: "#cc0000", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              Begin Assessment →
            </button>
          </div>
          <p style={{ color: "#333", fontSize: 12, textAlign: "center" }}>Your Telegram identity is used automatically — no account needed</p>
        </div>
      ) : (
        <>
          {/* Level + Score */}
          <div style={{ background: "#111", border: `1px solid ${levelColor}33`, borderRadius: 16, padding: 20, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Pipeline Level</p>
              <p style={{ color: levelColor, fontSize: 28, fontWeight: 800, margin: "0 0 2px" }}>Level {levelNum}</p>
              <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>{profile.level}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>LPS Score</p>
              <p style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0 }}>{profile.overall_score}</p>
            </div>
          </div>

          {/* C/C/C + Alignment + Stewardship bars */}
          {(profile.character_score ?? 0) > 0 && (
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 14px" }}>Spiritual Maturity</p>
              <Bar label="Character (FAT)" value={profile.character_score ?? 0} color="#4a9eff" />
              <Bar label="Competency" value={profile.competency_score ?? 0} color="#44aa44" />
              <Bar label="Comprehension" value={profile.consistency_score ?? 0} color="#ffaa00" />
            </div>
          )}

          {/* Gifts */}
          {profile.spiritual_gift_primary && (
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>Spiritual Gifts</p>
              {[
                { label: "Primary", value: profile.spiritual_gift_primary, color: "#cc0000" },
                { label: "Secondary", value: profile.spiritual_gift_secondary, color: "#ffaa00" },
                { label: "Tertiary", value: profile.spiritual_gift_tertiary, color: "#555" },
              ].filter(g => g.value).map(g => (
                <div key={g.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#444", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{g.label}</span>
                  <span style={{ color: g.color, fontSize: 13, fontWeight: 700 }}>{g.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Personality + Leadership + EQ row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {profile.dominant_animal && (
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "14px 16px" }}>
                <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Temperament</p>
                <p style={{ fontSize: 24, margin: "0 0 4px" }}>{ANIMAL_EMOJI[profile.dominant_animal] ?? "🐾"}</p>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0 }}>{profile.dominant_animal}</p>
                {profile.secondary_animal && <p style={{ color: "#555", fontSize: 11, margin: "2px 0 0" }}>{profile.secondary_animal}</p>}
              </div>
            )}
            {profile.leadership_style_primary && (
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "14px 16px" }}>
                <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Leadership</p>
                <p style={{ fontSize: 24, margin: "0 0 4px" }}>{STYLE_EMOJI[profile.leadership_style_primary] ?? "👑"}</p>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0 }}>{profile.leadership_style_primary}</p>
              </div>
            )}
          </div>

          {/* EQ */}
          {(profile.eq_overall ?? 0) > 0 && (
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "16px 20px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Emotional Intelligence</p>
                <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>Self-awareness · Empathy · Regulation</p>
              </div>
              <p style={{ color: profile.eq_overall! >= 70 ? "#44aa44" : profile.eq_overall! >= 40 ? "#ffaa00" : "#cc0000", fontSize: 28, fontWeight: 800, margin: 0 }}>{profile.eq_overall}</p>
            </div>
          )}

          {/* AI Profile */}
          {profile.profile_card && (
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Your Profile</p>
              <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                {profile.profile_card.slice(0, 500)}{profile.profile_card.length > 500 ? "…" : ""}
              </p>
            </div>
          )}

          {/* Bot mode + coaching */}
          <div style={{ background: "#0f0f0f", border: "1px solid #44aa4422", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <p style={{ color: "#aaa", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Coaching mode: <span style={{ color: "#ffaa00", fontWeight: 700, textTransform: "capitalize" }}>{profile.bot_mode ?? "active"}</span> · Messages arrive <span style={{ color: "#fff" }}>Mon / Wed / Fri</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
