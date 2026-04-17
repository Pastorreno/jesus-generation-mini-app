// ─── SECTION 1: SCORING KEY ───────────────────────────────────────────────────
// Domain mapping for all 24 situational judgement questions
// Domains feed into the 3 C's → FAT framework at the display layer

export const KRS_KEY: Record<number, { A: number; B: number; C: number; D: number; domain: string }> = {
  // COMPREHENSION (Bible knowledge, spiritual understanding)
  1:  { A:3, B:4, C:1, D:2, domain:'bible_depth' },
  7:  { A:4, B:2, C:1, D:3, domain:'bible_depth' },
  12: { A:4, B:1, C:2, D:3, domain:'bible_depth' },
  // COMPREHENSION (Discipleship — applying what you know)
  8:  { A:4, B:1, C:3, D:2, domain:'discipleship' },
  13: { A:3, B:4, C:1, D:2, domain:'discipleship' },
  17: { A:4, B:3, C:2, D:1, domain:'discipleship' },

  // COMPETENCY (Outreach & Evangelism)
  3:  { A:3, B:4, C:2, D:1, domain:'outreach' },
  10: { A:3, B:1, C:4, D:2, domain:'outreach' },
  19: { A:4, B:1, C:3, D:2, domain:'outreach' },
  // COMPETENCY (Coaching & Developing Others)
  4:  { A:2, B:4, C:3, D:1, domain:'coaching' },
  22: { A:2, B:1, C:4, D:3, domain:'coaching' },
  24: { A:3, B:4, C:1, D:2, domain:'coaching' },

  // CHARACTER — FAITHFUL (Spiritual disciplines, follow-through)
  2:  { A:4, B:1, C:2, D:3, domain:'faithful' },
  11: { A:1, B:3, C:4, D:2, domain:'faithful' },
  16: { A:3, B:1, C:2, D:4, domain:'faithful' },
  // CHARACTER — AVAILABLE (Serving, stepping in, supporting leadership)
  6:  { A:3, B:2, C:4, D:1, domain:'available' },
  15: { A:4, B:3, C:1, D:2, domain:'available' },
  20: { A:3, B:1, C:4, D:2, domain:'available' },
  // CHARACTER — TEACHABLE (Receiving correction, growing, humility)
  18: { A:4, B:1, C:2, D:3, domain:'teachable' },
  // Q4 already mapped to coaching above; coaching is blended into teachable in scoreKRS()

  // 3 T's — TREASURE (Stewardship of finances & time)
  9:  { A:2, B:4, C:1, D:3, domain:'treasure' },
  14: { A:4, B:3, C:2, D:1, domain:'treasure' },
  23: { A:4, B:1, C:3, D:2, domain:'treasure' },

  // 3 T's — TIME (Fasting & spiritual consistency = time given to God)
  5:  { A:4, B:3, C:1, D:2, domain:'time_god' },
  21: { A:1, B:4, C:2, D:3, domain:'time_god' },
};

// ─── FRAMEWORK WEIGHTS ────────────────────────────────────────────────────────
// CHARACTER (FAT) = 40% | COMPETENCY = 30% | COMPREHENSION = 30%

export type S1Answers = Record<number, 'A' | 'B' | 'C' | 'D'>;
export type S2Answers = Record<number, { lion: number; otter: number; gr: number; beaver: number }>;
export type S3Answers = Record<number, 'A' | 'B'>;

const LL_KEY: Record<number, { A: string; B: string }> = {
  25: { A:'words', B:'touch'  },
  26: { A:'time',  B:'acts'   },
  27: { A:'gifts', B:'words'  },
  28: { A:'acts',  B:'touch'  },
  29: { A:'gifts', B:'time'   },
  30: { A:'acts',  B:'gifts'  },
  31: { A:'words', B:'time'   },
  32: { A:'touch', B:'gifts'  },
  33: { A:'time',  B:'words'  },
  34: { A:'words', B:'acts'   },
  35: { A:'time',  B:'touch'  },
  36: { A:'words', B:'acts'   },
  37: { A:'gifts', B:'touch'  },
  38: { A:'acts',  B:'time'   },
  39: { A:'gifts', B:'words'  },
  40: { A:'touch', B:'acts'   },
  41: { A:'time',  B:'gifts'  },
  42: { A:'words', B:'touch'  },
  43: { A:'acts',  B:'time'   },
  44: { A:'gifts', B:'acts'   },
};

const LL_LABELS: Record<string, string> = {
  words: 'Words of Affirmation',
  acts:  'Acts of Service',
  gifts: 'Receiving Gifts',
  time:  'Quality Time',
  touch: 'Physical Touch',
};

