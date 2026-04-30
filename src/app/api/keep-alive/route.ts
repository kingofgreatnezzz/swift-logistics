import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * GET /api/keep-alive  ✅💓
 *
 * Pings the Supabase database to prevent it from being paused due to inactivity.
 * Uses raw fetch against the Supabase REST API so there are zero client-library
 * dependency issues inside the API route.
 *
 * Logs to terminal/server console with the ✅💓 icon for easy scanning.
 */
export async function GET() {
  const start = Date.now();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌💀 [keep-alive] Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars');
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing Supabase environment variables',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }

  try {
    // Lightweight HEAD-style query: 1 row, 1 column via the Supabase REST API
    const url = `${SUPABASE_URL}/rest/v1/packages?select=id&limit=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
      },
      // Allow the request a reasonable amount of time
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '(no body)');
      console.error(
        `❌💀 [keep-alive] Supabase returned ${response.status}: ${body}`,
      );
      return NextResponse.json(
        {
          ok: false,
          error: `Supabase returned ${response.status}`,
          durationMs: Date.now() - start,
          timestamp: new Date().toISOString(),
        },
        { status: 502 },
      );
    }

    console.log(`✅💓 [keep-alive] Ping succeeded in ${Date.now() - start}ms`);

    return NextResponse.json({
      ok: true,
      durationMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // Check for TLS certificate clock-skew issues
    const cause =
      err instanceof Error && (err.cause instanceof Error ? err.cause : null);
    const causeMsg = cause ? cause.message : '';
    const isClockSkew = causeMsg.includes('certificate is not yet valid');

    console.error(
      `❌💀 [keep-alive] Request failed: ${message}${
        isClockSkew ? ' ⏰ SYSTEM CLOCK SKEW – check your computer date/time' : ''
      }`,
    );

    return NextResponse.json(
      {
        ok: false,
        error: message,
        detail: isClockSkew
          ? 'System clock appears to be behind – SSL certificate not yet valid from this machine'
          : causeMsg || undefined,
        durationMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
