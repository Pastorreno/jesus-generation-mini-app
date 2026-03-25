"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { findMember, type MemberScore } from "@/data/members";

type TelegramUser = {
  first_name: string;
  last_name?: string;
  username?: string;
  id: number;
};

type Tab = "dashboard" | "assessment" | "resources" | "prayer";

// The 5 pipeline sections from the real leadership assessment
const PIPELINE_SECTIONS = [
  {
    id: "character",
    number: 1,
    title: "Character",
    subtitle: "1 Timothy 3:1-7",
    description: "Integrity, moral purity, and Christ-like conduct",
    icon: "✝️",
    color: "#cc0000",
    maxScore: 50,
    items: [
      "Integrity even when no one is watching",
      "Managing household well",
      "Quick to forgive, slow to anger",
      "Spiritual disciplines (prayer, fasting, Bible)",
      "Handling criticism with humility",
      "Trustworthy with confidential information",
      "Avoiding gossip, speaking truth in love",
      "Sexual purity and moral boundaries",
      "Free from addictions",
      "Honoring commitments",
    ],
  },
  {
    id: "competency",
    number: 2,
    title: "Competency",
    subtitle: "Practical Skills",
    description: "Ministry skills and leadership effectiveness",
    icon: "⚡",
    color: "#cc0000",
    maxScore: 50,
    items: [
      "Sharing the Gospel clearly",
      "Teaching biblical concepts",
      "Organizing events and teams",
      "Verbal and written communication",
      "Handling conflict with wisdom",
      "Mentoring others in faith",
      "Time management",
      "Adapting to change",
      "Problem solving",
      "Using technology for ministry",
    ],
  },
  {
    id: "ownership",
    number: 3,
    title: "Ownership",
    subtitle: "Initiative & Responsibility",
    description: "Taking initiative and driving action",
    icon: "🔥",
    color: "#cc0000",
    maxScore: 50,
    items: [
      "Taking action without being asked",
      "Owning mistakes and learning from them",
      "Following through without reminders",
      "Improving systems and processes",
      "Investing personal time and resources",
      "Prioritizing mission over preferences",
      "Stepping up during crises",
      "Ownership of others' spiritual growth",
      "Investing in personal development",
      "Viewing challenges as opportunities",
    ],
  },
  {
    id: "relational",
    number: 4,
    title: "Relational Health",
    subtitle: "Community & Relationships",
    description: "Building healthy relationships and teams",
    icon: "🤝",
    color: "#cc0000",
    maxScore: 50,
    items: [
      "Building relationships across backgrounds",
      "Working well in teams",
      "Submitting to authority",
      "Celebrating others' successes",
      "Maintaining appropriate boundaries",
      "Being approachable and accessible",
      "Resolving conflicts quickly",
      "Deep vs. surface-level friendships",
      "Giving and receiving feedback",
      "Prioritizing unity in the body of Christ",
    ],
  },
];

const RESOURCES = [
  { title: "Leadership Manual", description: "Core leadership principles", icon: "📖" },
  { title: "Cell Group Guide", description: "Running effective small groups", icon: "👥" },
  { title: "Evangelism Toolkit", description: "Reaching your community", icon: "🌍" },
  { title: "Prayer Guide", description: "Building a prayer culture", icon: "🙏" },
  { title: "Character Assessment", description: "Review your full pipeline scores", icon: "📊" },
  { title: "Mentorship Guide", description: "Developing the next generation", icon: "🌱" },
];

// Score label → numeric value
function parseScore(label: string): number {
  if (label.startsWith("5")) return 5;
  if (label.startsWith("4")) return 4;
  if (label.startsWith("3")) return 3;
  if (label.startsWith("2")) return 2;
  if (label.startsWith("1")) return 1;
  return 0;
}

function getScoreLabel(pct: number): string {
  if (pct >= 90) return "Excellent";
  if (pct >= 75) return "Strong";
  if (pct >= 60) return "Growing";
  if (pct >= 45) return "Developing";
  return "Emerging";
}

