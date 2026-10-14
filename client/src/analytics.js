import posthog from 'posthog-js';

// The key is only set in .env.production, so `npm start` never sends events.
const key = process.env.REACT_APP_POSTHOG_KEY;
const enabled = Boolean(key) && typeof window !== 'undefined';
const SUPER_PROPERTIES = { app: 'stock-analysier' };

export function initAnalytics() {
    if (!enabled) return;

    posthog.init(key, {
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        defaults: '2026-08-30',
        capture_pageview: 'history_change',
        capture_pageleave: true,
        autocapture: true,
        enable_heatmaps: true,
        capture_dead_clicks: true,
        capture_exceptions: true,
        capture_performance: { web_vitals: true },
        session_recording: { maskAllInputs: true },
    });
    posthog.register(SUPER_PROPERTIES);
}

export function track(event, properties) {
    if (enabled) posthog.capture(event, properties);
}

// The API returns a JWT whose payload carries the D1 user id.
function userIdFromToken(token) {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const { userId } = JSON.parse(atob(payload));
        return userId == null ? null : String(userId);
    } catch {
        return null;
    }
}

export function identifyUser(token, email) {
    if (!enabled) return;
    const userId = userIdFromToken(token);
    if (userId) posthog.identify(userId, { email });
}

export function resetUser() {
    if (!enabled) return;
    posthog.reset();
    // reset() clears super properties, so put the app tag back.
    posthog.register(SUPER_PROPERTIES);
}
