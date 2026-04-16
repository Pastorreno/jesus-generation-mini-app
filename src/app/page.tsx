"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { findMember, type MemberScore } from "@/data/members";

// ─── UPDATE THESE ────────────────────────────────────────────────
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@JesusGenerationChurch"; // ← replace with real URL
const GIVE_LINK = "https://cash.app/$JesusGeneration"; // ← replace with real link
const GIVE_LABEL = "Cash App"; // ← "Cash App" | "Tithe.ly" | "PayPal" | etc.
const SERVICE_TIMES = [
  { day: "Sunday", time: "10:00 AM", location: "Main Sanctuary" },
  { day: "Wednesday", time: "7:00 PM", location: "Main Sanctuary" },
];
const ANNOUNCEMENTS = [
  { title: "New Member Class", date: "April 6", body: "Join us after Sunday service to learn more about becoming an official member of Jesus Generation." },
  { title: "Prayer & Fasting Week", date: "March 31 – April 6", body: "We are calling the entire church to a week of focused prayer and fasting. Details in the channel." },
  { title: "Leadership Pipeline Cohort", date: "Now Open", body: "Applications are open for the next cohort of the Jesus Generation Leadership Pipeline. Speak to a leader to apply." },
];
const VERSE_OF_WEEK = {
  text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
  ref: "Ephesians 2:10 (NIV)",
};
// ─────────────────────────────────────────────────────────────────

type TelegramUser = {
  first_name: string;
  last_name?: string;
  username?: string;
  id: number;
};

type SupabaseProfile = {
  telegram_user_id: number;
  first_name?: string;
  username?: string;
  overall_score?: number;
  character_score?: number;
  competency_score?: number;
  consistency_score?: number;
  level?: string;
  level_number?: number;
  dominant_animal?: string;
  ministry_placement?: string;
  calling_direction?: string;
  strengths?: string;
  growth_areas?: string;
};

type Tab = "home" | "watch" | "give" | "prayer" | "calling" | "pipeline" | "assessment" | "resources";

