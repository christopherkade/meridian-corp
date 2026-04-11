"use client";

import { useGameStore } from "@/lib/store";
import styles from "./FeedbackView.module.css";

export function FeedbackView() {
  const lastResult = useGameStore((s) => s.lastResult);
  const nextResume = useGameStore((s) => s.nextResume);
  const resumes = useGameStore((s) => s.resumes);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);

  if (!lastResult) return null;

  const isLastResume = currentIndex >= resumes.length - 1;

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>📋 Decision Result</span>
        </div>
        <div className={styles.windowContent}>
          {/* Result icon */}
          <div
            className={`${styles.resultIcon} ${lastResult.correct ? styles.correct : styles.incorrect}`}
          >
            {lastResult.correct ? "✅" : "❌"}
          </div>

          {/* Result text */}
          <div
            className={`${styles.resultBanner} ${lastResult.correct ? styles.correctBanner : styles.incorrectBanner}`}
          >
            {lastResult.correct ? "CORRECT" : "INCORRECT"}
          </div>

          {/* Explanation */}
          <div className={`panel-sunken ${styles.explanation}`}>
            <p>{lastResult.explanation}</p>
          </div>

          {/* Clues */}
          {lastResult.clues.length > 0 && (
            <div className={styles.cluesSection}>
              <div className={styles.cluesTitle}>Tells found in resume:</div>
              <ul className={styles.cluesList}>
                {lastResult.clues.map((clue, i) => (
                  <li key={i}>
                    <span className={styles.clueCategory}>
                      [{clue.category}]
                    </span>{" "}
                    {clue.description}
                    <span className={styles.clueSection}>
                      {" "}
                      ({clue.section})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Points */}
          <div className={styles.points}>
            <span className={styles.pointsLabel}>Points earned:</span>
            <span
              className={`${styles.pointsValue} ${lastResult.pointsEarned >= 0 ? styles.pointsPositive : styles.pointsNegative}`}
            >
              {lastResult.pointsEarned >= 0 ? "+" : ""}
              {lastResult.pointsEarned}
            </span>
          </div>

          {/* Next button */}
          <button className="btn-raised" onClick={nextResume}>
            {isLastResume ? "📊 View Case Results" : "📄 Next Resume →"}
          </button>
        </div>
      </div>
    </div>
  );
}
