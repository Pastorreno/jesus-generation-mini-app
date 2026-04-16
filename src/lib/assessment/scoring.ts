// 242Go AHDP — Claude Scoring Engine
// Takes 30 answers → generates full profile via Claude API

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import {
  QUESTIONS,
  SCORING_MAP,
  LEVEL_THRESHOLDS,
  FAT_GATE_THRESHOLD,
  ANIMAL_NAMES,
  ANIMAL_DESCRIPTIONS,
  type Animal,
} from './questions';
import type { Answer } from './session';

function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface ScoredProfile {
  telegram_user_id: number;
  first_name: string;
  username: string | null;

  // Scores
  overall_score: number;
  character_score: number;
  competency_score: number;
  consistency_score: number;

  // Pillar scores (out of 20 each)
  pillar_word: number;
  pillar_fellowship: number;
  pillar_worship_prayer: number;
  pillar_fat: number;
  pillar_stewardship: number;

  // Level
  level: string;
  level_number: number;

  // Personality
  dominant_animal: Animal;
  secondary_animal: Animal;

  // Flags
  fat_gate_triggered: boolean;
  character_flagged: boolean;
  competency_flagged: boolean;
  consistency_flagged: boolean;
  bot_mode: 'coach' | 'companion' | 'care';

  // AI-generated
  strengths: string;
  growth_areas: string;
  calling_direction: string;
  ministry_placement: string;
  profile_card: string;
}

const ANSWER_POINTS: Record<string, number> = { A: 4, B: 3, C: 2, D: 1 };

// ─────────────────────────────────────────────
// CALCULATE raw scores from answers
// ─────────────────────────────────────────────
function calculateRawScores(answers: Answer[]) {
  const answerMap: Record<number, string> = {};
  answers.forEach(a => { answerMap[a.q] = a.answer; });

  // C/C/C scores
  const character = SCORING_MAP.character.reduce((sum, qId) => {
    return sum + (ANSWER_POINTS[answerMap[qId]] ?? 0);
  }, 0);

  const competency = SCORING_MAP.competency.reduce((sum, qId) => {
    return sum + (ANSWER_POINTS[answerMap[qId]] ?? 0);
  }, 0);

  const consistency = SCORING_MAP.consistency.reduce((sum, qId) => {
    return sum + (ANSWER_POINTS[answerMap[qId]] ?? 0);
  }, 0);

  const overall = character + competency + consistency;

  // FAT gate (subset of questions)
  const fat_score = SCORING_MAP.fat_gate.reduce((sum, qId) => {
    return sum + (ANSWER_POINTS[answerMap[qId]] ?? 0);
  }, 0);

  // Pillar scores
  const pillarQuestions = {
    word:           [1, 5, 6, 11, 18],
    fellowship:     [3, 10, 12, 19],
    worship_prayer: [8, 14, 17, 23, 25],
    fat:            [9, 16, 22, 28],
    stewardship:    [4, 15, 21, 24, 27, 29, 30],
  };

  const pillarScore = (ids: number[]) =>
    ids.reduce((sum, qId) => sum + (ANSWER_POINTS[answerMap[qId]] ?? 0), 0);

  // Personality tally
  const animalTally: Record<Animal, number> = {
    lion: 0, otter: 0, retriever: 0, beaver: 0
  };
  SCORING_MAP.personality.forEach(qId => {
    const q = QUESTIONS.find(q => q.id === qId);
    const answer = answerMap[qId];
    if (q?.animalMap && answer) {
      const animal = q.animalMap[answer as 'A' | 'B' | 'C' | 'D'];
      if (animal) animalTally[animal]++;
    }
  });

  const sortedAnimals = Object.entries(animalTally)
    .sort((a, b) => b[1] - a[1]) as [Animal, number][];

  return {
    character,
    competency,
    consistency,
    overall,
    fat_score,
    pillar_word:           pillarScore(pillarQuestions.word),
    pillar_fellowship:     pillarScore(pillarQuestions.fellowship),
    pillar_worship_prayer: pillarScore(pillarQuestions.worship_prayer),
    pillar_fat:            pillarScore(pillarQuestions.fat),
    pillar_stewardship:    pillarScore(pillarQuestions.stewardship),
    dominant_animal:  sortedAnimals[0][0],
    secondary_animal: sortedAnimals[1][0],
  };
}

