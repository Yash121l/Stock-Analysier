import { Context } from 'hono';
import { Env } from '../types';

const POSTHOG_CAPTURE_URL = 'https://us.i.posthog.com/i/v0/e/';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Fire-and-forget PostHog event. Runs inside ctx.waitUntil so it never delays
 * the response, and swallows every error. Pass `distinctId: null` for
 * anonymous events (no person profile is created).
 *
 * Local `wrangler dev` requests are skipped unless POSTHOG_CAPTURE_LOCAL=1.
 */
export function captureEvent(
  c: Context<{ Bindings: Env; Variables: any }> | Context<{ Bindings: Env }>,
  event: string,
  distinctId: string | number | null,
  properties: Record<string, unknown> = {}
): void {
  const apiKey = c.env.POSTHOG_KEY;
  if (!apiKey) return;

  const debug = c.env.POSTHOG_CAPTURE_LOCAL === '1';
  if (LOCAL_HOSTS.has(new URL(c.req.url).hostname) && !debug) return;

  const anonymous = distinctId === null;
  const body = JSON.stringify({
    api_key: apiKey,
    event,
    distinct_id: anonymous ? crypto.randomUUID() : String(distinctId),
    timestamp: new Date().toISOString(),
    properties: {
      app: 'stock-analysier',
      source: 'worker',
      ...(anonymous ? { $process_person_profile: false } : {}),
      ...properties,
    },
  });

  const send = fetch(POSTHOG_CAPTURE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then((res) => {
      if (debug || !res.ok) console.log(`[posthog] ${event} -> ${res.status}`);
    })
    .catch((err) => console.warn(`[posthog] ${event} failed:`, err));

  try {
    c.executionCtx.waitUntil(send);
  } catch {
    // No execution context (e.g. unit tests): the promise still runs.
  }
}
