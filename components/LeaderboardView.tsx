"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Difficulty } from "@/lib/types";
import {
  fetchLeaderboard as fetchLeaderboardData,
  LeaderboardEntry,
} from "@/lib/leaderboard";
import { playClick } from "@/lib/sounds";
import { Sprite } from "./Sprite";
import styles from "./LeaderboardView.module.css";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function LeaderboardView() {
  const router = useRouter();
  const [tab, setTab] = useState<Difficulty>("easy");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (difficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaderboardData(difficulty);
      setEntries(data);
    } catch (err) {
      console.error("[LeaderboardView] Load failed:", err);
      setError("Could not load leaderboard. Try again later.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(tab);
  }, [tab, fetchLeaderboard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "m" || e.key === "M")
        router.push("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="chart" /> Global Leaderboard - Top Scores
          </span>
        </div>
        <div className={styles.windowContent}>
          <h2 className={styles.heading}>Top 100 Highest Scores</h2>

          <div className={styles.tabs}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={`${styles.tab} ${tab === d ? styles.tabActive : ""}`}
                onClick={() => {
                  playClick();
                  setTab(d);
                }}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>

          <div className={`panel-sunken ${styles.table}`}>
            <div className={styles.tableHeader}>
              <span>#</span>
              <span>Name</span>
              <span className={styles.time}>Time</span>
              <span className={styles.score}>Score</span>
            </div>

            {loading && <div className={styles.loading}>Loading...</div>}

            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && entries.length === 0 && (
              <div className={styles.empty}>No entries yet. Be the first!</div>
            )}

            {!loading &&
              !error &&
              entries.map((entry, i) => {
                const rank = i + 1;
                const rankClass =
                  rank === 1
                    ? styles.rankGold
                    : rank === 2
                      ? styles.rankSilver
                      : rank === 3
                        ? styles.rankBronze
                        : "";
                return (
                  <div key={entry.id} className={styles.tableRow}>
                    <span className={`${styles.rank} ${rankClass}`}>
                      {rank}
                    </span>
                    <span className={styles.name}>{entry.player_name}</span>
                    <span className={styles.time}>
                      {formatTime(entry.run_elapsed_ms)}
                    </span>
                    <span className={styles.score}>
                      {entry.total_score.toLocaleString()}
                    </span>
                  </div>
                );
              })}
          </div>

          <div className={styles.buttons}>
            <Link
              href="/employee-of-the-day"
              className="btn-raised"
              onClick={() => playClick()}
            >
              <Sprite name="party" /> Employee of the Day
            </Link>
            <Link href="/" className="btn-raised" onClick={() => playClick()}>
              Back to Menu <span className="shortcut-hint">[M]</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
