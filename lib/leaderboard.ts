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

export async function fetchLeaderboard(
  difficulty: Difficulty,
): Promise<LeaderboardEntry[]> {
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
  console.log(
    "[Leaderboard] Fetched",
    data?.length ?? 0,
    "entries for",
    difficulty,
  );
  return data ?? [];
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

  const { data, error } = await getSupabase()
    .from("leaderboard")
    .insert({
      player_name: trimmed,
      difficulty,
      run_elapsed_ms: Math.floor(runElapsedMs),
      cases_completed: casesCompleted,
      total_score: totalScore,
    })
    .select("id")
    .single();

  if (error) {
    console.error(
      "[Leaderboard] Submit error:",
      error.message,
      error.code,
      error.details,
    );
    throw new Error("Failed to submit score.");
  }
  return data.id;
}
