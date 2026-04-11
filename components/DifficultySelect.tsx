"use client";

import { useGameStore } from "@/lib/store";
import { Difficulty, DIFFICULTY_CONFIG } from "@/lib/types";
import styles from "./DifficultySelect.module.css";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export function DifficultySelect() {
  const startRun = useGameStore((s) => s.startRun);
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>📋 New Employee Intake - Risk Assessment</span>
        </div>
        <div className={styles.windowContent}>
          <p className={styles.heading}>Select your contract terms:</p>
          <p className={styles.subtext}>
            How many mistakes will Meridian Corp tolerate before your
            termination?
          </p>

          <div className={styles.options}>
            {difficulties.map((d) => {
              const config = DIFFICULTY_CONFIG[d];
              return (
                <button
                  key={d}
                  className={`btn-raised ${styles.option}`}
                  onClick={() => startRun(d)}
                >
                  <span className={styles.optionLabel}>{config.label}</span>
                  <span className={styles.optionDesc}>
                    {config.description}
                  </span>
                </button>
              );
            })}
          </div>

          <button className={styles.backLink} onClick={() => setScreen("menu")}>
            ← Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
