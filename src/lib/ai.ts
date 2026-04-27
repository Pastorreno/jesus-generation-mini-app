// AI helper — routes through Vercel AI Gateway with automatic provider fallback.
// On Vercel, auth is handled by OIDC (no API key needed in prod).
// Locally, set AI_GATEWAY_API_KEY in .env.local.
//
// Strategy: try Anthropic Claude first; on rate-limit / quota / error, fall
// back to Google Gemini Flash. That way the bot stays alive even when one
// provider is throttled or you've hit a credit ceiling.

import { generateText, type ModelMessage } from 'ai';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export interface ChatOptions {
  system?: string;
  maxTokens?: number;
  /** Primary model id (gateway "provider/model" string). Default: Claude Sonnet 4.6. */
  primary?: string;
  /** Fallback model id. Default: Gemini 2.5 Flash. */
  fallback?: string;
}

const DEFAULT_PRIMARY = 'anthropic/claude-sonnet-4-6';
const DEFAULT_FALLBACK = 'google/gemini-2.5-flash';

/**
 * Generate a chat completion via Vercel AI Gateway with automatic fallback.
 * Returns the assistant's text reply.
 */
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const {
    system,
    maxTokens = 1024,
    primary = DEFAULT_PRIMARY,
    fallback = DEFAULT_FALLBACK,
  } = options;

  const modelMessages: ModelMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const tryModel = async (modelId: string): Promise<string> => {
    const result = await generateText({
      model: modelId,
      system,
      messages: modelMessages,
      maxOutputTokens: maxTokens,
    });
    return result.text;
  };

  try {
    return await tryModel(primary);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `AI primary (${primary}) failed, falling back to ${fallback}:`,
      msg.slice(0, 200)
    );
    return await tryModel(fallback);
  }
}
