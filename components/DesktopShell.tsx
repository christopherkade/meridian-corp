"use client";

import { ReactNode, useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import { GameScreen } from "@/lib/types";
import styles from "./DesktopShell.module.css";

interface DesktopShellProps {
  children: ReactNode;
}

const fakeMenus: Record<string, string[]> = {
  File: ["__disabled:Print Resume"],
  Edit: ["__disabled:Undo Decision", "---", "__disabled:Find Anomaly"],
  View: ["__toggle:showSuspicionMeter:Suspicion Meter"],
  Help: ["__about:About TalentBridge Pro 3.2"],
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
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const resetGame = useGameStore((s) => s.resetGame);
  const setScreen = useGameStore((s) => s.setScreen);
  const showSuspicionMeter = useGameStore((s) => s.showSuspicionMeter);
  const toggleSuspicionMeter = useGameStore((s) => s.toggleSuspicionMeter);

  const toggleMap: Record<string, { active: boolean; toggle: () => void }> = {
    showSuspicionMeter: {
      active: showSuspicionMeter,
      toggle: toggleSuspicionMeter,
    },
  };

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
            TalentBridge Pro 3.2 - Meridian Solutions HR Portal
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
                    ) : item.startsWith("__toggle:") ? (
                      (() => {
                        const parts = item.split(":");
                        const key = parts[1];
                        const label = parts[2];
                        const info = toggleMap[key];
                        return (
                          <button
                            key={i}
                            className={styles.menuItem}
                            onClick={() => {
                              info?.toggle();
                              setOpenMenu(null);
                            }}
                          >
                            {info?.active ? "✓ " : "   "}
                            {label}
                          </button>
                        );
                      })()
                    ) : item.startsWith("__nav:") ? (
                      <button
                        key={i}
                        className={styles.menuItem}
                        onClick={() => {
                          setScreen(item.split(":")[1] as GameScreen);
                          setOpenMenu(null);
                        }}
                      >
                        {item.split(":")[2]}
                      </button>
                    ) : item.startsWith("__about:") ? (
                      <button
                        key={i}
                        className={styles.menuItem}
                        onClick={() => {
                          setShowAboutDialog(true);
                          setOpenMenu(null);
                        }}
                      >
                        {item.split(":")[1]}
                      </button>
                    ) : item.startsWith("__link:") ? (
                      <a
                        key={i}
                        className={styles.menuItem}
                        href={item.split(":").slice(2).join(":")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpenMenu(null)}
                      >
                        {item.split(":")[1]}
                      </a>
                    ) : item.startsWith("__disabled:") ? (
                      <button
                        key={i}
                        className={`${styles.menuItem} ${styles.menuItemDisabled}`}
                        disabled
                      >
                        {item.split(":")[1]}
                      </button>
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

        {/* About Dialog */}
        {showAboutDialog && (
          <div
            className={styles.dialogOverlay}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`panel-raised ${styles.dialog} ${styles.aboutDialog}`}
            >
              <div className={styles.dialogTitle}>
                <span>ℹ️ About TalentBridge Pro 3.2</span>
                <button
                  className="btn-raised"
                  style={{
                    padding: "0 4px",
                    fontSize: "10px",
                    marginLeft: "auto",
                  }}
                  onClick={() => setShowAboutDialog(false)}
                >
                  ✕
                </button>
              </div>
              <div className={styles.dialogContent}>
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  How to Play
                </p>
                <p className={styles.dialogText} style={{ textAlign: "left" }}>
                  Welcome to TalentBridge Pro, Meridian Corp&apos;s cutting-edge
                  HR platform. Your job is to review incoming resumes and decide
                  whether to <strong>Hire</strong> or <strong>Flag</strong> each
                  applicant.
                </p>
                <p className={styles.dialogText} style={{ textAlign: "left" }}>
                  Some applicants are... not quite human. Look for subtle clues
                  - strange skills, unusual locations, odd job titles, or
                  suspicious personal details. The higher your tier, the harder
                  the clues become to spot.
                </p>
                <p className={styles.dialogText} style={{ textAlign: "left" }}>
                  <strong>Keyboard shortcuts:</strong>{" "}
                  <span className="shortcut-hint">H</span> = Hire,{" "}
                  <span className="shortcut-hint">F</span> = Flag,{" "}
                  <span className="shortcut-hint">Enter</span> = Continue
                </p>
                <hr
                  style={{
                    margin: "12px 0",
                    border: "none",
                    borderTop: "1px solid var(--color-border-dark)",
                  }}
                />
                <p className={styles.dialogText}>
                  Made by <strong>Christopher Kade</strong>
                </p>
                <p className={styles.dialogText}>
                  <a
                    href="https://christopherkade.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-link)" }}
                  >
                    christopherkade.com
                  </a>
                  {" · "}
                  <a
                    href="https://www.linkedin.com/in/christopher-kade/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-link)" }}
                  >
                    LinkedIn
                  </a>
                </p>
                <div className={styles.dialogButtons}>
                  <button
                    className="btn-raised"
                    onClick={() => setShowAboutDialog(false)}
                  >
                    OK
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
