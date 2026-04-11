"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import styles from "./DashboardView.module.css";

export function DashboardView() {
  const career = useGameStore((s) => s.career);
  const setScreen = useGameStore((s) => s.setScreen);
  const startNewCase = useGameStore((s) => s.startNewCase);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") startNewCase();
      if (e.key === "m" || e.key === "M") setScreen("menu");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startNewCase, setScreen]);

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>📊 Career Dashboard — Employee Performance Record</span>
        </div>
        <div className={styles.windowContent}>
          <h2 className={styles.heading}>Performance Summary</h2>

          <div className={`panel-sunken ${styles.statsGrid}`}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Total Resumes Processed</div>
              <div className={styles.statValue}>
                {career.totalResumesProcessed}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Total Score</div>
              <div className={styles.statValue}>
                {career.totalScore.toLocaleString()}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Cases Completed</div>
              <div className={styles.statValue}>
                {career.casesCompleted.length}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Current Streak</div>
              <div className={styles.statValue}>{career.currentCaseStreak}</div>
            </div>
          </div>

          {/* Case history */}
          {career.casesCompleted.length > 0 && (
            <div className={styles.historySection}>
              <h3 className={styles.subheading}>Case History</h3>
              <div className={`panel-sunken ${styles.table}`}>
                <div className={styles.tableHeader}>
                  <span>Case</span>
                  <span>Rating</span>
                  <span>Accuracy</span>
                  <span>Score</span>
                </div>
                {career.casesCompleted.map((c) => (
                  <div key={c.caseNumber} className={styles.tableRow}>
                    <span>#{c.caseNumber}</span>
                    <span className={styles[`rating${c.rating}`]}>
                      {c.rating}
                    </span>
                    <span>{Math.round(c.accuracy * 100)}%</span>
                    <span>
                      {c.totalScore >= 0 ? "+" : ""}
                      {c.totalScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Satirical employee review */}
          <div className={`panel-sunken ${styles.review}`}>
            <p className={styles.reviewHeader}>
              <strong>EMPLOYEE PERFORMANCE LETTER</strong>
            </p>
            <p className={styles.reviewText}>
              Dear Employee #{String(Math.floor(Math.random() * 9000) + 1000)},
              <br />
              <br />
              {getCareerReview(career.casesCompleted.length, career.totalScore)}
              <br />
              <br />
              Your continued employment is appreciated (and under review).
            </p>
            <p className={styles.reviewSignature}>
              — Department of Human Resources
              <br />
              Meridian Solutions™
            </p>
          </div>

          <div className={styles.buttons}>
            <button className="btn-raised" onClick={startNewCase}>
              📂 Start Next Case <span className="shortcut-hint">[S]</span>
            </button>
            <button className="btn-raised" onClick={() => setScreen("menu")}>
              🏠 Main Menu <span className="shortcut-hint">[M]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCareerReview(casesCompleted: number, totalScore: number): string {
  if (casesCompleted === 0) {
    return "You have not yet completed any cases. Please begin work immediately. The resumes are piling up.";
  }
  if (totalScore > 2000) {
    return "Your performance has been noted as 'exceptionally competent,' which is causing some concern among middle management. Please consider making at least one mistake per quarter to maintain team morale.";
  }
  if (totalScore > 500) {
    return "You are performing within acceptable parameters. This is neither a compliment nor a criticism. It is simply a statement. Please continue doing whatever it is you are doing.";
  }
  if (totalScore > 0) {
    return "Your contributions to the department have been... measurable. We have measured them. The numbers exist. HR will follow up with specific, actionable, and deliberately vague feedback.";
  }
  return "After careful review of your case history, we have scheduled a mandatory meeting with your supervisor, their supervisor, and a person from Legal whose role has not been explained to us either. Please bring your badge.";
}
