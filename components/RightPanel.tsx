"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/lib/store";
import { Decision, SuspicionLevel, DIFFICULTY_CONFIG } from "@/lib/types";
import { playClick, playTimerWarning } from "@/lib/sounds";
import { Sprite } from "./Sprite";
import styles from "./RightPanel.module.css";

const suspicionLevels: { level: SuspicionLevel; label: string }[] = [
  { level: "definitely-human", label: "Definitely Human" },
  { level: "probably-human", label: "Probably Human" },
  { level: "unclear", label: "Unclear" },
  { level: "probably-alien", label: "Probably Alien" },
  { level: "definitely-alien", label: "Definitely Alien" },
];

interface RightPanelProps {
  onDecision?: (decision: Decision) => void;
  disabled?: boolean;
}

/** Compact mobile-only timer that mirrors TimerPanel countdown. */
function MobileInfoBar() {
  const difficulty = useGameStore((s) => s.difficulty);
  const screen = useGameStore((s) => s.screen);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);
  const resumes = useGameStore((s) => s.resumes);
  const caseNumber = useGameStore((s) => s.caseNumber);
  const timerExpired = useGameStore((s) => s.timerExpired);

  const totalSeconds = difficulty
    ? DIFFICULTY_CONFIG[difficulty].timerSeconds
    : 10;

  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  // Reset timer when resume changes
  useEffect(() => {
    setRemaining(totalSeconds);
    expiredRef.current = false;
  }, [currentIndex, totalSeconds]);

  useEffect(() => {
    if (screen !== "game") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!expiredRef.current) {
            expiredRef.current = true;
            setTimeout(() => timerExpired(), 0);
          }
          return 0;
        }
        if (prev === 4) playTimerWarning();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [screen, timerExpired, currentIndex]);

  const isLow = remaining <= 3;
  const reduceAnimations = useGameStore((s) => s.reduceAnimations);

  return (
    <div className={styles.mobileInfo}>
      <span className={styles.mobileCase}>
        Case #{caseNumber} — {currentIndex + 1}/{resumes.length}
      </span>
      <span
        className={`${styles.mobileTimer} ${isLow && !reduceAnimations ? styles.mobileTimerLow : ""}`}
      >
        <Sprite name="stopwatch" /> {remaining}s
      </span>
    </div>
  );
}

export function RightPanel({ onDecision, disabled }: RightPanelProps) {
  const makeDecision = useGameStore((s) => s.makeDecision);
  const resumes = useGameStore((s) => s.resumes);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);

  const handleDecision = (decision: Decision) => {
    if (disabled) return;
    if (onDecision) {
      onDecision(decision);
    } else {
      playClick();
      makeDecision(decision);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      )
        return;
      if (e.key === "h" || e.key === "H") {
        handleDecision("hire");
      }
      if (e.key === "f" || e.key === "F") {
        handleDecision("flag");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [makeDecision, onDecision, disabled]);

  return (
    <div className={`panel-raised ${styles.container}`}>
      <div className={styles.header}>
        <span>
          <Sprite name="scales" /> Decision Panel
        </span>
      </div>

      <div className={styles.content}>
        <MobileInfoBar />
        {/* Decision Buttons */}
        <div className={styles.decisions}>
          <button
            className={`${styles.hireButton}`}
            disabled={disabled}
            onClick={() => handleDecision("hire")}
          >
            HIRE <span className="shortcut-hint">[H]</span>
          </button>
          <button
            className={`${styles.flagButton}`}
            disabled={disabled}
            onClick={() => handleDecision("flag")}
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
