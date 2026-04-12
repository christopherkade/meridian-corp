"use client";

import { useGameStore } from "@/lib/store";
import { Sprite } from "./Sprite";
import styles from "./LeftPanel.module.css";

export function LeftPanel() {
  const resumes = useGameStore((s) => s.resumes);
  const currentIndex = useGameStore((s) => s.currentResumeIndex);
  const caseNumber = useGameStore((s) => s.caseNumber);

  return (
    <div className={`panel-raised ${styles.container}`}>
      <div className={styles.header}>
        <span>
          <Sprite name="folder" /> Case #{caseNumber}
        </span>
      </div>

      <div className={styles.content}>
        {/* Resume pile */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Resume Pile</div>
          <div className={`panel-sunken ${styles.pile}`}>
            <div className={styles.pileCount}>
              Resume {currentIndex + 1} of {resumes.length}
            </div>
            <div className={styles.pileVisual}>
              {resumes.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.pileItem} ${
                    i < currentIndex
                      ? styles.pileItemDone
                      : i === currentIndex
                        ? styles.pileItemCurrent
                        : styles.pileItemPending
                  }`}
                />
              ))}
            </div>
            <div className={styles.remaining}>
              {resumes.length - currentIndex - 1} remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
