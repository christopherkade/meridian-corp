"use client";

import { useGameStore } from "@/lib/store";
import { DIFFICULTY_CONFIG } from "@/lib/types";
import styles from "./GameOver.module.css";

const firingReasons = [
  "Your desk has been cleared. Security will escort you out.",
  "HR has processed your termination. Please return your badge.",
  "Your access card has been deactivated. Don't forget your mug.",
  "Management thanks you for your service. Your parking spot has been reassigned.",
  'Your employee record has been archived under "Lessons Learned."',
];

export function GameOver() {
  const career = useGameStore((s) => s.career);
  const strikes = useGameStore((s) => s.strikes);
  const difficulty = useGameStore((s) => s.difficulty);
  const resetGame = useGameStore((s) => s.resetGame);

  const maxStrikes = difficulty ? DIFFICULTY_CONFIG[difficulty].maxStrikes : 0;
  const firingReason =
    firingReasons[Math.floor(Math.random() * firingReasons.length)];

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>⚠️ NOTICE OF TERMINATION</span>
        </div>
        <div className={styles.windowContent}>
          <div className={styles.icon}>🚪</div>

          <h2 className={styles.heading}>You&apos;ve Been Fired</h2>

          <div className={`panel-sunken ${styles.notice}`}>
            <p>
              You accumulated{" "}
              <strong>
                {strikes}/{maxStrikes}
              </strong>{" "}
              strikes.
            </p>
            <p className={styles.reason}>{firingReason}</p>
          </div>

          <div className={styles.stats}>
            <p>Cases completed: {career.casesCompleted.length}</p>
            <p>Total score: {career.totalScore.toLocaleString()}</p>
            <p>Resumes processed: {career.totalResumesProcessed}</p>
          </div>

          <div className={styles.buttons}>
            <button className="btn-raised" onClick={resetGame}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
