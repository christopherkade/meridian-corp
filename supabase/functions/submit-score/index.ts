// Supabase Edge Function: submit-score
// Validates, rate-limits, and inserts leaderboard entries server-side.
//
// Deploy with: supabase functions deploy submit-score
// Required env vars (set in Supabase dashboard → Edge Functions → Secrets):
//   SUPABASE_URL           (auto-set by Supabase)
//   SUPABASE_SERVICE_ROLE_KEY  (auto-set by Supabase)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Config ─────────────────────────────────────────────────

const VALID_DIFFICULTIES = ["easy", "medium", "hard"] as const;
const MAX_NAME_LENGTH = 20;
const MIN_PLAUSIBLE_MS = 5_000;
const MAX_PLAUSIBLE_MS = 3_600_000; // 1 hour
const MAX_SCORE = 100_000;
const MAX_CASES = 200;
const RATE_LIMIT_WINDOW_SECONDS = 3600; // 1 hour
const RATE_LIMIT_MAX_SUBMITS = 10;

// Reserved / blocked names (lowercased, whitespace-stripped)
const RESERVED_NAMES = ["admin", "administrator", "moderator", "mod", "system"];

// ── CORS helpers ───────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info",
};

function corsResponse(body: string, status: number) {
  return new Response(body, {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ── Validation ─────────────────────────────────────────────

function validatePayload(body: Record<string, unknown>): string | null {
  const { playerName, difficulty, runElapsedMs, casesCompleted, totalScore } =
    body;

  if (typeof playerName !== "string") return "playerName must be a string.";
  const trimmed = playerName.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH)
    return `Name must be 1-${MAX_NAME_LENGTH} characters.`;

  // Block reserved names
  const lower = trimmed.toLowerCase().replace(/\s+/g, "");
  if (RESERVED_NAMES.includes(lower)) return "That name is reserved.";

  // Block invisible / zero-width characters
  if (/[\u200B-\u200F\u2028-\u202F\u2060\uFEFF]/.test(trimmed))
    return "Name contains invalid characters.";

  // Allow only basic printable characters (letters, digits, spaces, common punctuation)
  if (!/^[\p{L}\p{N}\p{Zs}\-_'.!]+$/u.test(trimmed))
    return "Name contains disallowed characters.";

  if (
    typeof difficulty !== "string" ||
    !VALID_DIFFICULTIES.includes(
      difficulty as (typeof VALID_DIFFICULTIES)[number],
    )
  )
    return "Invalid difficulty.";

  if (typeof runElapsedMs !== "number" || !Number.isFinite(runElapsedMs))
    return "Invalid run time.";
  if (runElapsedMs < MIN_PLAUSIBLE_MS || runElapsedMs > MAX_PLAUSIBLE_MS)
    return "Run time out of plausible range.";

  if (
    typeof casesCompleted !== "number" ||
    !Number.isInteger(casesCompleted) ||
    casesCompleted < 0 ||
    casesCompleted > MAX_CASES
  )
    return "Invalid cases completed.";

  if (
    typeof totalScore !== "number" ||
    !Number.isInteger(totalScore) ||
    totalScore > MAX_SCORE
  )
    return "Invalid score.";

  return null;
}

// ── Rate limiting (uses a dedicated table) ─────────────────

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  ip: string,
): Promise<boolean> {
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000,
  ).toISOString();

  // Count recent submissions from this IP
  const { count, error } = await supabase
    .from("leaderboard")
    .select("id", { count: "exact", head: true })
    .eq("submitter_ip", ip)
    .gte("created_at", windowStart);

  if (error) {
    // If the column doesn't exist yet, skip rate limiting gracefully
    console.error("[submit-score] Rate limit check error:", error.message);
    return true; // allow
  }

  return (count ?? 0) < RATE_LIMIT_MAX_SUBMITS;
}

// ── Handler ────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return corsResponse(JSON.stringify({ error: "Method not allowed" }), 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return corsResponse(JSON.stringify({ error: "Invalid JSON body" }), 400);
  }

  // Validate input
  const validationError = validatePayload(body);
  if (validationError) {
    return corsResponse(JSON.stringify({ error: validationError }), 400);
  }

  const { playerName, difficulty, runElapsedMs, casesCompleted, totalScore } =
    body as {
      playerName: string;
      difficulty: string;
      runElapsedMs: number;
      casesCompleted: number;
      totalScore: number;
    };

  // Init Supabase with service role (bypasses RLS)
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";

  const allowed = await checkRateLimit(supabase, ip);
  if (!allowed) {
    return corsResponse(
      JSON.stringify({
        error: "Too many submissions. Please try again later.",
      }),
      429,
    );
  }

  // Insert
  const { data, error } = await supabase
    .from("leaderboard")
    .insert({
      player_name: playerName.trim(),
      difficulty,
      run_elapsed_ms: Math.floor(runElapsedMs),
      cases_completed: casesCompleted,
      total_score: totalScore,
      submitter_ip: ip,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[submit-score] Insert error:", error.message);
    return corsResponse(
      JSON.stringify({ error: "Failed to submit score." }),
      500,
    );
  }

  return corsResponse(JSON.stringify({ id: data.id }), 200);
});
