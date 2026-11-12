/**
 * POST /api/chat: the ArrowMax website assistant, answered by Cloudflare Workers AI.
 *
 * Request:  { "messages": [{ "role": "user" | "assistant", "content": "..." }, ...] }
 * Response: { "reply": "..." }   or   { "error": "<code>", "message": "<friendly text>" }
 *
 * Safety properties (each is covered by worker/chat.test.ts):
 *  - POST only; same-origin browsers only; JSON only.
 *  - Per-IP rate limit runs before anything expensive. If the limiter is missing it fails CLOSED.
 *  - Bounded request body, message count and message length. Clients may only send "user"/"assistant"
 *    roles, so a visitor can never inject their own system prompt.
 *  - Bounded model output (max tokens + reply length).
 *  - Quota / capacity / timeout failures become short friendly messages, never raw errors.
 *  - Conversation content is never logged. The only log line carries a failure category.
 */
import type { Env } from './types.ts';
import { getSystemPrompt } from './prompt.ts';

export const MODEL = '@cf/google/gemma-4-26b-a4b-it';

export const LIMITS = {
  /** raw JSON request body */
  bodyBytes: 12_000,
  /** messages a client may send */
  messages: 20,
  /** most recent messages actually given to the model */
  keep: 10,
  /** characters per message, by role */
  userChars: 600,
  assistantChars: 1_500,
  /** model output */
  maxTokens: 400,
  replyChars: 1_200,
  /** give up on the model after this long */
  aiTimeoutMs: 25_000,
} as const;

export type Role = 'user' | 'assistant';
export interface ChatMessage {
  role: Role;
  content: string;
}

const MESSAGES = {
  unavailable: 'The assistant is unavailable right now.',
  busy: 'The assistant is busy right now. Please try again in a moment.',
  quota: 'The assistant has reached its limit for today.',
  failed: 'Sorry, something went wrong on our end.',
  rate: 'You’re sending messages quickly. Please wait a moment and try again.',
} as const;

function json(status: number, body: unknown, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });
}

function fail(status: number, error: string, message: string, extra?: Record<string, string>): Response {
  return json(status, { error, message }, extra);
}

/** Browsers always send Origin on a cross-site POST, so a mismatch means another website is calling us. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // non-browser client (curl, tests): can't be a cross-site browser abuse
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/** Read the body, but stop (and report null) as soon as it grows past `max` bytes. */
async function readBounded(request: Request, max: number): Promise<string | null> {
  const declared = Number(request.headers.get('Content-Length') ?? '0');
  if (declared > max) return null;
  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export type Validated = { ok: true; messages: ChatMessage[] } | { ok: false; message: string };

/**
 * Validate the client's messages and shape them for the model: only user/assistant roles, bounded sizes,
 * starting with a user message, alternating roles (Gemma's chat template requires it), ending on a user message.
 */
export function validateMessages(input: unknown): Validated {
  const raw = (input as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return { ok: false, message: 'Send a non-empty "messages" array.' };
  if (raw.length > LIMITS.messages) return { ok: false, message: 'Conversation is too long.' };

  const cleaned: ChatMessage[] = [];
  for (const item of raw) {
    const m = item as { role?: unknown; content?: unknown } | null;
    if (!m || typeof m !== 'object') return { ok: false, message: 'Each message must be an object.' };
    if (m.role !== 'user' && m.role !== 'assistant') return { ok: false, message: 'Message role must be "user" or "assistant".' };
    if (typeof m.content !== 'string') return { ok: false, message: 'Message content must be text.' };
    const content = m.content.replace(CONTROL_CHARS, '').trim();
    if (!content) return { ok: false, message: 'Messages can’t be empty.' };
    const max = m.role === 'user' ? LIMITS.userChars : LIMITS.assistantChars;
    if (content.length > max) return { ok: false, message: `Messages can be at most ${max} characters.` };
    cleaned.push({ role: m.role, content });
  }

  // Only the most recent turns go to the model; it must start with a user turn.
  const recent = cleaned.slice(-LIMITS.keep);
  while (recent.length && recent[0].role !== 'user') recent.shift();

  // Merge consecutive messages from the same role so roles strictly alternate.
  const merged: ChatMessage[] = [];
  for (const m of recent) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += `\n${m.content}`;
    else merged.push({ ...m });
  }

  if (!merged.length || merged[merged.length - 1].role !== 'user') {
    return { ok: false, message: 'The last message must be from the user.' };
  }
  return { ok: true, messages: merged };
}

/** Pull the reply text out of whichever shape the model returns. */
export function extractText(out: unknown): string {
  if (typeof out === 'string') return out;
  const o = out as {
    response?: unknown;
    result?: { response?: unknown };
    choices?: { message?: { content?: unknown }; text?: unknown }[];
  } | null;
  const choice = o?.choices?.[0];
  const content = choice?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part: unknown) => (typeof part === 'string' ? part : ((part as { text?: unknown })?.text as string) ?? ''))
      .join('');
  }
  if (typeof choice?.text === 'string') return choice.text;
  if (typeof o?.response === 'string') return o.response;
  if (typeof o?.result?.response === 'string') return o.result.response;
  return '';
}

