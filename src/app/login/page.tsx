"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#0a0a0a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Image src="/logo.png" alt="Jesus Generation" width={56} height={56} style={{ objectFit: "contain", marginBottom: 16 }} />
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 4px", letterSpacing: 1 }}>JESUS GENERATION</h1>
          <p style={{ color: "#cc0000", fontSize: 11, margin: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Leadership Portal</p>
        </div>

        {sent ? (
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Check your email</h2>
            <p style={{ color: "#777", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
              We sent a magic link to <span style={{ color: "#fff" }}>{email}</span>. Click it to sign in.
            </p>
            <button
              onClick={() => setSent(false)}
              style={{ color: "#cc0000", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 32 }}>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Sign in</h2>
            <p style={{ color: "#777", fontSize: 13, margin: "0 0 24px" }}>We'll send a magic link to your email.</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%", padding: "14px 16px", background: "#1a1a1a",
                  border: "1px solid #2a2a2a", borderRadius: 10, color: "#fff",
                  fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 12,
                }}
              />
              {error && <p style={{ color: "#ff4444", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "14px", background: "#cc0000",
                  border: "none", borderRadius: 10, color: "#fff",
                  fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