// ─────────────────────────────────────────────
// DETERMINE level with FAT gate logic
// ─────────────────────────────────────────────
function determineLevel(
  overall: number,
  fat_score: number,
  fat_gate_triggered: boolean
): { level: string; level_number: number } {
  let level: string;
  let level_number: number;

  if (overall >= LEVEL_THRESHOLDS.multiplier) {
    level = 'multiplier'; level_number = 5;
  } else if (overall >= LEVEL_THRESHOLDS.leader) {
    level = 'leader'; level_number = 4;
  } else if (overall >= LEVEL_THRESHOLDS.servant) {
    level = 'servant'; level_number = 3;
  } else if (overall >= LEVEL_THRESHOLDS.disciple) {
    level = 'disciple'; level_number = 2;
  } else {
    level = 'seeker'; level_number = 1;
  }

  // FAT gate: cap at servant if gate triggered
  if (fat_gate_triggered && level_number > 3) {
    level = 'servant'; level_number = 3;
  }

  return { level, level_number };
}

// ─────────────────────────────────────────────
// DETERMINE bot mode
// ─────────────────────────────────────────────
function determineBotMode(level_number: number): 'coach' | 'companion' | 'care' {
  if (level_number >= 3) return 'coach';
  if (level_number === 2) return 'companion';
  return 'care';
}

// ─────────────────────────────────────────────
// CALL CLAUDE — generate AI narrative + profile card
// ─────────────────────────────────────────────
async function generateAIProfile(
  firstName: string,
  scores: ReturnType<typeof calculateRawScores>,
  level: string,
  level_number: number,
  fat_gate_triggered: boolean,
  flags: { character: boolean; competency: boolean; consistency: boolean }
): Promise<{
  strengths: string;
  growth_areas: string;
  calling_direction: string;
  ministry_placement: string;
  profile_card: string;
}> {
  const dominantAnimal = ANIMAL_NAMES[scores.dominant_animal];
  const secondaryAnimal = ANIMAL_NAMES[scores.secondary_animal];
  const dominantDesc = ANIMAL_DESCRIPTIONS[scores.dominant_animal];

  const flagText = [];
  if (flags.character) flagText.push('Character formation is a priority growth area');
  if (flags.competency) flagText.push('Competency development needed before ministry deployment');
  if (flags.consistency) flagText.push('Consistency patterns must be established before advancement');
  if (fat_gate_triggered) flagText.push('F.A.T. gate triggered — Faithfulness, Availability, or Teachability needs development');

  const prompt = `You are the 242Go AHDP Assessment Engine. You have just scored a leadership assessment for a member of a Christian ministry.

PERSON: ${firstName}
LEVEL: ${level.toUpperCase()} (Level ${level_number} of 5)
OVERALL SCORE: ${scores.overall}/100

C/C/C BREAKDOWN:
- Character:    ${scores.character}/32  (${Math.round((scores.character/32)*100)}%)
- Competency:   ${scores.competency}/28  (${Math.round((scores.competency/28)*100)}%)
- Consistency:  ${scores.consistency}/40  (${Math.round((scores.consistency/40)*100)}%)

PILLAR SCORES:
- The Word:          ${scores.pillar_word} pts
- Fellowship:        ${scores.pillar_fellowship} pts
- Worship & Prayer:  ${scores.pillar_worship_prayer} pts
- F.A.T. Filter:     ${scores.pillar_fat} pts
- Stewardship:       ${scores.pillar_stewardship} pts

PERSONALITY:
- Dominant:   ${dominantAnimal} — ${dominantDesc}
- Secondary:  ${secondaryAnimal}

FLAGS: ${flagText.length > 0 ? flagText.join('; ') : 'None'}

LEVEL DEFINITIONS:
1-Seeker: Just arrived. Exploring faith. Not yet committed.
2-Disciple: Committed. Building foundation. Needs development.
3-Servant: F.A.T. proven. Ready for supporting ministry roles.
4-Leader: C/C/C proven over time. Ready to lead and develop others.
5-Multiplier: Reproducing leaders. Kingdom-focused. Ready to send others.

Your task: Generate a profile for ${firstName} that is:
- Honest but never shaming
- Specific to their scores — not generic
- Written with pastoral warmth and kingdom urgency
- In the voice of a wise mentor who knows scripture deeply and believes in them
- No man left behind — if they scored low, the tone is "we will walk with you"
- Think like Blue Letter Bible: when you reference scripture, go beneath the surface
  * Use original Hebrew/Greek word meanings where they add power
  * Root verses in their historical and narrative context
  * Connect the word to what this person is actually experiencing
  * Never quote scripture as decoration — let it speak directly to their situation

Return ONLY valid JSON with these exact keys:
{
  "strengths": "2-3 specific strengths based on their highest scoring areas (2-3 sentences)",
  "growth_areas": "2-3 specific growth areas based on their lowest scores (2-3 sentences, compassionate tone)",
  "calling_direction": "Based on personality + scores, what ministry lane fits them (1-2 sentences)",
  "ministry_placement": "Specific recommended team/role OR 'Foundation stage — no placement yet' if Level 1-2 or flags triggered (1 sentence)",
  "profile_card": "Full formatted profile card text exactly as shown below — fill in the [BRACKETS]"
}

For the profile_card field, use this exact format (fill in all brackets):
━━━━━━━━━━━━━━━━━━━━━━━
   242Go LEADERSHIP PROFILE
━━━━━━━━━━━━━━━━━━━━━━━
Name:    ${firstName}
Level:   [LEVEL NAME] (Level [N] of 5)
Score:   [OVERALL]/100

CHARACTER    [X]/32  [PERCENTAGE]%
COMPETENCY   [X]/28  [PERCENTAGE]%
CONSISTENCY  [X]/40  [PERCENTAGE]%

Instinct:  [DOMINANT ANIMAL EMOJI + NAME]
           [SECONDARY ANIMAL EMOJI + NAME]

STRENGTHS
→ [strength 1]
→ [strength 2]
→ [strength 3 if applicable]

GROWTH AREAS
→ [growth area 1]
→ [growth area 2]

CALLING DIRECTION
[1-2 sentences]

MINISTRY PLACEMENT
[placement or foundation stage message]

PASSAGE 1 — The Welcome ✓
[Next passage name and what it requires — 1 sentence]
━━━━━━━━━━━━━━━━━━━━━━━
Your 242Go Coach is ready. 👇`;

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse JSON from Claude response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude did not return valid JSON');

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    strengths: parsed.strengths ?? '',
    growth_areas: parsed.growth_areas ?? '',
    calling_direction: parsed.calling_direction ?? '',
    ministry_placement: parsed.ministry_placement ?? '',
    profile_card: parsed.profile_card ?? '',
  };
}

