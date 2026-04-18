"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import { submitScore } from "@/lib/leaderboard";
import { validateName } from "@/lib/name-filter";
import { playGameOver, playClick } from "@/lib/sounds";
import { Sprite } from "./Sprite";
import styles from "./GameOver.module.css";

const firingReasons = [
  "Your desk has been cleared. Security will escort you out.",
  "HR has processed your termination. Please return your badge.",
  "Your access card has been deactivated. Don't forget your mug.",
  "Management thanks you for your service. Your parking spot has been reassigned.",
  'Your employee record has been archived under "Lessons Learned."',
];

export function GameOver() {
  const career = useGameStore((s) => s.career);
  const difficulty = useGameStore((s) => s.difficulty);
  const resetRun = useGameStore((s) => s.resetRun);
  const playerName = useGameStore((s) => s.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const scoreSubmitted = useGameStore((s) => s.scoreSubmitted);
  const markScoreSubmitted = useGameStore((s) => s.markScoreSubmitted);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | false>(false);
  const firingReasonRef = useRef(
    firingReasons[Math.floor(Math.random() * firingReasons.length)],
  );
  const didPlayRef = useRef(false);

  // Play game-over sound once on mount
  if (!didPlayRef.current) {
    didPlayRef.current = true;
    playGameOver();
  }

  const elapsed = formatElapsed(career.runElapsedMs);
  const nameError = validateName(playerName.trim());
  const canSubmit =
    !scoreSubmitted &&
    !submitting &&
    playerName.trim().length > 0 &&
    !nameError &&
    career.runElapsedMs != null &&
    difficulty != null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      await submitScore({
        playerName: playerName.trim(),
        difficulty: difficulty!,
        runElapsedMs: career.runElapsedMs!,
        casesCompleted: career.casesCompleted.length,
        totalScore: career.totalScore,
      });
      markScoreSubmitted();
    } catch (err) {
      console.error("Submit failed:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="warning" /> NOTICE OF TERMINATION
          </span>
        </div>
        <div className={styles.windowContent}>
          <div className={styles.icon}>
            <Sprite name="door" size={32} />
          </div>

          <h2 className={styles.heading}>You&apos;ve Been Fired</h2>

          <div className={`panel-sunken ${styles.notice}`}>
            <p className={styles.reason}>{firingReasonRef.current}</p>
          </div>

          <div className={styles.stats}>
            <p>Cases completed: {career.casesCompleted.length}</p>
            <p>Total score: {career.totalScore.toLocaleString()}</p>
            <p>Resumes processed: {career.totalResumesProcessed}</p>
            {elapsed && (
              <p>
                <Sprite name="stopwatch" /> Run time: {elapsed}
              </p>
            )}
          </div>

          {!scoreSubmitted && (
            <div className={styles.submitSection}>
              <label className={styles.nameLabel}>
                Name for leaderboard:
                <input
                  className={styles.nameInput}
                  type="text"
                  maxLength={20}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                />
              </label>
              {nameError && playerName.trim().length > 0 && (
                <p className={styles.submitError}>{nameError}</p>
              )}
              <button
                className="btn-raised"
                disabled={!canSubmit}
                onClick={() => {
                  playClick();
                  handleSubmit();
                }}
              >
                {submitting ? "Submitting..." : "Submit Score"}
              </button>
              {submitError && (
                <p className={styles.submitError}>{submitError}</p>
              )}
            </div>
          )}

          {scoreSubmitted && (
            <p className={styles.submitSuccess}>Score submitted!</p>
          )}

          <div className={styles.buttons}>
            <button
              className="btn-raised"
              onClick={() => {
                playClick();
                resetRun();
              }}
            >
              Try Again
            </button>
            <Link
              href="/leaderboard"
              className="btn-raised"
              onClick={() => playClick()}
            >
              <Sprite name="chart" /> Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
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
