import { supabase } from "./supabase";
import { Difficulty } from "./types";

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
  const { data, error } = await supabase
    .from("leaderboard")
    .select(
      "id, player_name, difficulty, run_elapsed_ms, cases_completed, total_score, created_at",
    )
    .eq("difficulty", difficulty)
    .order("run_elapsed_ms", { ascending: true })
    .limit(100);

  if (error) throw new Error("Failed to fetch leaderboard.");
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

  const { data, error } = await supabase
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

  if (error) throw new Error("Failed to submit score.");
  return data.id;
}
