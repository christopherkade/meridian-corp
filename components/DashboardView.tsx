"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import { CareerStats, RunRecord, DIFFICULTY_CONFIG } from "@/lib/types";
import { Sprite } from "./Sprite";
import styles from "./DashboardView.module.css";

function formatElapsed(ms: number | null): string | null {
  if (ms == null) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  return `${seconds}s`;
}

export function DashboardView() {
  const currentCareer = useGameStore((s) => s.career);
  const runHistory = useGameStore((s) => s.runHistory);
  const setScreen = useGameStore((s) => s.setScreen);
  const startNewCase = useGameStore((s) => s.startNewCase);

  // If there's an active run (cases completed > 0), show it as "Current Run"
  const hasActiveRun = currentCareer.casesCompleted.length > 0;
  const totalEntries = runHistory.length + (hasActiveRun ? 1 : 0);

  // Chronological order: oldest run first, current run last
  // Start at the latest entry (rightmost)
  const [selectedIndex, setSelectedIndex] = useState(totalEntries - 1);

  const isCurrentRun = hasActiveRun && selectedIndex === totalEntries - 1;
  const historyIndex = selectedIndex;

  let displayCareer: CareerStats;
  let displayRun: RunRecord | null = null;

  if (isCurrentRun) {
    displayCareer = currentCareer;
  } else if (historyIndex >= 0 && historyIndex < runHistory.length) {
    displayRun = runHistory[historyIndex];
    displayCareer = displayRun.career;
  } else {
    displayCareer = currentCareer;
  }

  const runLabel = isCurrentRun
    ? "Current Run"
    : displayRun
      ? `Run #${displayRun.id} — ${DIFFICULTY_CONFIG[displayRun.difficulty].label}`
      : "No runs yet";

  const elapsed = formatElapsed(displayCareer.runElapsedMs);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") startNewCase();
      if (e.key === "m" || e.key === "M") setScreen("menu");
      if (e.key === "ArrowLeft") setSelectedIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setSelectedIndex((i) => Math.min(totalEntries - 1, i + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startNewCase, setScreen, totalEntries]);

  if (totalEntries === 0) {
    return (
      <div className={styles.container}>
        <div className={`panel-raised ${styles.window}`}>
          <div className={styles.windowTitle}>
            <span>
              <Sprite name="briefcase" /> Career Dashboard
            </span>
          </div>
          <div className={styles.windowContent}>
            <h2 className={styles.heading}>No Runs Yet</h2>
            <p style={{ textAlign: "center", fontSize: 13 }}>
              Complete a run to see your performance history here.
            </p>
            <div className={styles.buttons}>
              <button className="btn-raised" onClick={() => setScreen("menu")}>
                <Sprite name="home" /> Main Menu{" "}
                <span className="shortcut-hint">[M]</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="briefcase" /> Career Dashboard - Employee Performance
            Record
          </span>
        </div>
        <div className={styles.windowContent}>
          {/* Run selector */}
          {totalEntries > 1 && (
            <div className={styles.runSelector}>
              <button
                className="btn-raised"
                disabled={selectedIndex === 0}
                onClick={() => setSelectedIndex((i) => i - 1)}
              >
                ◀
              </button>
              <span className={styles.runLabel}>
                {runLabel}
                {displayRun && (
                  <span className={styles.runDate}>
                    {" "}
                    — {new Date(displayRun.completedAt).toLocaleDateString()}
                  </span>
                )}
              </span>
              <button
                className="btn-raised"
                disabled={selectedIndex === totalEntries - 1}
                onClick={() => setSelectedIndex((i) => i + 1)}
              >
                ▶
              </button>
            </div>
          )}

          <h2 className={styles.heading}>
            {totalEntries <= 1 ? "Performance Summary" : runLabel}
          </h2>

          <div className={`panel-sunken ${styles.statsGrid}`}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Total Resumes Processed</div>
              <div className={styles.statValue}>
                {displayCareer.totalResumesProcessed}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Total Score</div>
              <div className={styles.statValue}>
                {displayCareer.totalScore.toLocaleString()}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Cases Completed</div>
              <div className={styles.statValue}>
                {displayCareer.casesCompleted.length}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>
                {isCurrentRun ? "Current Streak" : "Run Time"}
              </div>
              <div className={styles.statValue}>
                {isCurrentRun
                  ? displayCareer.currentCaseStreak
                  : (elapsed ?? "—")}
              </div>
            </div>
          </div>

          {displayRun && (
            <div className={styles.runMeta}>
              <span>
                Difficulty:{" "}
                <strong>
                  {DIFFICULTY_CONFIG[displayRun.difficulty].label}
                </strong>
              </span>
              <span>
                Strikes:{" "}
                <strong>
                  {displayRun.strikes}/{displayRun.maxStrikes}
                </strong>
              </span>
              {elapsed && (
                <span>
                  <Sprite name="stopwatch" /> {elapsed}
                </span>
              )}
            </div>
          )}

          {/* Case history */}
          {displayCareer.casesCompleted.length > 0 && (
            <div className={styles.historySection}>
              <h3 className={styles.subheading}>Case History</h3>
              <div className={`panel-sunken ${styles.table}`}>
                <div className={styles.tableHeader}>
                  <span>Case</span>
                  <span>Rating</span>
                  <span>Accuracy</span>
                  <span>Score</span>
                </div>
                {displayCareer.casesCompleted.map((c) => (
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
              {getCareerReview(
                displayCareer.casesCompleted.length,
                displayCareer.totalScore,
              )}
              <br />
              <br />
              Your continued employment is appreciated (and under review).
            </p>
            <p className={styles.reviewSignature}>
              - Department of Human Resources
              <br />
              Meridian Solutions™
            </p>
          </div>

          <div className={styles.buttons}>
            {isCurrentRun && (
              <button className="btn-raised" onClick={startNewCase}>
                <Sprite name="folder-open" /> Start Next Case{" "}
                <span className="shortcut-hint">[S]</span>
              </button>
            )}
            <button className="btn-raised" onClick={() => setScreen("menu")}>
              <Sprite name="home" /> Main Menu{" "}
              <span className="shortcut-hint">[M]</span>
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
