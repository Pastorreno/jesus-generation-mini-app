"use client";

import { useEffect, useState } from "react";
import { S1_QUESTIONS } from "@/lib/questions";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
      <div>✅ Questions loaded: {S1_QUESTIONS.length}</div>
    </div>
  );
}
