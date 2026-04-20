"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/lib/store";
import { playRatingSound, playClick } from "@/lib/sounds";
import { getAccuracyThreshold } from "@/lib/scoring";
import { Sprite } from "./Sprite";
import { ResumeViewer } from "./ResumeViewer";
import styles from "./CaseEndView.module.css";

export function CaseEndView() {
  const lastCaseResult = useGameStore((s) => s.lastCaseResult);
  const career = useGameStore((s) => s.career);
  const difficulty = useGameStore((s) => s.difficulty);
  const resumes = useGameStore((s) => s.resumes);
  const startNewCase = useGameStore((s) => s.startNewCase);
  const setScreen = useGameStore((s) => s.setScreen);
  const threshold = difficulty ? getAccuracyThreshold(difficulty) : 0.7;
  const [viewingResumeId, setViewingResumeId] = useState<string | null>(null);
  const reviewRef = useRef(
    lastCaseResult
      ? getPerformanceReview(lastCaseResult.rating, lastCaseResult.caseNumber)
      : "",
  );

  // Play rating-appropriate sound when case end screen appears
  useEffect(() => {
    if (lastCaseResult) playRatingSound(lastCaseResult.rating);
  }, [lastCaseResult]);

  useEffect(() => {
    if (viewingResumeId) return; // disable shortcuts when viewing resume
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        playClick();
        if (lastCaseResult && lastCaseResult.accuracy < threshold) {
          setScreen("game-over");
        } else {
          startNewCase();
        }
      }
      if (e.key === "d" || e.key === "D") {
        playClick();
        setScreen("dashboard");
      }
      if (e.key === "m" || e.key === "M") {
        playClick();
        setScreen("menu");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startNewCase, setScreen, viewingResumeId, lastCaseResult, threshold]);

  if (!lastCaseResult) return null;

  const { caseNumber, results, totalScore, accuracy, rating } = lastCaseResult;
  const correctCount = results.filter((r) => r.correct).length;
  const elapsed = formatElapsed(career.runElapsedMs);

  const viewingResume = viewingResumeId
    ? resumes.find((r) => r.id === viewingResumeId)
    : null;

  return (
    <div className={styles.container}>
      {/* Resume viewer modal */}
      {viewingResume && (
        <div
          className={styles.resumeModal}
          onClick={() => setViewingResumeId(null)}
        >
          <div
            className={styles.resumeModalInner}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.resumeModalTitle}>
              <span>
                <Sprite name="clipboard" /> {viewingResume.data.contact.name}
                &apos;s Resume
              </span>
              <button
                className="btn-raised"
                onClick={() => {
                  playClick();
                  setViewingResumeId(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className={styles.resumeModalBody}>
              <ResumeViewer resume={viewingResume} hideHeader />
            </div>
          </div>
        </div>
      )}

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

          {/* Corporate review */}
          <div
            className={`panel-sunken ${styles.review} ${accuracy < threshold ? styles.reviewFail : ""}`}
          >
            {accuracy < threshold ? (
              <>
                <p className={styles.reviewHeader}>
                  <strong>⚠ NOTICE OF PERFORMANCE TERMINATION</strong>
                </p>
                <p className={styles.reviewText}>
                  Your accuracy of {Math.round(accuracy * 100)}% has fallen
                  below the minimum threshold of {Math.round(threshold * 100)}%.
                  Per company policy, your employment has been terminated
                  effective immediately.
                </p>
              </>
            ) : (
              <>
                <p className={styles.reviewHeader}>
                  <strong>PERFORMANCE REVIEW - INTERNAL MEMO</strong>
                </p>
                <p className={styles.reviewText}>{reviewRef.current}</p>
              </>
            )}
            <p className={styles.reviewSignature}>
              - HR Performance Review Bot v2.4
            </p>
          </div>

          {/* Per-resume results list */}
          <div className={`panel-sunken ${styles.resultsList}`}>
            <div className={styles.resultsHeader}>
              <span className={styles.resultsColName}>Candidate</span>
              <span className={styles.resultsColStamp}>Your Decision</span>
              <span className={styles.resultsColResult}>Result</span>
              <span className={styles.resultsColAction}></span>
            </div>
            {results.map((result, i) => {
              const resume = resumes.find((r) => r.id === result.resumeId);
              const candidateName =
                resume?.data.contact.name ?? `Resume #${i + 1}`;
              return (
                <div
                  key={i}
                  className={`${styles.resultRow} ${result.correct ? "" : styles.resultRowWrong}`}
                >
                  <span className={styles.resultsColName}>{candidateName}</span>
                  <span className={styles.resultsColStamp}>
                    <span
                      className={
                        result.decision === "hire"
                          ? styles.stampHire
                          : styles.stampFlag
                      }
                    >
                      {result.decision === "hire" ? "HIRED" : "FLAGGED"}
                    </span>
                  </span>
                  <span className={styles.resultsColResult}>
                    <span
                      className={
                        result.correct
                          ? styles.resultCorrect
                          : styles.resultWrong
                      }
                    >
                      {result.correct ? "✓" : "✗"}
                    </span>
                  </span>
                  <span className={styles.resultsColAction}>
                    <button
                      className="btn-raised"
                      onClick={() => {
                        playClick();
                        setViewingResumeId(result.resumeId);
                      }}
                    >
                      View
                    </button>
                  </span>
                </div>
              );
            })}
          </div>

          <div className={`panel-sunken ${styles.statsGrid}`}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Correct</div>
              <div className={styles.statValue}>
                {correctCount}/{results.length}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Accuracy</div>
              <div
                className={`${styles.statValue} ${accuracy < threshold ? styles.statFail : ""}`}
              >
                {Math.round(accuracy * 100)}%
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Score</div>
              <div className={styles.statValue}>
                {totalScore >= 0 ? "+" : ""}
                {totalScore}
              </div>
            </div>
            {elapsed && (
              <div className={styles.stat}>
                <div className={styles.statLabel}>
                  <Sprite name="stopwatch" /> Time
                </div>
                <div className={styles.statValue}>{elapsed}</div>
              </div>
            )}
          </div>

          <div className={styles.buttons}>
            {accuracy >= threshold ? (
              <button
                className="btn-raised"
                onClick={() => {
                  playClick();
                  startNewCase();
                }}
              >
                <Sprite name="folder-open" /> Start Next Case{" "}
                <span className="shortcut-hint">[S]</span>
              </button>
            ) : (
              <button
                className="btn-raised"
                onClick={() => {
                  playClick();
                  setScreen("game-over");
                }}
              >
                <Sprite name="warning" /> Accept Termination{" "}
                <span className="shortcut-hint">[S]</span>
              </button>
            )}
            <button
              className="btn-raised"
              onClick={() => {
                playClick();
                setScreen("dashboard");
              }}
            >
              <Sprite name="briefcase" /> Career Dashboard{" "}
              <span className="shortcut-hint">[D]</span>
            </button>
            <button
              className="btn-raised"
              onClick={() => {
                playClick();
                setScreen("menu");
              }}
            >
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
