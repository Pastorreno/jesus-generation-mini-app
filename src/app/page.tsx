"use client";

import { useEffect, useState } from "react";

type Profile = {
  first_name: string; overall_score: number; level: string; level_number: number;
};

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void; initDataUnsafe?: { user?: { id?: number } } } } }).Telegram?.WebApp;
      if (!tg) { setLoading(false); return; }
      tg.ready?.(); tg.expand?.();
      const id = tg.initDataUnsafe?.user?.id;
      if (!id) { setLoading(false); return; }
      setUserId(id);
      fetch(`/api/profile?user_id=${id}`)
        .then(r => r.json())
        .then((d: { profile?: Profile }) => { setProfile(d.profile ?? null); })
        .catch(e => { setError(String(e)); })
        .finally(() => setLoading(false));
    } catch(e) {
      setError(String(e));
      setLoading(false);
    }
  }, [mounted]);

  if (!mounted || loading) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  if (error) return <div style={{ background: "#0a0a0a", color: "red", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>Error: {error}</div>;
  if (!userId) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Open in Telegram</div>;
  if (!profile) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>No profile — send /start to bot</div>;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "system-ui", padding: 20 }}>
      <h1>✅ {profile.first_name}</h1>
      <p>Score: {profile.overall_score}</p>
      <p>Level: {profile.level_number} — {profile.level}</p>
    </div>
  );
}
