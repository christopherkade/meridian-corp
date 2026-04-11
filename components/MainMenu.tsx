"use client";

import { useGameStore } from "@/lib/store";
import styles from "./MainMenu.module.css";

export function MainMenu() {
  const startNewCase = useGameStore((s) => s.startNewCase);
  const setScreen = useGameStore((s) => s.setScreen);
  const career = useGameStore((s) => s.career);
  const nextCaseNumber = career.casesCompleted.length + 1;

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>📋 TalentBridge Pro 3.2</span>
        </div>
        <div className={styles.windowContent}>
          <div className={styles.logo}>
            <h1 className={styles.companyName}>MERIDIAN</h1>
            <h2 className={styles.companySubtitle}>SOLUTIONS™</h2>
            <p className={styles.tagline}>Human Resources Division</p>
          </div>

          <div className={styles.welcomeBox}>
            <p className={styles.welcomeText}>
              Welcome to the HR Resume Processing Portal.
              <br />
              Your job: review incoming applications and sort candidates.
              <br />
              <em>Some applicants may not be entirely... human.</em>
            </p>
          </div>

          {career.casesCompleted.length > 0 && (
            <div className={styles.stats}>
              <p>Cases completed: {career.casesCompleted.length}</p>
              <p>Total score: {career.totalScore.toLocaleString()}</p>
            </div>
          )}

          <div className={styles.buttons}>
            <button className="btn-raised" onClick={startNewCase}>
              📂{" "}
              {nextCaseNumber === 1
                ? "Start First Case"
                : `Start Case ${nextCaseNumber}`}
            </button>
            {career.casesCompleted.length > 0 && (
              <button
                className="btn-raised"
                onClick={() => setScreen("dashboard")}
              >
                📊 Career Dashboard
              </button>
            )}
          </div>

          <p className={styles.version}>
            TalentBridge Pro v3.2.1 — Build 20260411
          </p>
        </div>
      </div>
    </div>
  );
}