// ─── CALLING ASSESSMENT ──────────────────────────────────────────
const CALLING_QUESTIONS = [
  // Section 1: Calling Clarity
  {
    id: 1,
    section: "Calling Clarity",
    question: "How would you describe your sense of personal calling from God?",
    options: [
      { text: "I haven't thought much about it yet", score: 1 },
      { text: "I have a general sense but nothing specific", score: 2 },
      { text: "I believe I know my calling but I'm still developing it", score: 3 },
      { text: "I have a clear, confirmed calling I am actively walking in", score: 4 },
    ],
  },
  {
    id: 2,
    section: "Calling Clarity",
    question: "When you serve in ministry, which activity energizes you most?",
    options: [
      { text: "I'm not sure — I'm still discovering what I enjoy", score: 1 },
      { text: "Helping with practical tasks behind the scenes", score: 2 },
      { text: "Connecting with and caring for people one-on-one", score: 3 },
      { text: "Teaching, leading, or casting vision for others", score: 4 },
    ],
  },
  {
    id: 3,
    section: "Calling Clarity",
    question: "How do people in your life describe your God-given gifts?",
    options: [
      { text: "No one has really spoken into this area of my life", score: 1 },
      { text: "I've received some encouraging words but nothing specific", score: 2 },
      { text: "Trusted leaders have affirmed specific gifts they see in me", score: 3 },
      { text: "Multiple leaders have consistently confirmed the same gifts", score: 4 },
    ],
  },
  {
    id: 4,
    section: "Calling Clarity",
    question: "How long have you had a sense that God has a specific purpose for your life in ministry?",
    options: [
      { text: "This is new — I'm just starting to think about it", score: 1 },
      { text: "A few months — it's been growing", score: 2 },
      { text: "1–3 years — it's settled in my heart", score: 3 },
      { text: "More than 3 years — it has been refined through experience", score: 4 },
    ],
  },
  {
    id: 5,
    section: "Calling Clarity",
    question: "When you picture your life in 5 years, what is the most consistent vision you see?",
    options: [
      { text: "I don't have a clear picture yet", score: 1 },
      { text: "I see myself growing in my personal faith", score: 2 },
      { text: "I see myself actively serving in a specific ministry area", score: 3 },
      { text: "I see myself leading, discipling, and multiplying others", score: 4 },
    ],
  },
  // Section 2: Spiritual Gifting
  {
    id: 6,
    section: "Spiritual Gifting",
    question: "Which spiritual gift do you feel most expresses who God made you to be?",
    options: [
      { text: "I'm still discovering my gifts", score: 1 },
      { text: "Helps, mercy, or giving", score: 2 },
      { text: "Teaching, exhortation, or shepherding", score: 3 },
      { text: "Apostolic, prophetic, or evangelism", score: 4 },
    ],
  },
  {
    id: 7,
    section: "Spiritual Gifting",
    question: "When you are in a group setting, what role do you naturally step into?",
    options: [
      { text: "I observe and follow others' lead", score: 1 },
      { text: "I support and encourage whoever is leading", score: 2 },
      { text: "I help organize and facilitate the group", score: 3 },
      { text: "I cast direction, build consensus, and take initiative", score: 4 },
    ],
  },
  {
    id: 8,
    section: "Spiritual Gifting",
    question: "How do people typically respond when you share the Word of God?",
    options: [
      { text: "I rarely share the Word with others", score: 1 },
      { text: "People appreciate it but I haven't seen lasting impact", score: 2 },
      { text: "People are regularly encouraged and sometimes transformed", score: 3 },
      { text: "Lives are consistently changed — people seek me out for spiritual input", score: 4 },
    ],
  },
  {
    id: 9,
    section: "Spiritual Gifting",
    question: "Which biblical figure do you relate to most in terms of calling?",
    options: [
      { text: "I'm not sure yet", score: 1 },
      { text: "Barnabas — an encourager and supporter of others", score: 2 },
      { text: "Timothy — being developed by a father in the faith", score: 3 },
      { text: "Paul or Esther — called to something beyond what I can see", score: 4 },
    ],
  },
  {
    id: 10,
    section: "Spiritual Gifting",
    question: "What type of ministry brings you the deepest sense of fulfillment?",
    options: [
      { text: "I'm still exploring different areas", score: 1 },
      { text: "Worship, intercession, or creative arts", score: 2 },
      { text: "Pastoral care, counseling, or hospitality", score: 3 },
      { text: "Evangelism, church planting, or training leaders", score: 4 },
    ],
  },
  // Section 3: Commitment & Availability
  {
    id: 11,
    section: "Commitment",
    question: "How much time per week are you currently able to give to ministry?",
    options: [
      { text: "Less than 1 hour outside of services", score: 1 },
      { text: "1–3 hours per week", score: 2 },
      { text: "4–8 hours per week", score: 3 },
      { text: "More than 8 hours — ministry is a major priority", score: 4 },
    ],
  },
  {
    id: 12,
    section: "Commitment",
    question: "How consistent have you been in attending church and small group?",
    options: [
      { text: "I come when I can — attendance is inconsistent", score: 1 },
      { text: "Fairly consistent but I miss several times a month", score: 2 },
      { text: "I rarely miss — attendance is a priority for me", score: 3 },
      { text: "I am almost always present and I help ensure others are too", score: 4 },
    ],
  },
  {
    id: 13,
    section: "Commitment",
    question: "Are you currently serving in any ministry capacity?",
    options: [
      { text: "Not yet — I'm still finding my place", score: 1 },
      { text: "Occasionally when I'm asked", score: 2 },
      { text: "Yes, I have a consistent serving role", score: 3 },
      { text: "Yes, and I'm also helping develop others in their serving", score: 4 },
    ],
  },
  {
    id: 14,
    section: "Commitment",
    question: "How long have you been consistently part of this local church?",
    options: [
      { text: "Less than 6 months", score: 1 },
      { text: "6 months to 1 year", score: 2 },
      { text: "1–3 years", score: 3 },
      { text: "More than 3 years", score: 4 },
    ],
  },
  {
    id: 15,
    section: "Commitment",
    question: "How do you approach financial stewardship in your life?",
    options: [
      { text: "I'm still developing this area", score: 1 },
      { text: "I give occasionally but it's not consistent", score: 2 },
      { text: "I tithe and give regularly as a spiritual discipline", score: 3 },
      { text: "Generosity is a core part of my lifestyle — I give above my tithe", score: 4 },
    ],
  },
  // Section 4: Character Maturity
  {
    id: 16,
    section: "Character",
    question: "How would you describe your personal spiritual disciplines?",
    options: [
      { text: "I pray and read the Bible occasionally", score: 1 },
      { text: "I have habits but they're inconsistent week to week", score: 2 },
      { text: "I have a consistent daily rhythm of prayer and Bible reading", score: 3 },
      { text: "I have deep, established disciplines including fasting and extended prayer", score: 4 },
    ],
  },
  {
    id: 17,
    section: "Character",
    question: "When someone criticizes or corrects you, how do you typically respond?",
    options: [
      { text: "I tend to get defensive or withdraw", score: 1 },
      { text: "It's hard at first, but I try to process it over time", score: 2 },
      { text: "I receive it well and try to apply it", score: 3 },
      { text: "I actively seek correction — I know it's part of my growth", score: 4 },
    ],
  },
  {
    id: 18,
    section: "Character",
    question: "How do you currently manage your personal responsibilities (family, finances, health)?",
    options: [
      { text: "I'm struggling to keep up in several areas", score: 1 },
      { text: "Things are manageable but there's room for significant improvement", score: 2 },
      { text: "I manage my home well most of the time", score: 3 },
      { text: "My personal life is ordered and it reflects my leadership capacity", score: 4 },
    ],
  },
  {
    id: 19,
    section: "Character",
    question: "How do you relate to authority and spiritual covering in your life?",
    options: [
      { text: "I prefer to operate independently", score: 1 },
      { text: "I respect leadership but struggle to fully submit at times", score: 2 },
      { text: "I am under spiritual covering and honor my leaders", score: 3 },
      { text: "I am deeply planted, coachable, and I reproduce this in others", score: 4 },
    ],
  },
  {
    id: 20,
    section: "Character",
    question: "How do you handle unforgiveness or past hurts in your relationships?",
    options: [
      { text: "I still carry wounds that affect my relationships", score: 1 },
      { text: "I'm in process — I'm working through it with God", score: 2 },
      { text: "I have forgiven and I don't let the past control me", score: 3 },
      { text: "Forgiveness is a lifestyle — I walk in freedom and help others get free", score: 4 },
    ],
  },
  // Section 5: Kingdom Vision
  {
    id: 21,
    section: "Kingdom Vision",
    question: "How do you personally engage with the Great Commission?",
    options: [
      { text: "I believe in it but I'm not actively sharing my faith", score: 1 },
      { text: "I share my faith occasionally when it feels natural", score: 2 },
      { text: "Evangelism is a consistent part of my life", score: 3 },
      { text: "I actively make disciples and train others to do the same", score: 4 },
    ],
  },
  {
    id: 22,
    section: "Kingdom Vision",
    question: "What is your approach to developing others in their faith?",
    options: [
      { text: "I focus mostly on my own growth right now", score: 1 },
      { text: "I encourage others but don't have a formal discipleship relationship", score: 2 },
      { text: "I am actively mentoring or discipling at least one person", score: 3 },
      { text: "I am developing multiple people and building a culture of discipleship", score: 4 },
    ],
  },
  {
    id: 23,
    section: "Kingdom Vision",
    question: "How do you respond when ministry is hard, dry, or produces little visible fruit?",
    options: [
      { text: "I tend to pull back or question whether I'm called", score: 1 },
      { text: "I persist but I struggle with discouragement", score: 2 },
      { text: "I press through and trust God's timing", score: 3 },
      { text: "Adversity deepens my resolve — I see it as part of the process", score: 4 },
    ],
  },
  {
    id: 24,
    section: "Kingdom Vision",
    question: "What is your biggest motivation for wanting to grow in leadership?",
    options: [
      { text: "I want to feel more confident in my faith", score: 1 },
      { text: "I want to serve my church more effectively", score: 2 },
      { text: "I want to make a lasting impact in people's lives", score: 3 },
      { text: "I am compelled by the call — I must build, multiply, and advance the Kingdom", score: 4 },
    ],
  },
  {
    id: 25,
    section: "Kingdom Vision",
    question: "Where do you believe God is leading you in the next season?",
    options: [
      { text: "I'm still seeking direction — I need guidance", score: 1 },
      { text: "Deeper personal growth and healing", score: 2 },
      { text: "Active ministry involvement and developing my gifts", score: 3 },
      { text: "Pioneering, leading, or sending — a new level of Kingdom impact", score: 4 },
    ],
  },
];

