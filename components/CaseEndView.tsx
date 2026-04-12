"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { Sprite } from "./Sprite";
import styles from "./CaseEndView.module.css";

export function CaseEndView() {
  const lastCaseResult = useGameStore((s) => s.lastCaseResult);
  const career = useGameStore((s) => s.career);
  const startNewCase = useGameStore((s) => s.startNewCase);
  const setScreen = useGameStore((s) => s.setScreen);

  if (!lastCaseResult) return null;

  const { caseNumber, results, totalScore, accuracy, rating } = lastCaseResult;
  const correctCount = results.filter((r) => r.correct).length;
  const falsePositives = results.filter(
    (r) => !r.correct && r.decision === "flag",
  ).length;
  const falseNegatives = results.filter(
    (r) => !r.correct && r.decision === "hire",
  ).length;
  const elapsed = formatElapsed(career.runElapsedMs);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") startNewCase();
      if (e.key === "d" || e.key === "D") setScreen("dashboard");
      if (e.key === "m" || e.key === "M") setScreen("menu");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startNewCase, setScreen]);

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="chart" /> End of Day Report - Case #{caseNumber}
          </span>
        </div>
        <div className={styles.windowContent}>
          <div className={styles.ratingBox}>
            <div className={styles.ratingLabel}>Performance Rating</div>
            <div
              className={`${styles.ratingValue} ${styles[`rating${rating}`]}`}
            >
              {rating}
            </div>
          </div>

          <div className={`panel-sunken ${styles.statsGrid}`}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Resumes Processed</div>
              <div className={styles.statValue}>{results.length}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Correct Decisions</div>
              <div className={styles.statValue}>
                {correctCount}/{results.length}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Accuracy</div>
              <div className={styles.statValue}>
                {Math.round(accuracy * 100)}%
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Total Score</div>
              <div className={styles.statValue}>
                {totalScore >= 0 ? "+" : ""}
                {totalScore}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>False Positives</div>
              <div className={styles.statValue}>{falsePositives}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>False Negatives</div>
              <div
                className={`${styles.statValue} ${falseNegatives > 0 ? styles.danger : ""}`}
              >
                {falseNegatives}
              </div>
            </div>
            {elapsed && (
              <div className={`${styles.stat} ${styles.fullWidth}`}>
                <div className={styles.statLabel}>
                  <Sprite name="stopwatch" /> Run Time
                </div>
                <div className={styles.statValue}>{elapsed}</div>
              </div>
            )}
          </div>

          {/* Corporate review */}
          <div className={`panel-sunken ${styles.review}`}>
            <p className={styles.reviewHeader}>
              <strong>PERFORMANCE REVIEW - INTERNAL MEMO</strong>
            </p>
            <p className={styles.reviewText}>
              {getPerformanceReview(rating, caseNumber)}
            </p>
            <p className={styles.reviewSignature}>
              - HR Performance Review Bot v2.4
            </p>
          </div>

          <div className={styles.buttons}>
            <button className="btn-raised" onClick={startNewCase}>
              <Sprite name="folder-open" /> Start Next Case{" "}
              <span className="shortcut-hint">[S]</span>
            </button>
            <button
              className="btn-raised"
              onClick={() => setScreen("dashboard")}
            >
              <Sprite name="chart" /> Career Dashboard{" "}
              <span className="shortcut-hint">[D]</span>
            </button>
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

function getPerformanceReview(rating: string, caseNumber: number): string {
  const reviews: Record<string, string[]> = {
    S: [
      "Exceptional work. Your attention to detail is noted and will be filed accordingly. Keep it up - the company is watching.",
      "Outstanding performance. Management is impressed, though they would never say so directly.",
      "Flawless execution. HR is considering naming a conference room after you. (Pending budget approval.)",
    ],
    A: [
      "Good work today. Your performance meets the high standards we pretend to have around here.",
      "Solid results. Your manager has been CC'd on this review, which they will definitely read.",
      "Above average performance. A commemorative lanyard will be issued at the next all-hands.",
    ],
    B: [
      "Acceptable performance. Room for improvement, as they say in every review ever written.",
      "Your work today was adequate. The word 'adequate' was chosen very carefully.",
      "Satisfactory. You have not been flagged for retraining. Yet.",
    ],
    C: [
      "Below expectations. Please review the employee handbook section on 'Trying Harder.'",
      "Your performance today raised some concerns. A mandatory workshop has been tentatively scheduled.",
      "Needs improvement. A motivational poster has been placed on your desk as remediation.",
    ],
    F: [
      "We need to talk. Please schedule a meeting with your supervisor at your earliest convenience. And theirs.",
      "This performance level is not sustainable. A stern email has been drafted but not yet sent. Consider this a warning.",
      `After reviewing your Case #${caseNumber} results, management has some... questions. Please do not leave the building.`,
    ],
  };

  const options = reviews[rating] || reviews["C"];
  return options[Math.floor(Math.random() * options.length)];
}

function formatElapsed(ms: number | null): string | null {
  if (ms == null) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}
