"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Difficulty } from "@/lib/types";
import { fetchEmployeesOfTheDay, LeaderboardEntry } from "@/lib/leaderboard";
import { playClick } from "@/lib/sounds";
import { Sprite, SpriteName } from "./Sprite";
import styles from "./EmployeeOfTheDay.module.css";

const TROPHY_SPRITES: Record<Difficulty, SpriteName> = {
  hard: "trophy-gold",
  medium: "trophy-silver",
  easy: "trophy-bronze",
};

// Display order: Easy (left) — Hard (center, featured) — Medium (right)
const DISPLAY_ORDER: Difficulty[] = ["easy", "hard", "medium"];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function EmployeeCard({
  entry,
  difficulty,
}: {
  entry: LeaderboardEntry | null;
  difficulty: Difficulty;
}) {
  const tier =
    difficulty === "hard"
      ? "Gold"
      : difficulty === "medium"
        ? "Silver"
        : "Bronze";

  return (
    <div className={`${styles.card} ${styles[`card${tier}`]}`}>
      <span className={`${styles.difficultyBadge} ${styles[`badge${tier}`]}`}>
        {DIFFICULTY_LABELS[difficulty]}
      </span>

      <span
        className={`${styles.trophy} ${difficulty === "hard" ? styles.trophyGold : ""}`}
      >
        <Sprite
          name={TROPHY_SPRITES[difficulty]}
          size={difficulty === "hard" ? 48 : 36}
        />
      </span>

      {entry ? (
        <>
          <span
            className={`${styles.employeeName} ${difficulty === "hard" ? styles.employeeNameGold : ""}`}
          >
            {entry.player_name}
          </span>
          <span className={styles.scoreLabel}>Score</span>
          <span
            className={`${styles.scoreValue} ${difficulty === "hard" ? styles.scoreValueGold : ""}`}
          >
            {entry.total_score.toLocaleString()}
          </span>
          <span className={styles.meta}>
            {entry.cases_completed} case{entry.cases_completed !== 1 ? "s" : ""}{" "}
            completed
          </span>
        </>
      ) : (
        <span className={styles.emptyCard}>
          No entries today.
          <br />
          This could be you!
        </span>
      )}
    </div>
  );
}

export function EmployeeOfTheDay() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Record<
    Difficulty,
    LeaderboardEntry | null
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchEmployeesOfTheDay();
        if (!cancelled) setEmployees(data);
      } catch {
        if (!cancelled) setError("Could not load today's employees.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "b" || e.key === "B") {
        playClick();
        if (shareOpen) {
          setShareOpen(false);
        } else {
          router.push("/leaderboard");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, shareOpen]);

  // Close share menu when clicking outside
  useEffect(() => {
    if (!shareOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(e.target as Node)
      ) {
        setShareOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [shareOpen]);

  const captureImage = useCallback(async (): Promise<Blob | null> => {
    if (!captureRef.current) return null;
    // Close the share menu first so React removes it from the DOM
    setShareOpen(false);
    setCapturing(true);
    // Wait a frame for React to re-render without the popup
    await new Promise((r) => requestAnimationFrame(r));
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      // Temporarily hide buttons and share wrapper
      const hideEls = captureRef.current.querySelectorAll<HTMLElement>(
        `.${styles.hideOnCapture}`,
      );
      hideEls.forEach((el) => (el.style.display = "none"));
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#c0c0c0",
        scale: 2,
      });
      hideEls.forEach((el) => (el.style.display = ""));
      return await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
    } finally {
      setCapturing(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    playClick();
    const blob = await captureImage();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee-of-the-day.png";
    a.click();
    URL.revokeObjectURL(url);
    setShareOpen(false);
  }, [captureImage]);

  const getShareText = () => {
    return "Check out today's Employee of the Day at Meridian Corp! 🏆";
  };

  const handleNativeShare = useCallback(async () => {
    playClick();
    const blob = await captureImage();
    if (!blob) return;
    const file = new File([blob], "employee-of-the-day.png", {
      type: "image/png",
    });
    try {
      await navigator.share({
        text: getShareText(),
        files: [file],
      });
    } catch {
      // User cancelled or share failed silently
    }
    setShareOpen(false);
  }, [captureImage]);

  const handleTwitter = useCallback(async () => {
    playClick();
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
    setShareOpen(false);
  }, []);

  const handleLinkedIn = useCallback(async () => {
    playClick();
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
    setShareOpen(false);
  }, []);

  const supportsNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.container}>
      <div ref={captureRef} className={`panel-raised ${styles.window}`}>
        <div className={styles.windowTitle}>
          <span>
            <Sprite name="party" /> Employee of the Day — Recognition Board
          </span>
        </div>
        <div className={styles.windowContent}>
          <div className={styles.posterHeader}>
            <h2 className={styles.posterTitle}>Employee of the Day</h2>
            <p className={styles.posterSubtitle}>
              Meridian Solutions™ — Human Resources Division
            </p>
            <p className={styles.posterDate}>{today}</p>
          </div>

          <hr className={styles.divider} />

          {loading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}

          {!loading && !error && employees && (
            <div className={styles.podium}>
              {DISPLAY_ORDER.map((d) => (
                <EmployeeCard key={d} entry={employees[d]} difficulty={d} />
              ))}
            </div>
          )}

          <hr className={styles.divider} />

          <p className={styles.footer}>
            This recognition is purely ceremonial and does not entitle the
            employee to any raise, promotion, or additional break time.
          </p>

          <div className={`${styles.buttons} ${styles.hideOnCapture}`}>
            <Link
              href="/leaderboard"
              className="btn-raised"
              onClick={() => playClick()}
            >
              ← Back to Leaderboard <span className="shortcut-hint">[B]</span>
            </Link>
          </div>

          {/* Share button */}
          <div
            ref={shareMenuRef}
            className={`${styles.shareWrapper} ${styles.hideOnCapture}`}
            onClick={(e) => e.stopPropagation()}
          >
            {shareOpen && (
              <div className={styles.sharePopup}>
                <button
                  className={styles.shareOption}
                  onClick={handleDownload}
                  disabled={capturing}
                >
                  📥 Download PNG
                </button>
                {supportsNativeShare && (
                  <button
                    className={styles.shareOption}
                    onClick={handleNativeShare}
                    disabled={capturing}
                  >
                    📤 Share...
                  </button>
                )}
                <button className={styles.shareOption} onClick={handleTwitter}>
                  Post on X
                </button>
                <button className={styles.shareOption} onClick={handleLinkedIn}>
                  Share on Facebook
                </button>
              </div>
            )}
            <button
              className={styles.shareButton}
              onClick={() => {
                playClick();
                setShareOpen((v) => !v);
              }}
              title="Share"
              disabled={capturing}
            >
              {capturing ? "…" : <Sprite name="share" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
