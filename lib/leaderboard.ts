import { getSupabase } from "./supabase";
import { Difficulty } from "./types";
import { validateName } from "./name-filter";

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  difficulty: string;
  run_elapsed_ms: number;
  cases_completed: number;
  total_score: number;
  created_at: string;
}

const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const MAX_NAME_LENGTH = 20;
const MIN_PLAUSIBLE_MS = 5000;

// ── In-memory TTL cache ────────────────────────────────────

const LEADERBOARD_TTL_MS = 30_000; // 30 seconds
const EOTD_TTL_MS = 60_000; // 60 seconds

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const leaderboardCache = new Map<Difficulty, CacheEntry<LeaderboardEntry[]>>();
let eotdCache: CacheEntry<Record<Difficulty, LeaderboardEntry | null>> | null =
  null;

function getCached<T>(entry: CacheEntry<T> | undefined | null): T | null {
  if (entry && Date.now() < entry.expiresAt) return entry.data;
  return null;
}

export async function fetchLeaderboard(
  difficulty: Difficulty,
): Promise<LeaderboardEntry[]> {
  const cached = getCached(leaderboardCache.get(difficulty));
  if (cached) return cached;

  const { data, error } = await getSupabase()
    .from("leaderboard")
    .select(
      "id, player_name, difficulty, run_elapsed_ms, cases_completed, total_score, created_at",
    )
    .eq("difficulty", difficulty)
    .order("total_score", { ascending: false })
    .limit(100);

  if (error) {
    console.error(
      "[Leaderboard] Fetch error:",
      error.message,
      error.code,
      error.details,
    );
    throw new Error("Failed to fetch leaderboard.");
  }
  const entries = data ?? [];
  leaderboardCache.set(difficulty, {
    data: entries,
    expiresAt: Date.now() + LEADERBOARD_TTL_MS,
  });
  return entries;
}

export async function submitScore(params: {
  playerName: string;
  difficulty: Difficulty;
  runElapsedMs: number;
  casesCompleted: number;
  totalScore: number;
}): Promise<string> {
  const { playerName, difficulty, runElapsedMs, casesCompleted, totalScore } =
    params;

  const trimmed = playerName.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH) {
    throw new Error(`Name must be 1-${MAX_NAME_LENGTH} characters.`);
  }
  const nameError = validateName(trimmed);
  if (nameError) {
    throw new Error(nameError);
  }
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    throw new Error("Invalid difficulty.");
  }
  if (runElapsedMs < MIN_PLAUSIBLE_MS) {
    throw new Error("Invalid run time.");
  }
  if (casesCompleted < 0 || !Number.isInteger(casesCompleted)) {
    throw new Error("Invalid cases completed.");
  }
  if (!Number.isInteger(totalScore)) {
    throw new Error("Invalid score.");
  }

  const payload = {
    playerName: trimmed,
    difficulty,
    runElapsedMs: Math.floor(runElapsedMs),
    casesCompleted,
    totalScore,
  };

  const { data: fnData, error: fnError } = await getSupabase().functions.invoke(
    "submit-score",
    { body: payload },
  );

  if (fnError) {
    console.error("[Leaderboard] Edge Function error:", fnError);
    // fnError.context may contain the Response with status/body
    throw new Error(fnError.message || "Failed to submit score.");
  }

  const json = fnData;

  // Invalidate caches so the new score is visible immediately
  leaderboardCache.delete(difficulty);
  eotdCache = null;

  return json.id;
}

export async function fetchEmployeesOfTheDay(): Promise<
  Record<Difficulty, LeaderboardEntry | null>
> {
  const cached = getCached(eotdCache);
  if (cached) return cached;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const result: Record<Difficulty, LeaderboardEntry | null> = {
    easy: null,
    medium: null,
    hard: null,
  };

  await Promise.all(
    VALID_DIFFICULTIES.map(async (difficulty) => {
      const { data, error } = await getSupabase()
        .from("leaderboard")
        .select(
          "id, player_name, difficulty, run_elapsed_ms, cases_completed, total_score, created_at",
        )
        .eq("difficulty", difficulty)
        .gte("created_at", todayISO)
        .order("total_score", { ascending: false })
        .limit(1);

      if (error) {
        console.error(
          "[Leaderboard] Employee of the day fetch error:",
          error.message,
        );
        return;
      }

      result[difficulty] = data && data.length > 0 ? data[0] : null;
    }),
  );

  eotdCache = { data: result, expiresAt: Date.now() + EOTD_TTL_MS };
  return result;
}
