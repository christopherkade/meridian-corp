"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Difficulty } from "@/lib/types";
import { fetchEmployeesOfTheDay, LeaderboardEntry } from "@/lib/leaderboard";
import { playClick } from "@/lib/sounds";
import { Sprite, SpriteName } from "./Sprite";
import styles from "./EmployeeOfTheDay.module.css";

const TROPHY_SPRITES: Record<Difficulty, SpriteName> = {
  hard: "trophy-gold",
  medium: "trophy-silver",
  easy: "trophy-bronze",
};

// Display order: Easy (left) — Hard (center, featured) — Medium (right)
const DISPLAY_ORDER: Difficulty[] = ["easy", "hard", "medium"];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function EmployeeCard({
  entry,
  difficulty,
}: {
  entry: LeaderboardEntry | null;
  difficulty: Difficulty;
}) {
  const tier =
    difficulty === "hard"
      ? "Gold"
      : difficulty === "medium"
        ? "Silver"
        : "Bronze";

  return (
    <div className={`${styles.card} ${styles[`card${tier}`]}`}>
      <span className={`${styles.difficultyBadge} ${styles[`badge${tier}`]}`}>
        {DIFFICULTY_LABELS[difficulty]}
      </span>

      <span
        className={`${styles.trophy} ${difficulty === "hard" ? styles.trophyGold : ""}`}
      >
        <Sprite
          name={TROPHY_SPRITES[difficulty]}
          size={difficulty === "hard" ? 48 : 36}
        />
      </span>

      {entry ? (
        <>
          <span
            className={`${styles.employeeName} ${difficulty === "hard" ? styles.employeeNameGold : ""}`}
          >
            {entry.player_name}
          </span>
          <span className={styles.scoreLabel}>Score</span>
          <span
            className={`${styles.scoreValue} ${difficulty === "hard" ? styles.scoreValueGold : ""}`}
          >
            {entry.total_score.toLocaleString()}
          </span>
          <span className={styles.meta}>
            {entry.cases_completed} case{entry.cases_completed !== 1 ? "s" : ""}{" "}
            completed
          </span>
        </>
      ) : (
        <span className={styles.emptyCard}>
          No entries today.
          <br />
          This could be you!
        </span>
      )}
    </div>
  );
}

export function EmployeeOfTheDay() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Record<
    Difficulty,
    LeaderboardEntry | null
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchEmployeesOfTheDay();
        if (!cancelled) setEmployees(data);
      } catch {
        if (!cancelled) setError("Could not load today's employees.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "b" || e.key === "B") {
        playClick();
        router.push("/leaderboard");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="party" /> Employee of the Day — Recognition Board
          </span>
        </div>
        <div className={styles.windowContent}>
          <div className={styles.posterHeader}>
            <h2 className={styles.posterTitle}>Employee of the Day</h2>
            <p className={styles.posterSubtitle}>
              Meridian Solutions™ — Human Resources Division
            </p>
            <p className={styles.posterDate}>{today}</p>
          </div>

          <hr className={styles.divider} />

          {loading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}

          {!loading && !error && employees && (
            <div className={styles.podium}>
              {DISPLAY_ORDER.map((d) => (
                <EmployeeCard key={d} entry={employees[d]} difficulty={d} />
              ))}
            </div>
          )}

          <hr className={styles.divider} />

          <p className={styles.footer}>
            This recognition is purely ceremonial and does not entitle the
            employee to any raise, promotion, or additional break time.
          </p>

          <div className={styles.buttons}>
            <Link
              href="/leaderboard"
              className="btn-raised"
              onClick={() => playClick()}
            >
              ← Back to Leaderboard <span className="shortcut-hint">[B]</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