// ─────────────────────────────────────────────
// MAIN — Score answers and save profile
// ─────────────────────────────────────────────
export async function scoreAndSaveProfile(
  telegram_user_id: number,
  first_name: string,
  username: string | null,
  answers: Answer[]
): Promise<ScoredProfile> {
  const raw = calculateRawScores(answers);

  const fat_gate_triggered = raw.fat_score <= FAT_GATE_THRESHOLD;
  const { level, level_number } = determineLevel(
    raw.overall,
    raw.fat_score,
    fat_gate_triggered
  );

  const flags = {
    character:   raw.character <= 16,
    competency:  raw.competency <= 14,
    consistency: raw.consistency <= 20,
  };

  const bot_mode = determineBotMode(level_number);

  // Generate AI narrative
  const ai = await generateAIProfile(
    first_name,
    raw,
    level,
    level_number,
    fat_gate_triggered,
    flags
  );

  const profile: Omit<ScoredProfile, 'profile_card'> & { profile_card: string } = {
    telegram_user_id,
    first_name,
    username,
    overall_score:         raw.overall,
    character_score:       raw.character,
    competency_score:      raw.competency,
    consistency_score:     raw.consistency,
    pillar_word:           raw.pillar_word,
    pillar_fellowship:     raw.pillar_fellowship,
    pillar_worship_prayer: raw.pillar_worship_prayer,
    pillar_fat:            raw.pillar_fat,
    pillar_stewardship:    raw.pillar_stewardship,
    level,
    level_number,
    dominant_animal:  raw.dominant_animal,
    secondary_animal: raw.secondary_animal,
    fat_gate_triggered,
    character_flagged:   flags.character,
    competency_flagged:  flags.competency,
    consistency_flagged: flags.consistency,
    bot_mode,
    ...ai,
  };

  // Save to Supabase
  const { error } = await getSupabaseClient()
    .from('profiles_242go')
    .upsert(profile, { onConflict: 'telegram_user_id' });

  if (error) console.error('saveProfile error:', error);

  return profile;
}

// ─────────────────────────────────────────────
// GET existing profile
// ─────────────────────────────────────────────
export async function getProfile(
  telegram_user_id: number
): Promise<ScoredProfile | null> {
  const { data } = await getSupabaseClient()
    .from('profiles_242go')
    .select('*')
    .eq('telegram_user_id', telegram_user_id)
    .single();
  return data ?? null;
}
