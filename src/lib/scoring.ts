// ETS Academy — Scoring Engine v2.0
// Built on Acts 2:42-47 | Great Commission | Great Commandment | Acts 1:8

import type { S1LikertItem, S5Question, S6LikertItem } from './questions';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type S1Answers = Record<number, 1 | 2 | 3 | 4 | 5>; // Likert 1-5
export type S2Answers = Record<number, { lion: number; otter: number; gr: number; beaver: number }>;
export type S3Answers = Record<number, 'A' | 'B'>;
export type S4Answers = Record<number, 'A' | 'B'>;
export type S5Answers = Record<number, 'A' | 'B'>;
export type S6Answers = Record<number, 1 | 2 | 3 | 4 | 5>; // Likert 1-5

// ─── S1: SPIRITUAL MATURITY INDEX ────────────────────────────────────────────

export interface S1Result {
  constructs: Record<string, number>; // 0-100 per construct
  character: number;    // FAT average (faithful + available + teachable)
  competency: number;   // outreach + discipleship
  comprehension: number;// bible_depth + time_god
  alignment: number;    // cultural alignment + conflict
  stewardship: number;  // time_steward + talent + treasure
  lps: number;          // 0-100 overall Leadership Pipeline Score
}

export function scoreS1(answers: S1Answers, items: S1LikertItem[]): S1Result {
  const raw: Record<string, number[]> = {};

  for (const item of items) {
    const val = answers[item.number];
    if (!val) continue;
    const score = item.reverse ? (6 - val) : val; // invert reverse items
    if (!raw[item.construct]) raw[item.construct] = [];
    raw[item.construct].push(score);
  }

  // Normalize each construct to 0-100
  const constructs: Record<string, number> = {};
  for (const [key, scores] of Object.entries(raw)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    constructs[key] = Math.round(((avg - 1) / 4) * 100); // 1-5 → 0-100
  }

  const get = (k: string) => constructs[k] ?? 0;

  const character     = avg(get('faithful'), get('available'), get('teachable'));
  const competency    = avg(get('outreach'), get('discipleship'));
  const comprehension = avg(get('bible_depth'), get('time_god'));
  const alignment     = get('alignment');
  const stewardship   = avg(get('time_steward'), get('talent'), get('treasure'));

  // Weighted LPS: Character 35% | Competency 20% | Comprehension 20% | Alignment 15% | Stewardship 10%
  const lps = Math.round(
    character * 0.35 +
    competency * 0.20 +
    comprehension * 0.20 +
    alignment * 0.15 +
    stewardship * 0.10
  );

  return { constructs, character, competency, comprehension, alignment, stewardship, lps };
}

// ─── S2: ANIMAL PERSONALITY ───────────────────────────────────────────────────

export interface AnimalResult {
  scores: { lion: number; otter: number; gr: number; beaver: number };
  primary: string;
  secondary: string;
}

export function scoreAnimals(answers: S2Answers): AnimalResult {
  const scores = { lion: 0, otter: 0, gr: 0, beaver: 0 };
  for (const row of Object.values(answers)) {
    scores.lion   += row.lion;
    scores.otter  += row.otter;
    scores.gr     += row.gr;
    scores.beaver += row.beaver;
  }
  const labelMap: Record<string, string> = {
    lion: 'Lion', otter: 'Otter', gr: 'Golden Retriever', beaver: 'Beaver',
  };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return { scores, primary: labelMap[sorted[0][0]], secondary: labelMap[sorted[1][0]] };
}

// ─── S3: LOVE LANGUAGES ───────────────────────────────────────────────────────

const LL_KEY: Record<number, { A: string; B: string }> = {
  25: { A:'words', B:'touch'  },
  26: { A:'time',  B:'acts'   },
  27: { A:'gifts', B:'time'   },
  28: { A:'words', B:'acts'   },
  29: { A:'touch', B:'gifts'  },
  30: { A:'time',  B:'words'  },
  31: { A:'acts',  B:'touch'  },
  32: { A:'gifts', B:'time'   },
  33: { A:'words', B:'acts'   },
  34: { A:'touch', B:'time'   },
};

const LL_LABELS: Record<string, string> = {
  words: 'Words of Affirmation', acts: 'Acts of Service',
  gifts: 'Receiving Gifts',      time: 'Quality Time', touch: 'Physical Touch',
};

export interface LLResult {
  scores: Record<string, number>;
  primary: string;
  secondary: string;
}

