// AI helper — calls Google Gemini directly via the Vercel AI SDK.
// Uses GOOGLE_GENERATIVE_AI_API_KEY (free tier from https://aistudio.google.com/apikey).
// No Vercel AI Gateway dependency; no credit card required.
//
// Resilience: cascades through several Gemini model versions. The free tier
// regularly throws "model is currently experiencing high demand" overloads on
// any given model. If one is throttled, we try the next without failing.

import { generateText, type ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export interface ChatOptions {
  system?: string;
  maxTokens?: number;
  /** Override the model cascade. First entry is tried first; the rest are fallbacks. */
  models?: string[];
}

// Tried in order. All free-tier eligible. Any one being overloaded is common;
// having three independent capacity pools makes the bot effectively always-up.
const DEFAULT_MODEL_CASCADE = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
];

const OVERLOAD_PATTERNS = [
  'high demand',
  'overload',
  'unavailable',
  '503',
  '429',
  'rate limit',
  'quota',
];

function isTransient(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return OVERLOAD_PATTERNS.some((p) => msg.includes(p));
}

/**
 * Generate a chat completion using Google Gemini, falling through models on overload.
 * Returns the assistant's text reply.
 */
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const { system, maxTokens = 1024, models = DEFAULT_MODEL_CASCADE } = options;

  const modelMessages: ModelMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let lastErr: unknown;
  for (const modelId of models) {
    try {
      const result = await generateText({
        model: google(modelId),
        system,
        messages: modelMessages,
        maxOutputTokens: maxTokens,
      });
      return result.text;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`AI model ${modelId} failed: ${msg.slice(0, 200)}`);
      // Only cascade on transient errors. Hard failures (auth, malformed
      // request) won't be helped by retrying a different model.
      if (!isTransient(err)) break;
    }
  }

  throw lastErr instanceof Error
    ? lastErr
    : new Error('All Gemini models failed');
}
