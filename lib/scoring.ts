// Scoring system for Meridian Corp

import { Decision, Difficulty, Rating, SuspicionLevel, Tier } from "./types";

interface ScoreInput {
  isAlien: boolean;
  decision: Decision;
  tier: Tier;
  suspicionLevel?: SuspicionLevel;
}

const BASE_SCORES = {
  correctHire: 100,
  correctFlag: 150,
  falsePositive: -75,
  falseNegative: -200,
} as const;

export function calculateScore(input: ScoreInput): number {
  const { isAlien, decision, tier, suspicionLevel } = input;
  const correct =
    (isAlien && decision === "flag") || (!isAlien && decision === "hire");

  let base: number;
  if (correct) {
    base = isAlien ? BASE_SCORES.correctFlag : BASE_SCORES.correctHire;
  } else {
    base = isAlien ? BASE_SCORES.falseNegative : BASE_SCORES.falsePositive;
  }

  // Tier multiplier
  const tierMultiplier = tier;

  // Confidence bonus (tier 3+)
  let confidenceMultiplier = 1;
  if (tier >= 3 && suspicionLevel) {
    confidenceMultiplier = getConfidenceBonus(decision, suspicionLevel);
  }

  return Math.round(base * tierMultiplier * confidenceMultiplier);
}

function getConfidenceBonus(
  decision: Decision,
  suspicionLevel: SuspicionLevel,
): number {
  const alienLevels: SuspicionLevel[] = ["probably-alien", "definitely-alien"];
  const humanLevels: SuspicionLevel[] = ["probably-human", "definitely-human"];

  if (decision === "flag" && alienLevels.includes(suspicionLevel)) {
    return suspicionLevel === "definitely-alien" ? 1.3 : 1.15;
  }
  if (decision === "hire" && humanLevels.includes(suspicionLevel)) {
    return suspicionLevel === "definitely-human" ? 1.3 : 1.15;
  }
  return 1;
}

export function getExplanation(
  isAlien: boolean,
  decision: Decision,
  clues: { description: string }[],
): string {
  const correct =
    (isAlien && decision === "flag") || (!isAlien && decision === "hire");

  if (correct && isAlien) {
    return "Correct! This was an alien applicant.";
  }
  if (correct && !isAlien) {
    return "Correct! This was a genuine human applicant.";
  }
  if (!correct && isAlien) {
    return "Missed one! This was an alien. Check the tells below.";
  }
  return "False alarm! This was a real human candidate. Be more careful with your flagging.";
}

export function getAccuracyThreshold(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 0.5;
    case "medium":
      return 0.6;
    case "hard":
      return 0.7;
  }
}

export function calculateRating(
  accuracy: number,
  hasFalseNegatives: boolean,
): Rating {
  if (accuracy >= 0.95 && !hasFalseNegatives) return "S";
  if (accuracy >= 0.85) return "A";
  if (accuracy >= 0.7) return "B";
  if (accuracy >= 0.5) return "C";
  return "F";
}
