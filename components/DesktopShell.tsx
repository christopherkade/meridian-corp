"use client";

import { ReactNode, useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import styles from "./DesktopShell.module.css";

interface DesktopShellProps {
  children: ReactNode;
}

const fakeMenus: Record<string, string[]> = {
  File: [
    "New Hire Request...",
    "Open Case File...",
    "---",
    "Print Resume",
    "---",
    "Exit (Just Kidding)",
  ],
  Edit: [
    "Undo Decision (Not Available)",
    "---",
    "Select All Text",
    "Find Anomaly (Manual Only)",
  ],
  View: [
    "Zoom In",
    "Zoom Out",
    "---",
    "Show Suspicion Meter",
    "Show Resume Pile",
  ],
  Help: [
    "Have you tried being more human?",
    "---",
    "About TalentBridge Pro 3.2",
    "Report a Bug (to IT, not us)",
  ],
};

const notifications = [
  "Reminder: Q3 Compliance Training due in 847 days",
  "New office microwave policy effective immediately",
  "Parking lot B will be closed for resurfacing (indefinitely)",
  "Casual Friday has been moved to Thursday this week",
  "Please do not feed the plants in the break room",
  "IT Advisory: Do not click on suspicious emails. Or any emails.",
  "Reminder: Timesheets are due yesterday",
];

export function DesktopShell({ children }: DesktopShellProps) {
  const [time, setTime] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [notification, setNotification] = useState(notifications[0]);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const resetGame = useGameStore((s) => s.resetGame);
  const setScreen = useGameStore((s) => s.setScreen);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pickRandom = () => {
      setNotification(
        notifications[Math.floor(Math.random() * notifications.length)],
      );
    };
    // Initial random pick after hydration, then rotate every 30s
    const initialTimeout = setTimeout(pickRandom, 0);
    const interval = setInterval(pickRandom, 30000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={styles.desktop}
      onClick={() => {
        setOpenMenu(null);
        setStartMenuOpen(false);
      }}
    >
      {/* Title Bar / Menu Bar */}
      <div className={styles.titlebar}>
        <div className={styles.titleLeft}>
          <span className={styles.appIcon}>📋</span>
          <span className={styles.appTitle}>
            TalentBridge Pro 3.2 — Meridian Solutions HR Portal
          </span>
        </div>
        <div className={styles.menuBar}>
          {Object.entries(fakeMenus).map(([label, items]) => (
            <div key={label} className={styles.menuWrapper}>
              <button
                className={`${styles.menuButton} ${openMenu === label ? styles.menuButtonActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(openMenu === label ? null : label);
                }}
              >
                {label}
              </button>
              {openMenu === label && (
                <div className={styles.menuDropdown}>
                  {items.map((item, i) =>
                    item === "---" ? (
                      <div key={i} className={styles.menuDivider} />
                    ) : (
                      <button
                        key={i}
                        className={styles.menuItem}
                        onClick={() => setOpenMenu(null)}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>{children}</div>

      {/* Taskbar */}
      <div className={styles.taskbar}>
        <div className={styles.taskbarLeft}>
          <div className={styles.startMenuWrapper}>
            <button
              className={`btn-raised ${styles.startButton} ${startMenuOpen ? styles.startButtonActive : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setStartMenuOpen(!startMenuOpen);
              }}
            >
              🏢 Meridian
            </button>
            {startMenuOpen && (
              <div className={styles.startMenu}>
                <div className={styles.startMenuSidebar}>
                  <span>Meridian Solutions™</span>
                </div>
                <div className={styles.startMenuItems}>
                  <button
                    className={styles.startMenuItem}
                    onClick={() => {
                      setScreen("menu");
                      setStartMenuOpen(false);
                    }}
                  >
                    🏠 Main Menu
                  </button>
                  <div className={styles.menuDivider} />
                  <button
                    className={styles.startMenuItem}
                    onClick={() => {
                      setShowResetDialog(true);
                      setStartMenuOpen(false);
                    }}
                  >
                    🗑️ Reset Progress
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.taskbarNotification}>💬 {notification}</div>

        {/* Reset Confirmation Dialog */}
        {showResetDialog && (
          <div
            className={styles.dialogOverlay}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`panel-raised ${styles.dialog}`}>
              <div className={styles.dialogTitle}>
                <span>⚠️ Confirm Reset</span>
              </div>
              <div className={styles.dialogContent}>
                <p className={styles.dialogIcon}>⚠️</p>
                <p className={styles.dialogText}>
                  Are you sure you want to reset all career progress?
                  <br />
                  This action cannot be undone.
                </p>
                <div className={styles.dialogButtons}>
                  <button
                    className="btn-raised"
                    onClick={() => {
                      resetGame();
                      setShowResetDialog(false);
                    }}
                  >
                    Yes, Reset
                  </button>
                  <button
                    className="btn-raised"
                    onClick={() => setShowResetDialog(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.taskbarRight}>
          <span className={styles.trayIcon} title="MeridianGuard Antivirus">
            🛡️
          </span>
          <span className={styles.clock}>{time}</span>
        </div>
      </div>
    </div>
  );
}
