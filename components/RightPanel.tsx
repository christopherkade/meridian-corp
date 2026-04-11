"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { SuspicionLevel } from "@/lib/types";
import styles from "./RightPanel.module.css";

const suspicionLevels: { level: SuspicionLevel; label: string }[] = [
  { level: "definitely-human", label: "Definitely Human" },
  { level: "probably-human", label: "Probably Human" },
  { level: "unclear", label: "Unclear" },
  { level: "probably-alien", label: "Probably Alien" },
  { level: "definitely-alien", label: "Definitely Alien" },
];

export function RightPanel() {
  const makeDecision = useGameStore((s) => s.makeDecision);
  const suspicionLevel = useGameStore((s) => s.suspicionLevel);
  const setSuspicionLevel = useGameStore((s) => s.setSuspicionLevel);
  const resumes = useGameStore((s) => s.resumes);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);
  const caseResults = useGameStore((s) => s.caseResults);
  const showSuspicionMeter = useGameStore((s) => s.showSuspicionMeter);

  const correctCount = caseResults.filter((r) => r.correct).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      )
        return;
      if (e.key === "h" || e.key === "H") makeDecision("hire");
      if (e.key === "f" || e.key === "F") makeDecision("flag");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [makeDecision]);

  return (
    <div className={`panel-raised ${styles.container}`}>
      <div className={styles.header}>
        <span>⚖️ Decision Panel</span>
      </div>

      <div className={styles.content}>
        {/* Score so far */}
        <div className={styles.scoreBox}>
          <div className={styles.scoreLabel}>Accuracy</div>
          <div className={styles.scoreValue}>
            {currentIndex > 0
              ? `${correctCount}/${currentIndex} (${Math.round((correctCount / currentIndex) * 100)}%)`
              : "—"}
          </div>
        </div>

        {/* Suspicion Meter */}
        {showSuspicionMeter && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Suspicion Meter</div>
            <div className={`panel-sunken ${styles.meter}`}>
              {suspicionLevels.map(({ level, label }) => (
                <button
                  key={level}
                  className={`${styles.meterLevel} ${
                    suspicionLevel === level ? styles.meterLevelActive : ""
                  } ${
                    level.includes("alien")
                      ? styles.meterAlien
                      : level.includes("human")
                        ? styles.meterHuman
                        : styles.meterNeutral
                  }`}
                  onClick={() => setSuspicionLevel(level)}
                >
                  {suspicionLevel === level && "▸ "}
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Decision Buttons */}
        <div className={styles.decisions}>
          <button
            className={`${styles.hireButton}`}
            onClick={() => makeDecision("hire")}
          >
            HIRE <span className="shortcut-hint">[H]</span>
          </button>
          <button
            className={`${styles.flagButton}`}
            onClick={() => makeDecision("flag")}
          >
            FLAG AS ALIEN <span className="shortcut-hint">[F]</span>
          </button>
        </div>

        {/* Progress */}
        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            {resumes.length - currentIndex} resume
            {resumes.length - currentIndex !== 1 ? "s" : ""} left today
          </div>
        </div>
      </div>
    </div>
  );
}
