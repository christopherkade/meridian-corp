"use client";

import { useGameStore } from "@/lib/store";
import { LeftPanel } from "./LeftPanel";
import { TimerPanel } from "./TimerPanel";
import { ResumeViewer } from "./ResumeViewer";
import { RightPanel } from "./RightPanel";
import styles from "./GameView.module.css";

export function GameView() {
  const resumes = useGameStore((s) => s.resumes);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);
  const currentResume = resumes[currentIndex];

  if (!currentResume) return null;

  return (
    <div className={styles.layout}>
      <div className={styles.leftPanel}>
        <LeftPanel />
        <TimerPanel />
      </div>
      <div className={styles.centerPanel}>
        <ResumeViewer resume={currentResume} />
      </div>
      <div className={styles.rightPanel}>
        <RightPanel />
      </div>
    </div>
  );
}
