// 242Go AHDP — Assessment Session State Machine
// Manages the 30-question journey per Telegram user in Supabase

import { createClient } from '@supabase/supabase-js';
import { TOTAL_QUESTIONS } from './questions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type SessionState =
  | 'idle'
  | 'awaiting_start'
  | 'in_assessment'
  | 'processing'
  | 'complete';

export interface Answer {
  q: number;
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface AssessmentSession {
  id: string;
  telegram_user_id: number;
  first_name: string | null;
  username: string | null;
  state: SessionState;
  current_question: number;
  answers: Answer[];
  started_at: string;
  completed_at: string | null;
}

// ─────────────────────────────────────────────
// GET or CREATE session for a user
// ─────────────────────────────────────────────
export async function getSession(
  telegram_user_id: number
): Promise<AssessmentSession | null> {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('telegram_user_id', telegram_user_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('getSession error:', error);
  }
  return data ?? null;
}

// ─────────────────────────────────────────────
// START a new assessment session
// ─────────────────────────────────────────────
export async function startSession(
  telegram_user_id: number,
  first_name: string | null,
  username: string | null
): Promise<AssessmentSession> {
  // Delete any existing incomplete session
  await supabase
    .from('assessment_sessions')
    .delete()
    .eq('telegram_user_id', telegram_user_id)
    .neq('state', 'complete');

  const { data, error } = await supabase
    .from('assessment_sessions')
    .insert({
      telegram_user_id,
      first_name,
      username,
      state: 'awaiting_start',
      current_question: 0,
      answers: [],
    })
    .select()
    .single();

  if (error) throw new Error(`startSession failed: ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────
// CONFIRM start — user said YES, begin Q1
// ─────────────────────────────────────────────
export async function confirmStart(
  telegram_user_id: number
): Promise<AssessmentSession> {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .update({ state: 'in_assessment', current_question: 1 })
    .eq('telegram_user_id', telegram_user_id)
    .select()
    .single();

  if (error) throw new Error(`confirmStart failed: ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────
// RECORD an answer and advance to next question
// ─────────────────────────────────────────────
export async function recordAnswer(
  telegram_user_id: number,
  question_number: number,
  answer: 'A' | 'B' | 'C' | 'D'
): Promise<{ session: AssessmentSession; isComplete: boolean }> {
  const session = await getSession(telegram_user_id);
  if (!session) throw new Error('No active session found');

  const newAnswers: Answer[] = [
    ...session.answers,
    { q: question_number, answer },
  ];

  const isComplete = question_number >= TOTAL_QUESTIONS;
  const nextQuestion = isComplete ? question_number : question_number + 1;
  const newState: SessionState = isComplete ? 'processing' : 'in_assessment';

  const { data, error } = await supabase
    .from('assessment_sessions')
    .update({
      answers: newAnswers,
      current_question: nextQuestion,
      state: newState,
      ...(isComplete ? { completed_at: new Date().toISOString() } : {}),
    })
    .eq('telegram_user_id', telegram_user_id)
    .select()
    .single();

  if (error) throw new Error(`recordAnswer failed: ${error.message}`);
  return { session: data, isComplete };
}

// ─────────────────────────────────────────────
// MARK session as complete (after profile saved)
// ─────────────────────────────────────────────
export async function markComplete(
  telegram_user_id: number
): Promise<void> {
  await supabase
    .from('assessment_sessions')
    .update({ state: 'complete' })
    .eq('telegram_user_id', telegram_user_id);
}

// ─────────────────────────────────────────────
// RESET — allow retake (used by admin)
// ─────────────────────────────────────────────
export async function resetSession(
  telegram_user_id: number
): Promise<void> {
  await supabase
    .from('assessment_sessions')
    .delete()
    .eq('telegram_user_id', telegram_user_id);
}

// ─────────────────────────────────────────────
// VALIDATE answer input from Telegram message
// ─────────────────────────────────────────────
export function parseAnswer(text: string): 'A' | 'B' | 'C' | 'D' | null {
  const normalized = text.trim().toUpperCase();
  if (['A', 'B', 'C', 'D'].includes(normalized)) {
    return normalized as 'A' | 'B' | 'C' | 'D';
  }
  // Also accept emoji answers like "A)" or just the first letter
  const first = normalized.charAt(0);
  if (['A', 'B', 'C', 'D'].includes(first)) {
    return first as 'A' | 'B' | 'C' | 'D';
  }
  return null;
}
