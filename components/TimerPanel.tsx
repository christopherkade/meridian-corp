"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { DIFFICULTY_CONFIG } from "@/lib/types";
import { Sprite } from "./Sprite";
import styles from "./TimerPanel.module.css";

function useTimerDisabled() {
  const searchParams = useSearchParams();
  return process.env.NODE_ENV !== "production" && searchParams.has("noTimer");
}

function TimerPanelInner({ totalSeconds }: { totalSeconds: number }) {
  const screen = useGameStore((s) => s.screen);
  const timerExpired = useGameStore((s) => s.timerExpired);
  const showHourglassAnimation = useGameStore((s) => s.showHourglassAnimation);
  const timerDisabled = useTimerDisabled();

  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  // Run countdown only on game screen
  useEffect(() => {
    if (timerDisabled) return;

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
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [screen, timerExpired, timerDisabled]);

  const isLow = remaining <= 3;

  return (
    <div className={`panel-raised ${styles.container}`}>
      <div className={styles.header}>
        <span>
          <Sprite name="stopwatch" /> Timer
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.timerDisplay}>
          <Sprite
            name="hourglass"
            size={20}
            className={`${styles.hourglass} ${showHourglassAnimation ? "" : styles.hourglassStatic}`}
          />
          <span
            className={`${styles.seconds} ${isLow ? styles.secondsLow : ""}`}
          >
            {remaining}s
          </span>
        </div>
        <span className={styles.label}>
          {timerDisabled ? "Timer Off" : "Time Remaining"}
        </span>
      </div>
    </div>
  );
}

export function TimerPanel() {
  const difficulty = useGameStore((s) => s.difficulty);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);

  const totalSeconds = difficulty
    ? DIFFICULTY_CONFIG[difficulty].timerSeconds
    : 10;

  // Key on currentIndex to fully reset the timer when resume changes
  return <TimerPanelInner key={currentIndex} totalSeconds={totalSeconds} />;
}
