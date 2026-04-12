"use client";

import { useEffect, useState, useCallback } from "react";
import { useGameStore } from "@/lib/store";
import { Sprite } from "./Sprite";
import { SpriteName } from "./Sprite";
import styles from "./MainMenu.module.css";

interface EasterEgg {
  icon: SpriteName;
  text: string;
}

const easterEggs: EasterEgg[] = [
  {
    icon: "warning",
    text: "Alien detected in break room. HR has been notified.",
  },
  {
    icon: "paperclip",
    text: "It looks like you're procrastinating. Would you like help?",
  },
  { icon: "lock", text: "Your session will expire in ∞ minutes." },
  {
    icon: "satellite",
    text: 'Signal received from Sector 7G: "Please hire me."',
  },
  {
    icon: "clipboard",
    text: "New policy: All résumés must be reviewed upside down on Tuesdays.",
  },
  {
    icon: "coffee",
    text: "Break room microwave has achieved self-awareness. Avoid Floor 3.",
  },
  {
    icon: "package",
    text: 'Dwight has submitted a résumé listing "Assistant Regional Manager" as his current title. Again.',
  },
  {
    icon: "stew",
    text: "Kevin spilled his famous chili in Server Room B. All systems nominal, surprisingly.",
  },
  {
    icon: "notepad",
    text: "HR Notice: Jim has placed another applicant's stapler in Jell-O. Please disregard.",
  },
  {
    icon: "party",
    text: "Party Planning Committee conflict: Angela vs. Phyllis. Conference Room C is off-limits.",
  },
];

export function MainMenu() {
  const startNewCase = useGameStore((s) => s.startNewCase);
  const setScreen = useGameStore((s) => s.setScreen);
  const career = useGameStore((s) => s.career);
  const nextCaseNumber = career.casesCompleted.length + 1;
  const [toasts, setToasts] = useState<number[]>([]);

  const addToast = useCallback(() => {
    setToasts((prev) => {
      if (prev.length >= 4) return prev;
      const remaining = easterEggs
        .map((_, i) => i)
        .filter((i) => !prev.includes(i));
      if (remaining.length === 0) return prev;
      const pick = remaining[Math.floor(Math.random() * remaining.length)];
      return [...prev, pick];
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") startNewCase();
      if ((e.key === "d" || e.key === "D") && career.casesCompleted.length > 0)
        setScreen("dashboard");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startNewCase, setScreen, career.casesCompleted.length]);

  useEffect(() => {
    const interval = setInterval(addToast, 10000);
    return () => clearInterval(interval);
  }, [addToast]);

  return (
    <div className={styles.container}>
      {toasts.length > 0 && (
        <div className={styles.toastStack}>
          {toasts.map((eggIndex, i) => (
            <div key={eggIndex} className={`panel-raised ${styles.toast}`}>
              <div className={styles.toastTitle}>
                <span>
                  <Sprite name="speech-bubble" /> System Notification
                </span>
                <button
                  className={styles.toastClose}
                  onClick={() =>
                    setToasts((prev) => prev.filter((_, j) => j !== i))
                  }
                >
                  ✕
                </button>
              </div>
              <div className={styles.toastBody}>
                <Sprite name={easterEggs[eggIndex].icon} />{" "}
                {easterEggs[eggIndex].text}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="clipboard" /> TalentBridge Pro 3.2
          </span>
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
              {nextCaseNumber === 1
                ? "Start First Case"
                : `Start Case ${nextCaseNumber}`}{" "}
              <span className="shortcut-hint">[S]</span>
            </button>
            {career.casesCompleted.length > 0 && (
              <button
                className="btn-raised"
                onClick={() => setScreen("dashboard")}
              >
                <Sprite name="chart" /> Career Dashboard{" "}
                <span className="shortcut-hint">[D]</span>
              </button>
            )}
          </div>

          <p className={styles.version}>
            TalentBridge Pro v3.2.1 - Build 20260411
          </p>
        </div>
      </div>
    </div>
  );
}