function getCallingTier(totalScore: number): { tier: string; color: string; description: string; emoji: string } {
  if (totalScore >= 80) return {
    tier: "The Three",
    color: "#cc0000",
    emoji: "🔥",
    description: "You carry a pioneering, apostolic call. Like Peter, James, and John — you are being positioned for inner-circle Kingdom leadership. The Three carry weight, move first, and build what others will stand on.",
  };
  if (totalScore >= 55) return {
    tier: "The Thirty",
    color: "#ff6600",
    emoji: "⚡",
    description: "You are David's Mighty Men — proven in battle, skilled in your gifting, and emerging into greater influence. The Thirty are backbone builders who hold the line and develop those coming behind them.",
  };
  return {
    tier: "Emerging Leaders",
    color: "#ffaa00",
    emoji: "🌱",
    description: "Every great leader starts here. You are in the foundation-building season — developing your character, establishing your disciplines, and discovering your calling. This is not a lesser place; it is the beginning of something great.",
  };
}

// ─── PIPELINE SECTIONS ───────────────────────────────────────────
const PIPELINE_SECTIONS = [
  {
    id: "character", number: 1, title: "Character", subtitle: "1 Timothy 3:1-7",
    description: "Integrity, moral purity, and Christ-like conduct", icon: "✝️", color: "#cc0000", maxScore: 50,
    items: [
      "Integrity even when no one is watching", "Managing household well", "Quick to forgive, slow to anger",
      "Spiritual disciplines (prayer, fasting, Bible)", "Handling criticism with humility",
      "Trustworthy with confidential information", "Avoiding gossip, speaking truth in love",
      "Sexual purity and moral boundaries", "Free from addictions", "Honoring commitments",
    ],
  },
  {
    id: "competency", number: 2, title: "Competency", subtitle: "Practical Skills",
    description: "Ministry skills and leadership effectiveness", icon: "⚡", color: "#cc0000", maxScore: 50,
    items: [
      "Sharing the Gospel clearly", "Teaching biblical concepts", "Organizing events and teams",
      "Verbal and written communication", "Handling conflict with wisdom", "Mentoring others in faith",
      "Time management", "Adapting to change", "Problem solving", "Using technology for ministry",
    ],
  },
  {
    id: "ownership", number: 3, title: "Ownership", subtitle: "Initiative & Responsibility",
    description: "Taking initiative and driving action", icon: "🔥", color: "#cc0000", maxScore: 50,
    items: [
      "Taking action without being asked", "Owning mistakes and learning from them",
      "Following through without reminders", "Improving systems and processes",
      "Investing personal time and resources", "Prioritizing mission over preferences",
      "Stepping up during crises", "Ownership of others' spiritual growth",
      "Investing in personal development", "Viewing challenges as opportunities",
    ],
  },
  {
    id: "relational", number: 4, title: "Relational Health", subtitle: "Community & Relationships",
    description: "Building healthy relationships and teams", icon: "🤝", color: "#cc0000", maxScore: 50,
    items: [
      "Building relationships across backgrounds", "Working well in teams",
      "Submitting to authority", "Celebrating others' successes",
      "Maintaining appropriate boundaries", "Being approachable and accessible",
      "Resolving conflicts quickly", "Deep vs. surface-level friendships",
      "Giving and receiving feedback", "Prioritizing unity in the body of Christ",
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
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [prayerText, setPrayerText] = useState("");
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // Calling Assessment state
  const [callingStep, setCallingStep] = useState<"intro" | "questions" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [callingAnswers, setCallingAnswers] = useState<number[]>([]);

  // A user is a recognized leader/member if they're in members.ts OR have a Supabase profile
  const isLeader = !!member || !!supabaseProfile;

  // Build sectionScores: prefer live Supabase data, fall back to hardcoded members.ts
  const sectionScores = (() => {
    if (supabaseProfile?.character_score != null || supabaseProfile?.competency_score != null) {
      return {
        character: supabaseProfile.character_score ?? 0,
        competency: supabaseProfile.competency_score ?? 0,
        ownership: 0,
        relational: 0,
      };
    }
    return member?.scores ?? { character: 38, competency: 30, ownership: 33, relational: 40 };
  })();

  // On mount: init Telegram, then fetch Supabase profile
  useEffect(() => {
    let telegramUser: TelegramUser;

    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        telegramUser = tgUser;
        setUser(tgUser);
        // members.ts fallback — still check hardcoded list
        setMember(findMember(tgUser.username));
      } else {
        telegramUser = { first_name: "Mareneo", username: "Pastor_Reno", id: 1306732735 };
        setUser(telegramUser);
        setMember(findMember("Pastor_Reno"));
      }
    } else {
      telegramUser = { first_name: "Mareneo", username: "Pastor_Reno", id: 1306732735 };
      setUser(telegramUser);
      setMember(findMember("Pastor_Reno"));
    }

    // Fetch Supabase profile using Telegram ID
    if (telegramUser?.id) {
      fetch(`/api/profile?telegram_id=${telegramUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setSupabaseProfile(data.profile);
          }
        })
        .catch(() => {
          // Silently ignore — members.ts fallback still active
        });
    }
  }, []);

  // When calling assessment completes, save result to Supabase
  useEffect(() => {
    if (callingStep !== "result" || !user) return;
    const callingTotal = callingAnswers.reduce((a, b) => a + b, 0);
    const callingPct = Math.round((callingTotal / (CALLING_QUESTIONS.length * 4)) * 100);

    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_id: user.id,
        first_name: user.first_name,
        username: user.username,
        calling_score: callingPct,
        // Include pipeline scores if available from members.ts
        ...(member?.scores ? { scores: member.scores } : {}),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        // Refresh the profile after saving
        return fetch(`/api/profile?telegram_id=${user.id}`);
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data?.profile) setSupabaseProfile(data.profile);
      })
      .catch(() => {
        // Silently ignore save errors — result still shown locally
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callingStep]);

  const overallScore = Math.round(
    Object.values(sectionScores).reduce((a, b) => a + b, 0) / (50 * 4) * 100
  );

  const allTabs: { tab: Tab; icon: string; label: string }[] = [
    { tab: "home", icon: "🏠", label: "Home" },
    { tab: "watch", icon: "📺", label: "Watch" },
    { tab: "give", icon: "💝", label: "Give" },
    { tab: "prayer", icon: "🙏", label: "Prayer" },
    { tab: "calling", icon: "✝️", label: "Calling" },
    ...(isLeader ? [
      { tab: "pipeline" as Tab, icon: "⊞", label: "Pipeline" },
      { tab: "assessment" as Tab, icon: "📊", label: "Details" },
      { tab: "resources" as Tab, icon: "📚", label: "Resources" },
    ] : []),
  ];

  const handleCallingAnswer = (score: number) => {
    const newAnswers = [...callingAnswers, score];
    if (currentQ + 1 < CALLING_QUESTIONS.length) {
      setCallingAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
    } else {
      setCallingAnswers(newAnswers);
      setCallingStep("result");
    }
  };

  const callingTotal = callingAnswers.reduce((a, b) => a + b, 0);
  const callingPct = Math.round((callingTotal / (CALLING_QUESTIONS.length * 4)) * 100);
  const callingResult = getCallingTier(callingPct);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1e1e1e", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <Image src="/logo.png" alt="Jesus Generation" width={34} height={34} style={{ objectFit: "contain" }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: 1 }}>JESUS GENERATION</h1>
          <p style={{ color: "#cc0000", fontSize: 9, margin: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Online Church Experience</p>
        </div>
        {user && (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a0000", border: "1px solid #3a0000", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#cc0000", fontSize: 13, fontWeight: 800 }}>
              {user.first_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 88 }}>

        {/* ── HOME ── */}
        {activeTab === "home" && (
          <div style={{ padding: 20 }}>

            {/* Greeting */}
            <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #2a0000 100%)", border: "1px solid #3a0000", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ color: "#cc0000", fontSize: 10, margin: "0 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Welcome</p>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>
                {user?.first_name ? `Hey ${user.first_name} 👋` : "Welcome 👋"}
              </h2>
              <p style={{ color: "#777", fontSize: 13, margin: 0, lineHeight: 1.5 }}>You are part of something greater than yourself. Welcome to the Jesus Generation family.</p>
            </div>

            {/* Verse of the Week */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ color: "#666", fontSize: 10, margin: "0 0 10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>✦ Verse of the Week</p>
              <p style={{ color: "#ddd", fontSize: 15, margin: "0 0 10px", lineHeight: 1.7, fontStyle: "italic" }}>"{VERSE_OF_WEEK.text}"</p>
              <p style={{ color: "#cc0000", fontSize: 12, margin: 0, fontWeight: 700 }}>{VERSE_OF_WEEK.ref}</p>
            </div>

            {/* Service Times */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ color: "#666", fontSize: 10, margin: "0 0 14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>📅 Service Times</p>
              {SERVICE_TIMES.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < SERVICE_TIMES.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>{s.day}</p>
                    <p style={{ color: "#555", fontSize: 12, margin: 0 }}>{s.location}</p>
                  </div>
                  <div style={{ background: "#1a0000", border: "1px solid #3a0000", borderRadius: 8, padding: "6px 14px" }}>
                    <p style={{ color: "#cc0000", fontSize: 13, fontWeight: 700, margin: 0 }}>{s.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <button
                onClick={() => setActiveTab("watch")}
                style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>📺</div>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>Watch</p>
                <p style={{ color: "#555", fontSize: 11, margin: 0 }}>Latest sermons</p>
              </button>
              <button
                onClick={() => setActiveTab("give")}
                style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>💝</div>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>Give</p>
                <p style={{ color: "#555", fontSize: 11, margin: 0 }}>Support the mission</p>
              </button>
              <button
                onClick={() => setActiveTab("prayer")}
                style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>🙏</div>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>Prayer</p>
                <p style={{ color: "#555", fontSize: 11, margin: 0 }}>Submit a request</p>
              </button>
              <button
                onClick={() => { setActiveTab("calling"); setCallingStep("intro"); }}
                style={{ background: "linear-gradient(135deg, #1a0000, #2a0000)", border: "1px solid #3a0000", borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>✝️</div>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>Calling</p>
                <p style={{ color: "#cc0000", fontSize: 11, margin: 0, fontWeight: 600 }}>Discover yours</p>
              </button>
            </div>

            {/* Announcements */}
            <p style={{ color: "#666", fontSize: 10, margin: "0 0 12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>📣 Announcements</p>
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0, flex: 1, paddingRight: 12 }}>{a.title}</p>
                  <span style={{ background: "#1a0000", color: "#cc0000", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{a.date}</span>
                </div>
                <p style={{ color: "#666", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{a.body}</p>
              </div>
            ))}

            {/* Leader CTA */}
            {isLeader && (
              <div
                onClick={() => setActiveTab("pipeline")}
                style={{ background: "linear-gradient(135deg, #1a0000, #2a0000)", border: "1px solid #cc0000", borderRadius: 16, padding: 18, marginTop: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
              >
                <div style={{ fontSize: 28 }}>⊞</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>Pipeline Dashboard</p>
                  <p style={{ color: "#cc0000", fontSize: 12, margin: 0 }}>View your leadership scores →</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── WATCH ── */}
        {activeTab === "watch" && (
          <div style={{ padding: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Watch</h2>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 24px" }}>Sermons from Jesus Generation</p>

            {/* Main CTA */}
            <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #0a0a0a 100%)", border: "1px solid #3a0000", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>📺</div>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Watch Latest Sermons</h3>
              <p style={{ color: "#666", fontSize: 14, margin: "0 0 20px", lineHeight: 1.5 }}>Full sermons, teachings, and special services on our YouTube channel</p>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", background: "#cc0000", color: "#fff", textDecoration: "none", borderRadius: 12, padding: "14px 32px", fontSize: 16, fontWeight: 700 }}
              >
                ▶ Open YouTube Channel
              </a>
            </div>

            {/* Info cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "⛪", title: "Sunday Messages", desc: "Full-length Sunday worship services — worship, word, and altar." },
                { icon: "📖", title: "Midweek Bible Study", desc: "Wednesday night teaching and deep dives into the Word of God." },
                { icon: "🔥", title: "Special Events", desc: "Youth nights, revival services, conferences, and special guests." },
              ].map((item, i) => (
                <a
                  key={i}
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 16, display: "flex", gap: 14, alignItems: "center", textDecoration: "none" }}
                >
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>{item.title}</p>
                    <p style={{ color: "#555", fontSize: 12, margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                  <span style={{ color: "#cc0000", fontSize: 18 }}>›</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── GIVE ── */}
        {activeTab === "give" && (
          <div style={{ padding: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Give</h2>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 24px" }}>Support the mission of Jesus Generation</p>

            {/* Scripture */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 18, marginBottom: 20, textAlign: "center" }}>
              <p style={{ color: "#ddd", fontSize: 14, margin: "0 0 8px", fontStyle: "italic", lineHeight: 1.6 }}>
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
              </p>
              <p style={{ color: "#cc0000", fontSize: 12, fontWeight: 700, margin: 0 }}>2 Corinthians 9:7</p>
            </div>

            {/* Give CTA */}
            <div style={{ background: "linear-gradient(135deg, #1a0000, #2a0000)", border: "1px solid #3a0000", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💝</div>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Give via {GIVE_LABEL}</h3>
              <p style={{ color: "#777", fontSize: 13, margin: "0 0 20px" }}>Safe, quick, and secure giving</p>
              <a
                href={GIVE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", background: "#cc0000", color: "#fff", textDecoration: "none", borderRadius: 12, padding: "14px 32px", fontSize: 16, fontWeight: 700 }}
              >
                Give Now →
              </a>
            </div>

            {/* Giving types */}
            <p style={{ color: "#666", fontSize: 10, margin: "0 0 12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Ways to Give</p>
            {[
              { icon: "⛪", title: "Tithes", desc: "10% of your income — returning to God what's already His. The foundation of covenant giving." },
              { icon: "🌊", title: "Offerings", desc: "Giving above and beyond the tithe. Every offering is an act of faith and worship." },
              { icon: "🌍", title: "Missions", desc: "Funding the Jesus Generation Movement and supporting partner churches and leaders in the network." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 16, marginBottom: 10, display: "flex", gap: 14 }}>
                <div style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{item.title}</p>
                  <p style={{ color: "#666", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
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
                <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, marginTop: 2 }}>🔒</span>
                  <p style={{ color: "#666", fontSize: 13, margin: 0, lineHeight: 1.5 }}>Your prayer request is private and goes only to the JGC leadership team. You are seen and you are covered.</p>
                </div>
                <textarea
                  value={prayerText}
                  onChange={(e) => setPrayerText(e.target.value)}
                  placeholder="Share your prayer request..."
                  rows={7}
                  style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: 16, color: "#fff", fontSize: 15, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                />
                <button
                  onClick={() => { if (prayerText.trim()) setPrayerSubmitted(true); }}
                  disabled={!prayerText.trim()}
                  style={{ background: prayerText.trim() ? "#cc0000" : "#1e1e1e", color: prayerText.trim() ? "#fff" : "#444", border: "none", borderRadius: 12, padding: 18, fontSize: 16, fontWeight: 700, cursor: prayerText.trim() ? "pointer" : "default", transition: "all 0.2s" }}
                >
                  🙏 Submit Prayer Request
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── CALLING ASSESSMENT ── */}
        {activeTab === "calling" && (
          <div style={{ padding: 20 }}>

            {/* INTRO */}
            {callingStep === "intro" && (
              <>
                <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #2a0000 100%)", border: "1px solid #3a0000", borderRadius: 16, padding: 24, marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>✝️</div>
                  <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 10px" }}>Calling Assessment</h2>
                  <p style={{ color: "#888", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                    25 questions to help you discover where God has called you to stand and who He has made you to be.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {[
                    { icon: "🔥", title: "The Three", desc: "Pioneering apostolic leaders — inner-circle Kingdom builders" },
                    { icon: "⚡", title: "The Thirty", desc: "David's Mighty Men — proven, skilled, and rising in influence" },
                    { icon: "🌱", title: "Emerging Leaders", desc: "Foundation builders — discovering calling and building disciplines" },
                  ].map((tier, i) => (
                    <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ fontSize: 26, flexShrink: 0 }}>{tier.icon}</div>
                      <div>
                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>{tier.title}</p>
                        <p style={{ color: "#666", fontSize: 12, margin: 0 }}>{tier.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 14, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, marginTop: 1 }}>ℹ️</span>
                  <p style={{ color: "#666", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                    This assessment covers 5 areas: Calling Clarity, Spiritual Gifting, Commitment, Character, and Kingdom Vision. Answer honestly — there are no wrong answers.
                  </p>
                </div>

                <button
                  onClick={() => { setCallingStep("questions"); setCurrentQ(0); setCallingAnswers([]); }}
                  style={{ width: "100%", background: "#cc0000", color: "#fff", border: "none", borderRadius: 14, padding: "18px 0", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
                >
                  Begin Assessment →
                </button>
              </>
            )}

            {/* QUESTIONS */}
            {callingStep === "questions" && (
              <>
                {/* Progress bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#666", fontSize: 12 }}>Question {currentQ + 1} of {CALLING_QUESTIONS.length}</span>
                    <span style={{ color: "#cc0000", fontSize: 12, fontWeight: 700 }}>{CALLING_QUESTIONS[currentQ].section}</span>
                  </div>
                  <div style={{ background: "#1e1e1e", borderRadius: 99, height: 4 }}>
                    <div style={{ background: "#cc0000", borderRadius: 99, height: 4, width: `${((currentQ + 1) / CALLING_QUESTIONS.length) * 100}%`, transition: "width 0.3s ease" }} />
                  </div>
                </div>

                {/* Question card */}
                <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #111 100%)", border: "1px solid #2a0000", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                  <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                    {CALLING_QUESTIONS[currentQ].question}
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CALLING_QUESTIONS[currentQ].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleCallingAnswer(option.score)}
                      style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#cc0000"; (e.currentTarget as HTMLElement).style.background = "#1a0000"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLElement).style.background = "#111"; }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          <span style={{ color: "#555", fontSize: 11, fontWeight: 700 }}>{String.fromCharCode(65 + i)}</span>
                        </div>
                        <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{option.text}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {currentQ > 0 && (
                  <button
                    onClick={() => { setCurrentQ(currentQ - 1); setCallingAnswers(callingAnswers.slice(0, -1)); }}
                    style={{ background: "none", border: "none", color: "#555", fontSize: 14, cursor: "pointer", padding: "12px 0", marginTop: 8 }}
                  >
                    ← Back
                  </button>
                )}
              </>
            )}

            {/* RESULT */}
            {callingStep === "result" && (
              <>
                <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #2a0000 100%)", border: "1px solid #3a0000", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>{callingResult.emoji}</div>
                  <p style={{ color: "#cc0000", fontSize: 11, margin: "0 0 6px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Your Calling Tier</p>
                  <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>{callingResult.tier}</h2>
                  <p style={{ color: "#777", fontSize: 13, margin: "0 0 16px" }}>Score: {callingPct}% ({callingTotal}/{CALLING_QUESTIONS.length * 4})</p>
                  <div style={{ background: "#1a0000", borderRadius: 99, height: 6, marginBottom: 16 }}>
                    <div style={{ background: callingResult.color, borderRadius: 99, height: 6, width: `${callingPct}%`, transition: "width 0.8s ease" }} />
                  </div>
                </div>

                <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                  <p style={{ color: "#666", fontSize: 10, margin: "0 0 10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>What This Means</p>
                  <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.7 }}>{callingResult.description}</p>
                </div>

                <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                  <p style={{ color: "#666", fontSize: 10, margin: "0 0 12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Next Steps</p>
                  {[
                    { icon: "👤", text: "Share this result with a leader at Jesus Generation for a personal conversation about your calling." },
                    { icon: "📖", text: "Begin or continue the 242Go Leadership Pipeline to develop your gifts and character." },
                    { icon: "🤝", text: "Get connected to a Table of 4 — a small group of peers sharpening each other." },
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid #1a1a1a" : "none" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{step.icon}</span>
                      <p style={{ color: "#888", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{step.text}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setCallingStep("intro"); setCurrentQ(0); setCallingAnswers([]); }}
                  style={{ width: "100%", background: "#1e1e1e", color: "#888", border: "1px solid #2a2a2a", borderRadius: 12, padding: "14px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}
                >
                  Retake Assessment
                </button>
              </>
            )}
          </div>
        )}

        {/* ── PIPELINE DASHBOARD (leaders) ── */}
        {activeTab === "pipeline" && (
          <div style={{ padding: 20 }}>
            <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #2a0000 100%)", border: "1px solid #3a0000", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <p style={{ color: "#cc0000", fontSize: 10, margin: "0 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Welcome back</p>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>{user?.first_name || "Leader"} 👋</h2>
              {user?.username && (
                <p style={{ color: "#777", fontSize: 12, margin: 0 }}>@{user.username}</p>
              )}
            </div>

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

            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <p style={{ color: "#666", fontSize: 11, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1 }}>Assessment Breakdown</p>
              {PIPELINE_SECTIONS.map((section) => {
                const raw = sectionScores[section.id as keyof typeof sectionScores];
                const pct = Math.round((raw / 50) * 100);
                return (
                  <div key={section.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>{section.icon} {section.title}</span>
                      <span style={{ color: getScoreColor(pct), fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#222", borderRadius: 99, height: 6 }}>
                      <div style={{ background: getScoreColor(pct), borderRadius: 99, height: 6, width: `${pct}%`, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {(member?.calling || supabaseProfile?.calling_direction) && (
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <p style={{ color: "#666", fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Your Calling</p>
                <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.6 }}>✝️ {supabaseProfile?.calling_direction || member?.calling}</p>
              </div>
            )}

            {supabaseProfile?.ministry_placement && (
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <p style={{ color: "#666", fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Ministry Placement</p>
                <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{supabaseProfile.ministry_placement}</p>
              </div>
            )}

            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20 }}>
              <p style={{ color: "#666", fontSize: 11, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Focus Areas for Growth</p>
              {(supabaseProfile?.growth_areas
                ? supabaseProfile.growth_areas.split(/\n|(?<=\.)(?=\s*\d\.)|(?<=\.)(?=\s[A-Z])/).filter((s) => s.trim())
                : member?.growth
                ? member.growth.split(/\n|(?<=\.)(?=\s*\d\.)|(?<=\.)(?=\s[A-Z])/).filter((s) => s.trim())
                : ["Deepen spiritual disciplines (prayer, fasting, Bible study)", "Build boldness in sharing the Gospel", "Invest in personal development & training"]
              ).map((area, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc0000", marginTop: 5, flexShrink: 0 }} />
                  <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{area.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ASSESSMENT DETAILS (leaders) ── */}
        {activeTab === "assessment" && (
          <div style={{ padding: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Pipeline Details</h2>
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
                            <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>{section.number}. {section.title}</p>
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

        {/* ── RESOURCES (leaders) ── */}
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
      </div>

      {/* Bottom Navigation — horizontally scrollable */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0a0a0a", borderTop: "1px solid #1e1e1e", padding: "6px 0 16px", zIndex: 10 }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: 6, paddingRight: 6 }}>
          {allTabs.map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "6px 12px",
                minWidth: 64,
                flexShrink: 0,
                position: "relative",
              }}
            >
              {activeTab === tab && (
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 2, background: "#cc0000", borderRadius: 99 }} />
              )}
              <span style={{ fontSize: 19 }}>{icon}</span>
              <span style={{ fontSize: 9, color: activeTab === tab ? "#cc0000" : "#444", fontWeight: activeTab === tab ? 700 : 400, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
