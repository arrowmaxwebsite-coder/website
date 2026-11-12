/**
 * ArrowMax Worker entry point.
 *
 * The website itself is static (built by Astro into ./dist) and is served straight from Cloudflare's asset
 * layer without running any of this code. wrangler.jsonc sets `assets.run_worker_first: ["/api/*"]`, so only
 * API requests start here. Everything else only reaches this Worker if no static file matched, and is handed
 * back to the asset layer so the branded 404 page still works.
 */
import type { Env } from './types.ts';
import { handleChat } from './chat.ts';

const NOT_FOUND = JSON.stringify({ error: 'not_found', message: 'Not found.' });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

    if (path === '/api/chat') return handleChat(request, env);

    if (path === '/api' || path.startsWith('/api/')) {
      return new Response(NOT_FOUND, {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }

    // Not an API call: let the static site (and its 404 page) answer.
    return env.ASSETS.fetch(request);
  },
};