/** Remove any leaked reasoning blocks, tidy whitespace, and cap the length (cutting at a sentence if possible). */
export function cleanReply(text: string): string {
  let t = text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<\/?think>/gi, '')
    .replace(CONTROL_CHARS, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (t.length > LIMITS.replyChars) {
    const cut = t.slice(0, LIMITS.replyChars);
    const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
    t = end > LIMITS.replyChars * 0.5 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`;
  }
  return t;
}

type FailureKind = 'quota' | 'busy' | 'error';

/** Map a Workers AI failure to a category. Never inspect or log anything the visitor wrote. */
function classify(err: unknown): FailureKind {
  const text = String((err as { message?: unknown } | null)?.message ?? err);
  if (/\b4006\b|neurons?|daily free allocation|allocation/i.test(text)) return 'quota';
  if (/timeout|timed out|\b3040\b|\b429\b|capacity|overload|temporar|too many/i.test(text)) return 'busy';
  return 'error';
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return fail(405, 'method_not_allowed', 'Use POST.', { Allow: 'POST' });
  }
  if (!isSameOrigin(request)) {
    return fail(403, 'forbidden', 'Requests must come from the ArrowMax website.');
  }
  if (!(request.headers.get('Content-Type') ?? '').toLowerCase().startsWith('application/json')) {
    return fail(415, 'unsupported_media_type', 'Send JSON.');
  }

  // Both bindings are required. A missing one is a deploy problem: refuse rather than run unprotected.
  if (!env.AI || !env.CHAT_LIMITER) {
    console.error('chat: binding missing');
    return fail(503, 'unavailable', MESSAGES.unavailable);
  }

  // Rate limit first, before reading or paying for anything.
  const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  try {
    const { success } = await env.CHAT_LIMITER.limit({ key });
    if (!success) return fail(429, 'rate_limited', MESSAGES.rate, { 'Retry-After': '30' });
  } catch {
    console.error('chat: limiter error');
    return fail(503, 'unavailable', MESSAGES.unavailable);
  }

  const body = await readBounded(request, LIMITS.bodyBytes);
  if (body === null) return fail(413, 'too_large', 'That message is too large.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return fail(400, 'bad_request', 'Request body must be valid JSON.');
  }

  const checked = validateMessages(parsed);
  if (!checked.ok) return fail(400, 'bad_request', checked.message);

  try {
    const system = await getSystemPrompt(env, request.url);
    const result = await withTimeout(
      env.AI.run(MODEL, {
        messages: [{ role: 'system', content: system }, ...checked.messages],
        max_completion_tokens: LIMITS.maxTokens,
        temperature: 0.3,
        // Gemma 4 "thinks" before answering by default. Measured on the real service: ~300 hidden reasoning tokens,
        // ~6s and ~8 neurons per reply, and with a long system prompt the reasoning can eat the whole token budget
        // and leave an empty answer. Turning it off: ~1s, ~1.5 neurons, and the answer always fits.
        chat_template_kwargs: { enable_thinking: false },
      }),
      LIMITS.aiTimeoutMs
    );

    const reply = cleanReply(extractText(result));
    if (!reply) {
      console.error('chat: empty reply');
      return fail(502, 'ai_error', MESSAGES.failed);
    }
    return json(200, { reply });
  } catch (err) {
    const kind = classify(err);
    console.error(`chat: ai ${kind}`); // category only, never the conversation or the raw error text
    if (kind === 'quota') return fail(503, 'quota', MESSAGES.quota);
    if (kind === 'busy') return fail(503, 'busy', MESSAGES.busy);
    return fail(502, 'ai_error', MESSAGES.failed);
  }
}
