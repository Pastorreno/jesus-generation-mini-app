// AI helper — calls Google Gemini directly via the Vercel AI SDK.
// Uses GOOGLE_GENERATIVE_AI_API_KEY (free tier from https://aistudio.google.com/apikey).
// No Vercel AI Gateway dependency; no credit card required.
//
// To re-add Anthropic later as a fallback, install @ai-sdk/anthropic and wrap
// tryModel calls in a try/catch that falls back to the secondary provider.

import { generateText, type ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export interface ChatOptions {
  system?: string;
  maxTokens?: number;
  /** Gemini model id. Default: gemini-2.5-flash (fast & cheap, generous free tier). */
  model?: string;
}

const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Generate a chat completion using Google Gemini.
 * Returns the assistant's text reply.
 */
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const { system, maxTokens = 1024, model = DEFAULT_MODEL } = options;

  const modelMessages: ModelMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const result = await generateText({
    model: google(model),
    system,
    messages: modelMessages,
    maxOutputTokens: maxTokens,
  });

  return result.text;
}