export function scoreLoveLanguages(answers: S3Answers): LLResult {
  const totals: Record<string, number> = { words:0, acts:0, gifts:0, time:0, touch:0 };
  for (const [q, answer] of Object.entries(answers)) {
    const lang = LL_KEY[Number(q)]?.[answer];
    if (lang) totals[lang]++;
  }
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return { scores: totals, primary: LL_LABELS[sorted[0][0]], secondary: LL_LABELS[sorted[1][0]] };
}

// ─── S4: SPIRITUAL GIFTS ──────────────────────────────────────────────────────

const GIFT_LABELS: Record<string, string> = {
  wisdom: 'Word of Wisdom',       knowledge: 'Word of Knowledge',
  faith: 'Gift of Faith',         healing: 'Gifts of Healing',
  miracles: 'Working of Miracles',prophecy: 'Prophecy',
  discernment: 'Discerning of Spirits', tongues: 'Tongues',
  interpretation: 'Interpretation of Tongues',
};

export interface GiftsResult {
  scores: Record<string, number>;
  primary: string;
  secondary: string;
  tertiary: string;
}

export function scoreGifts(answers: S4Answers, questions: import('./questions').S4Question[]): GiftsResult {
  const scores: Record<string, number> = {
    wisdom:0, knowledge:0, faith:0, healing:0, miracles:0,
    prophecy:0, discernment:0, tongues:0, interpretation:0,
  };
  for (const q of questions) {
    const ans = answers[q.number];
    if (!ans) continue;
    const gift = ans === 'A' ? q.giftA : q.giftB;
    scores[gift] = (scores[gift] ?? 0) + 1;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    scores,
    primary:   GIFT_LABELS[sorted[0][0]],
    secondary: GIFT_LABELS[sorted[1][0]],
    tertiary:  GIFT_LABELS[sorted[2][0]],
  };
}

// ─── S5: LEADERSHIP STYLE ─────────────────────────────────────────────────────

const STYLE_LABELS: Record<string, string> = {
  director: 'Director', coach: 'Coach', supporter: 'Supporter', delegator: 'Delegator',
};

export interface LeadershipResult {
  scores: Record<string, number>;
  primary: string;
  secondary: string;
}

export function scoreLeadership(answers: S5Answers, questions: S5Question[]): LeadershipResult {
  const scores: Record<string, number> = { director:0, coach:0, supporter:0, delegator:0 };
  for (const q of questions) {
    const ans = answers[q.number];
    if (!ans) continue;
    const style = ans === 'A' ? q.styleA : q.styleB;
    scores[style] = (scores[style] ?? 0) + 1;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return { scores, primary: STYLE_LABELS[sorted[0][0]], secondary: STYLE_LABELS[sorted[1][0]] };
}

// ─── S6: EMOTIONAL INTELLIGENCE ───────────────────────────────────────────────

export interface EQResult {
  constructs: Record<string, number>; // 0-100 per construct
  overall: number;                    // 0-100
}

export function scoreEQ(answers: S6Answers, items: S6LikertItem[]): EQResult {
  const raw: Record<string, number[]> = {};
  for (const item of items) {
    const val = answers[item.number];
    if (!val) continue;
    const score = item.reverse ? (6 - val) : val;
    if (!raw[item.construct]) raw[item.construct] = [];
    raw[item.construct].push(score);
  }
  const constructs: Record<string, number> = {};
  for (const [key, scores] of Object.entries(raw)) {
    const a = scores.reduce((x, y) => x + y, 0) / scores.length;
    constructs[key] = Math.round(((a - 1) / 4) * 100);
  }
  const vals = Object.values(constructs);
  const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  return { constructs, overall };
}

// ─── PIPELINE LEVEL ───────────────────────────────────────────────────────────

export interface PipelineLevel {
  level: number;
  name: string;
  omega: number;
  tagline: string;
}

export function assignLevel(lps: number): PipelineLevel {
  if (lps <= 19) return { level:1, name:'Seeker',     omega:1, tagline:'Your journey begins. Foundations of Faith.' };
  if (lps <= 39) return { level:2, name:'Builder',    omega:2, tagline:'Disciplines forged here become pillars later.' };
  if (lps <= 59) return { level:3, name:'Cultivator', omega:3, tagline:'You are becoming the culture of the house.' };
  if (lps <= 79) return { level:4, name:'Trainer',    omega:4, tagline:'You are ready to make disciples who make disciples.' };
  return                 { level:5, name:'Multiplier', omega:5, tagline:'You are the pipeline. Now build it.' };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function avg(...scores: number[]): number {
  const valid = scores.filter(s => !isNaN(s) && s !== undefined);
  if (!valid.length) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}