function getScoreColor(pct: number): string {
  if (pct >= 75) return "#cc0000";
  if (pct >= 50) return "#ff6600";
  return "#555";
}

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [member, setMember] = useState<MemberScore | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [prayerText, setPrayerText] = useState("");
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // Use real scores if member found, otherwise show demo scores
  const sectionScores = member?.scores ?? { character: 38, competency: 30, ownership: 33, relational: 40 };

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const telegramUser = tg.initDataUnsafe?.user;
      if (telegramUser) {
        setUser(telegramUser);
        setMember(findMember(telegramUser.username));
        return;
      }
    }
    // Fallback for testing outside Telegram
    setUser({ first_name: "Mareneo", username: "Pastor_Reno", id: 1306732735 });
  }, []);

  const overallScore = Math.round(
    Object.values(sectionScores).reduce((a, b) => a + b, 0) / (50 * 4) * 100
  );

  const handlePrayerSubmit = () => {
    if (prayerText.trim()) {
      setPrayerSubmitted(true);
      setPrayerText("");
    }
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1e1e1e", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <Image src="/logo.png" alt="Jesus Generation" width={36} height={36} style={{ objectFit: "contain" }} />
        <div>
          <h1 style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 1 }}>JESUS GENERATION</h1>
          <p style={{ color: "#cc0000", fontSize: 10, margin: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Leadership Pipeline</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div style={{ padding: 20 }}>

            {/* Welcome */}
            <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #2a0000 100%)", border: "1px solid #3a0000", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <p style={{ color: "#cc0000", fontSize: 11, margin: "0 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Welcome back</p>
              <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 12px" }}>{user?.first_name || "Leader"} 👋</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {user?.username && (
                  <p style={{ color: "#777", fontSize: 12, margin: 0 }}>Username: <span style={{ color: "#aaa" }}>@{user.username}</span></p>
                )}
                <p style={{ color: "#777", fontSize: 12, margin: 0 }}>Telegram ID: <span style={{ color: "#aaa" }}>{user?.id}</span></p>
              </div>
            </div>

            {/* Overall Score */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid #cc0000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{overallScore}%</span>
              </div>
              <div>
                <p style={{ color: "#666", fontSize: 11, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Pipeline Score</p>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{getScoreLabel(overallScore)}</h3>
                <p style={{ color: "#555", fontSize: 12, margin: 0 }}>Across all 4 assessed areas</p>
              </div>
            </div>

            {/* Section Scores */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <p style={{ color: "#666", fontSize: 11, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1 }}>Assessment Breakdown</p>
              {PIPELINE_SECTIONS.map((section) => {
                const raw = sectionScores[section.id as keyof typeof sectionScores];
                const pct = Math.round((raw / 50) * 100);
                return (
                  <div key={section.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>
                        {section.icon} {section.title}
                      </span>
                      <span style={{ color: getScoreColor(pct), fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#222", borderRadius: 99, height: 6 }}>
                      <div style={{ background: getScoreColor(pct), borderRadius: 99, height: 6, width: `${pct}%`, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calling */}
            {member?.calling && (
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <p style={{ color: "#666", fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Your Calling</p>
                <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.6 }}>✝️ {member.calling}</p>
              </div>
            )}

            {/* Growth Areas */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20 }}>
              <p style={{ color: "#666", fontSize: 11, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Focus Areas for Growth</p>
              {(member?.growth
                ? member.growth.split(/\n|(?<=\.)(?=\s*\d\.)|(?<=\.)(?=\s[A-Z])/).filter(s => s.trim())
                : [
                    "Deepen spiritual disciplines (prayer, fasting, Bible study)",
                    "Build boldness in sharing the Gospel",
                    "Invest in personal development & training",
                  ]
              ).map((area, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc0000", marginTop: 5, flexShrink: 0 }} />
                  <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{area.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ASSESSMENT ── */}
        {activeTab === "assessment" && (
          <div style={{ padding: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Pipeline Assessment</h2>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 24px" }}>Your scores across the 4 leadership dimensions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PIPELINE_SECTIONS.map((section) => {
                const raw = sectionScores[section.id as keyof typeof sectionScores];
                const pct = Math.round((raw / 50) * 100);
                const isOpen = expandedSection === section.id;
                return (
                  <div key={section.id} style={{ background: "#111", border: `1px solid ${isOpen ? "#3a0000" : "#1e1e1e"}`, borderRadius: 16, overflow: "hidden" }}>
                    <button
                      onClick={() => setExpandedSection(isOpen ? null : section.id)}
                      style={{ width: "100%", background: "none", border: "none", padding: 16, cursor: "pointer", textAlign: "left" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1a0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                            {section.icon}
                          </div>
                          <div>
                            <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>
                              {section.number}. {section.title}
                            </p>
                            <p style={{ color: "#555", fontSize: 12, margin: 0 }}>{section.subtitle}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: "#cc0000", fontSize: 18, fontWeight: 800, margin: "0 0 2px" }}>{pct}%</p>
                          <p style={{ color: "#444", fontSize: 11, margin: 0 }}>{getScoreLabel(pct)}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <div style={{ background: "#222", borderRadius: 99, height: 5 }}>
                          <div style={{ background: "#cc0000", borderRadius: 99, height: 5, width: `${pct}%` }} />
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{ borderTop: "1px solid #1e1e1e", padding: "12px 16px 16px" }}>
                        <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px" }}>{section.description}</p>
                        {section.items.map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < section.items.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                            <span style={{ color: "#cc0000", fontSize: 12, marginTop: 2 }}>›</span>
                            <p style={{ color: "#888", fontSize: 13, margin: 0, lineHeight: 1.4 }}>{item}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RESOURCES ── */}
        {activeTab === "resources" && (
          <div style={{ padding: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Resources</h2>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 24px" }}>Tools to grow your leadership</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {RESOURCES.map((resource, i) => (
                <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1a0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {resource.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>{resource.title}</h3>
                    <p style={{ color: "#555", fontSize: 13, margin: 0 }}>{resource.description}</p>
                  </div>
                  <span style={{ color: "#cc0000", fontSize: 20 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRAYER ── */}
        {activeTab === "prayer" && (
          <div style={{ padding: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Prayer Requests</h2>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 24px" }}>Submit your prayer request to the leadership team</p>
            {prayerSubmitted ? (
              <div style={{ background: "linear-gradient(135deg, #1a0000, #2a0000)", border: "1px solid #3a0000", borderRadius: 16, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🙏</div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Prayer Received</h3>
                <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>Your leaders are standing with you in prayer</p>
                <button
                  onClick={() => setPrayerSubmitted(false)}
                  style={{ background: "#cc0000", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <textarea
                  value={prayerText}
                  onChange={(e) => setPrayerText(e.target.value)}
                  placeholder="Share your prayer request..."
                  rows={7}
                  style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: 16, color: "#fff", fontSize: 15, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                />
                <button
                  onClick={handlePrayerSubmit}
                  disabled={!prayerText.trim()}
                  style={{ background: prayerText.trim() ? "#cc0000" : "#1e1e1e", color: prayerText.trim() ? "#fff" : "#444", border: "none", borderRadius: 12, padding: 18, fontSize: 16, fontWeight: 700, cursor: prayerText.trim() ? "pointer" : "default", transition: "all 0.2s" }}
                >
                  🙏 Submit Prayer Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0a0a0a", borderTop: "1px solid #1e1e1e", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "8px 0 16px" }}>
        {([
          { tab: "dashboard", icon: "⊞", label: "Dashboard" },
          { tab: "assessment", icon: "📊", label: "Assessment" },
          { tab: "resources", icon: "📚", label: "Resources" },
          { tab: "prayer", icon: "🙏", label: "Prayer" },
        ] as { tab: Tab; icon: string; label: string }[]).map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0" }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 10, color: activeTab === tab ? "#cc0000" : "#444", fontWeight: activeTab === tab ? 700 : 400, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
