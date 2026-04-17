import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Top nav */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1e1e1e", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="JGC" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>JESUS GENERATION</span>
          <span style={{ color: "#333", fontSize: 14 }}>|</span>
          <span style={{ color: "#cc0000", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Portal</span>
        </div>
        <form action="/auth/signout" method="post">
          <a href="/auth/signout" style={{ color: "#555", fontSize: 13, textDecoration: "none" }}>Sign out</a>
        </form>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </div>
    </div>
  );
}
