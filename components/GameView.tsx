"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useGameStore } from "@/lib/store";
import { Decision } from "@/lib/types";
import { playStamp, playPaperLand, playClick } from "@/lib/sounds";
import { LeftPanel } from "./LeftPanel";
import { TimerPanel } from "./TimerPanel";
import { ResumeViewer } from "./ResumeViewer";
import { RightPanel } from "./RightPanel";
import styles from "./GameView.module.css";

type AnimState = "entering" | "idle" | "stamping";

const ENTER_DURATION = 350;
const STAMP_DELAY = 200;
const STAMP_HOLD = 700; // 200ms delay + 500ms visible

export function GameView() {
  const resumes = useGameStore((s) => s.resumes);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);
  const makeDecision = useGameStore((s) => s.makeDecision);
  const advanceResume = useGameStore((s) => s.advanceResume);
  const currentResume = resumes[currentIndex];

  const [animState, setAnimState] = useState<AnimState>("entering");
  const [stampType, setStampType] = useState<Decision | null>(null);
  const pendingDecisionRef = useRef<Decision | null>(null);

  // Resume slide-in when index changes
  useEffect(() => {
    const timer = setTimeout(() => {
      playPaperLand();
      setAnimState("idle");
    }, ENTER_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Freeze the run timer so stamp animation time doesn't count
  const freezeTimer = useCallback(() => {
    const state = useGameStore.getState();
    if (state._gameEnteredAt) {
      const elapsed = Date.now() - state._gameEnteredAt;
      useGameStore.setState({
        runActiveMs: state.runActiveMs + elapsed,
        _gameEnteredAt: null,
      });
    }
  }, []);

  const handleDecision = useCallback(
    (decision: Decision) => {
      if (animState !== "idle") return;
      pendingDecisionRef.current = decision;
      setStampType(decision);
      setAnimState("stamping");
      freezeTimer();

      setTimeout(() => {
        playStamp();
      }, STAMP_DELAY);

      setTimeout(() => {
        if (pendingDecisionRef.current === decision) {
          playClick();
          makeDecision(decision);
          setAnimState("entering");
          setStampType(null);
          advanceResume();
        }
      }, STAMP_HOLD);
    },
    [animState, makeDecision, advanceResume, freezeTimer],
  );

  if (!currentResume) return null;

  const animClass =
    animState === "entering"
      ? styles.resumeEntering
      : animState === "stamping"
        ? styles.resumeStamping
        : "";

  return (
    <div className={styles.layout}>
      <div className={styles.leftPanel}>
        <LeftPanel />
        <TimerPanel />
      </div>
      <div className={styles.centerPanel}>
        <div
          key={currentIndex}
          className={`${styles.resumeWrapper} ${animClass}`}
        >
          <ResumeViewer resume={currentResume} />
          {animState === "stamping" && stampType && (
            <div className={styles.stampOverlay}>
              <div
                className={`${styles.stamp} ${stampType === "hire" ? styles.stampHire : styles.stampFlag}`}
              >
                {stampType === "hire" ? "HIRED" : "FLAGGED"}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.rightPanel}>
        <RightPanel
          onDecision={handleDecision}
          disabled={animState !== "idle"}
        />
      </div>
    </div>
  );
}
