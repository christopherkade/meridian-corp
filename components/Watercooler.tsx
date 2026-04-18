"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { playTypeClick, playClick } from "@/lib/sounds";
import {
  GOSSIP_LINES,
  COWORKERS,
  ALIEN_COWORKER,
  ALIEN_COWORKER_CHANCE,
} from "@/lib/data/watercooler-gossip";
import styles from "./Watercooler.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface WatercoolerProps {
  onDismiss: () => void;
}

export function Watercooler({ onDismiss }: WatercoolerProps) {
  const gossip = useMemo(() => {
    const isGary = Math.random() < ALIEN_COWORKER_CHANCE;
    if (isGary) {
      const garyLines = GOSSIP_LINES.filter(
        (l) => l.exclusiveTo === ALIEN_COWORKER.name,
      );
      const line = garyLines[Math.floor(Math.random() * garyLines.length)];
      return {
        ...line,
        coworkerName: ALIEN_COWORKER.name,
        sprite: ALIEN_COWORKER.sprite,
      };
    }
    const normalLines = GOSSIP_LINES.filter((l) => !l.exclusiveTo);
    const line = normalLines[Math.floor(Math.random() * normalLines.length)];
    const coworker = COWORKERS[Math.floor(Math.random() * COWORKERS.length)];
    return { ...line, coworkerName: coworker.name, sprite: coworker.sprite };
  }, []);

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  // Letter-by-letter typewriter effect
  useEffect(() => {
    const text = gossip.text;
    let index = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (index < text.length) {
        index++;
        setDisplayed(text.slice(0, index));
        playTypeClick();
        // Variable speed: pause longer on punctuation
        const char = text[index - 1];
        const delay =
          char === "." || char === "!" || char === "?"
            ? 180
            : char === ","
              ? 100
              : char === "…"
                ? 200
                : 30 + Math.random() * 20;
        setTimeout(tick, delay);
      } else {
        setDone(true);
      }
    };

    // Small initial delay before typing starts
    const id = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [gossip.text]);

  // Dismiss on click or key press (only after typing done, or skip to end)
  const handleDismiss = useCallback(() => {
    if (!done) {
      // Skip to end of text
      setDisplayed(gossip.text);
      setDone(true);
      return;
    }
    playClick();
    onDismiss();
  }, [done, gossip.text, onDismiss]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleDismiss]);

  return (
    <div
      className={styles.container}
      onClick={handleDismiss}
      role="dialog"
      aria-label={`${gossip.coworkerName} says: ${gossip.text}`}
    >
      <div
        className={`panel-raised ${styles.window}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.windowTitle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/sprites/coffee.svg`}
            alt=""
            width={12}
            height={12}
            style={{ imageRendering: "pixelated" }}
          />
          Watercooler Chat
        </div>
        <div className={styles.windowContent}>
          {/* Coworker sprite */}
          <div className={styles.spriteArea}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/sprites/${gossip.sprite}.svg`}
              alt="Office coworker"
              width={64}
              height={64}
              style={{ imageRendering: "pixelated" }}
            />
            <span className={styles.coworkerName}>{gossip.coworkerName}</span>
          </div>

          {/* Message */}
          <div className={`panel-sunken ${styles.messageBox}`}>
            {displayed}
            {!done && <span className={styles.cursor} />}
          </div>

          {/* Continue hint */}
          {done && (
            <div className={styles.continueHint}>
              Click or press Enter to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