export interface DomainScores {
  // CHARACTER — FAT
  faithful:   number;
  available:  number;
  teachable:  number;
  // COMPETENCY
  outreach:   number;
  coaching:   number;
  // COMPREHENSION
  bible_depth:  number;
  discipleship: number;
  // 3 T's
  treasure:   number;
  time_god:   number;
}

export interface FrameworkScores {
  // 3 C's (0–100)
  character:     number;  // = FAT average → 40% of LPS
  competency:    number;  // outreach + coaching → 30% of LPS
  comprehension: number;  // bible + discipleship → 30% of LPS
  // FAT sub-scores (0–100)
  faithful:  number;
  available: number;
  teachable: number;
  // 3 T's
  treasure:  number;       // scored from questions
  time_god:  number;       // time given to spiritual disciplines
  // talent is Section 2 (animal instincts) — not a numeric score here
}

export interface KRSResult {
  domains: Partial<DomainScores>;
  framework: FrameworkScores;
  lps: number;
}

export interface AnimalResult {
  scores: { lion: number; otter: number; gr: number; beaver: number };
  primary: string;
  secondary: string;
}

export interface LLResult {
  scores: Record<string, number>;
  primary: string;
  secondary: string;
}

export interface PipelineLevel {
  level: number;
  name: string;
  omega: number;
  tagline: string;
}

// Normalize a raw domain score (min possible = n*1, max = n*4) to 0–100
function normalize(raw: number, questionCount: number): number {
  const min = questionCount;
  const max = questionCount * 4;
  return Math.max(0, Math.min(100, Math.round(((raw - min) / (max - min)) * 100)));
}

function avg(...scores: number[]): number {
  const valid = scores.filter(s => !isNaN(s));
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}

export function scoreKRS(answers: S1Answers): KRSResult {
  // Accumulate raw scores and question counts per domain
  const raw: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const [q, answer] of Object.entries(answers)) {
    const key = KRS_KEY[Number(q)];
    if (!key) continue;
    raw[key.domain] = (raw[key.domain] ?? 0) + key[answer];
    counts[key.domain] = (counts[key.domain] ?? 0) + 1;
  }

  // Normalize each domain to 0–100
  const d: Partial<DomainScores> = {};
  for (const domain of Object.keys(raw)) {
    (d as Record<string, number>)[domain] = normalize(raw[domain], counts[domain]);
  }

  // ── FAT sub-scores ──────────────────────────────────────────────────────────
  const faithful  = d.faithful  ?? 0;
  const available = d.available ?? 0;
  // Teachable: teachable domain + partial signal from coaching (how you develop others)
  const teachable = avg(d.teachable ?? 0, d.coaching ?? 0);

  // ── 3 C's ───────────────────────────────────────────────────────────────────
  const character     = avg(faithful, available, teachable);           // 40%
  const competency    = avg(d.outreach ?? 0, d.coaching ?? 0);        // 30%
  const comprehension = avg(d.bible_depth ?? 0, d.discipleship ?? 0); // 30%

  // ── KRS / LPS ───────────────────────────────────────────────────────────────
  const lps = Math.round(
    (character * 0.40) + (competency * 0.30) + (comprehension * 0.30)
  );

  const framework: FrameworkScores = {
    character, competency, comprehension,
    faithful, available, teachable,
    treasure: d.treasure ?? 0,
    time_god: d.time_god ?? 0,
  };

  return { domains: d, framework, lps };
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

export function scoreLoveLanguages(answers: S3Answers): LLResult {
  const totals: Record<string, number> = { words:0, acts:0, gifts:0, time:0, touch:0 };
  for (const [q, answer] of Object.entries(answers)) {
    const lang = LL_KEY[Number(q)]?.[answer];
    if (lang) totals[lang]++;
  }
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return {
    scores: totals,
    primary: LL_LABELS[sorted[0][0]],
    secondary: LL_LABELS[sorted[1][0]],
  };
}

export function assignLevel(lps: number): PipelineLevel {
  if (lps <= 19) return { level:1, name:'Seeker',     omega:1, tagline:'Your journey begins. Foundations of Faith.' };
  if (lps <= 39) return { level:2, name:'Builder',    omega:2, tagline:'Disciplines forged here become pillars later.' };
  if (lps <= 59) return { level:3, name:'Cultivator', omega:3, tagline:'You are becoming the culture of the house.' };
  if (lps <= 79) return { level:4, name:'Trainer',    omega:4, tagline:'You are ready to make disciples who make disciples.' };
  return                 { level:5, name:'Multiplier', omega:5, tagline:'You are the pipeline. Now build it.' };
}
