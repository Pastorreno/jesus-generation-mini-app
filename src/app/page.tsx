"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("loading");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void; initDataUnsafe?: { user?: { id?: number; first_name?: string } } } } }).Telegram?.WebApp;
    if (!tg) { setStatus("no-telegram"); return; }
    tg.ready?.();
    tg.expand?.();
    const id = tg.initDataUnsafe?.user?.id;
    if (id) { setUserId(id); setStatus("ok"); }
    else setStatus("no-user");
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 32 }}>✅</div>
      <div>Status: {status}</div>
      {userId && <div>User ID: {userId}</div>}
    </div>
  );
}
