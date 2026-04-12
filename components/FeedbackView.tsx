"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import { Sprite } from "./Sprite";
import { ResumeViewer } from "./ResumeViewer";
import styles from "./FeedbackView.module.css";

export function FeedbackView() {
  const lastResult = useGameStore((s) => s.lastResult);
  const nextResume = useGameStore((s) => s.nextResume);
  const resumes = useGameStore((s) => s.resumes);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);
  const [showResume, setShowResume] = useState(false);

  const isLastResume = currentIndex >= resumes.length - 1;
  const currentResume = resumes[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") nextResume();
      if (e.key === "r" || e.key === "R") setShowResume((v) => !v);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextResume]);

  if (!lastResult) return null;

  return (
    <div
      className={`${styles.container} ${showResume ? styles.containerSplit : ""}`}
    >
      {showResume && currentResume && (
        <div className={styles.resumePane}>
          <ResumeViewer resume={currentResume} />
        </div>
      )}
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="clipboard" /> Decision Result
          </span>
        </div>
        <div className={styles.windowContent}>
          {/* Result icon */}
          <div
            className={`${styles.resultIcon} ${lastResult.correct ? styles.correct : styles.incorrect}`}
          >
            {lastResult.correct ? (
              <Sprite name="checkmark" size={32} />
            ) : (
              <Sprite name="cross-mark" size={32} />
            )}
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

          {/* Action buttons */}
          <div className={styles.actions}>
            <button
              className="btn-raised"
              onClick={() => setShowResume((v) => !v)}
            >
              {showResume ? "Hide Resume" : "View Resume"}{" "}
              <span className="shortcut-hint">[R]</span>
            </button>
            <button className="btn-raised" onClick={nextResume}>
              {isLastResume ? "View Case Results" : "Next Resume"}{" "}
              <span className="shortcut-hint">[Enter]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
