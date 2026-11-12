/**
 * Minimal runtime types for the Worker, so it needs no extra dependency.
 * (Cloudflare's full typings aren't installed; these cover exactly what the code touches.)
 */

/** Workers AI binding: `env.AI.run(model, input)`. */
export interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

/** Static-assets binding: `env.ASSETS.fetch(...)` serves files from ./dist. */
export interface AssetsBinding {
  fetch(input: Request | string | URL): Promise<Response>;
}

/** Workers Rate Limiting binding. */
export interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/**
 * Bindings declared in wrangler.jsonc. AI and CHAT_LIMITER are optional here only so the code can
 * fail safely (503) if one is ever missing, instead of throwing.
 */
export interface Env {
  ASSETS: AssetsBinding;
  AI?: AiBinding;
  CHAT_LIMITER?: RateLimitBinding;
}
