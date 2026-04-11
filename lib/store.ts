// Game state store using Zustand

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Resume, ResumeResult, Decision, SuspicionLevel,
  GameScreen, CareerStats, CaseResult, Rating, Difficulty, DIFFICULTY_CONFIG,
} from "./types";
import { generateCase } from "./resume-generator";
import { calculateScore, getExplanation, calculateRating } from "./scoring";

interface GameState {
  // Navigation
  screen: GameScreen;

  // Difficulty & strikes
  difficulty: Difficulty | null;
  strikes: number;

  // Current case
  caseNumber: number;
  resumes: Resume[];
  currentResumeIndex: number;
  caseResults: ResumeResult[];

  // Suspicion meter
  suspicionLevel: SuspicionLevel;

  // Notes (per resume ID)
  notes: Record<string, string>;

  // Feedback (after decision)
  lastResult: ResumeResult | null;

  // Case end
  lastCaseResult: CaseResult | null;

  // Career stats (persisted)
  career: CareerStats;

  // UI visibility toggles
  showSuspicionMeter: boolean;
  showNotepad: boolean;

  // Actions
  startNewCase: () => void;
  startRun: (difficulty: Difficulty) => void;
  makeDecision: (decision: Decision) => void;
  nextResume: () => void;
  setSuspicionLevel: (level: SuspicionLevel) => void;
  setNote: (resumeId: string, note: string) => void;
  setScreen: (screen: GameScreen) => void;
  toggleSuspicionMeter: () => void;
  toggleNotepad: () => void;
  resetGame: () => void;
}

const initialCareer: CareerStats = {
  totalResumesProcessed: 0,
  alienDetectionRate: 0,
  falsePositiveRate: 0,
  currentCaseStreak: 0,
  totalScore: 0,
  casesCompleted: [],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "menu",
      difficulty: null,
      strikes: 0,
      caseNumber: 0,
      resumes: [],
      currentResumeIndex: 0,
      caseResults: [],
      suspicionLevel: "unclear",
      notes: {},
      lastResult: null,
      lastCaseResult: null,
      career: { ...initialCareer },
      showSuspicionMeter: true,
      showNotepad: true,

      startNewCase: () => {
        const state = get();
        // If no difficulty set (new run), go to difficulty selection
        if (!state.difficulty) {
          set({ screen: "difficulty" });
          return;
        }
        const nextCase = state.career.casesCompleted.length + 1;
        const resumes = generateCase(nextCase);
        set({
          screen: "game",
          caseNumber: nextCase,
          resumes,
          currentResumeIndex: 0,
          caseResults: [],
          suspicionLevel: "unclear",
          lastResult: null,
          lastCaseResult: null,
        });
      },

      startRun: (difficulty: Difficulty) => {
        const resumes = generateCase(1);
        set({
          difficulty,
          strikes: 0,
          screen: "game",
          caseNumber: 1,
          resumes,
          currentResumeIndex: 0,
          caseResults: [],
          suspicionLevel: "unclear",
          lastResult: null,
          lastCaseResult: null,
          career: { ...initialCareer },
          notes: {},
        });
      },

      makeDecision: (decision: Decision) => {
        const state = get();
        const resume = state.resumes[state.currentResumeIndex];
        if (!resume) return;

        const isCorrect =
          (resume.isAlien && decision === "flag") ||
          (!resume.isAlien && decision === "hire");

        const points = calculateScore({
          isAlien: resume.isAlien,
          decision,
          tier: resume.tier,
          suspicionLevel: state.suspicionLevel,
        });

        const explanation = getExplanation(
          resume.isAlien,
          decision,
          resume.clues
        );

        const result: ResumeResult = {
          resumeId: resume.id,
          decision,
          correct: isCorrect,
          pointsEarned: points,
          explanation,
          clues: resume.clues,
        };

        const newResults = [...state.caseResults, result];
        const newStrikes = isCorrect ? state.strikes : state.strikes + 1;

        // Check if strikes hit the limit
        const maxStrikes = state.difficulty ? DIFFICULTY_CONFIG[state.difficulty].maxStrikes : Infinity;
        if (newStrikes >= maxStrikes) {
          set({
            screen: "game-over",
            lastResult: result,
            caseResults: newResults,
            strikes: newStrikes,
            suspicionLevel: "unclear",
          });
          return;
        }

        set({
          screen: "feedback",
          lastResult: result,
          caseResults: newResults,
          strikes: newStrikes,
          suspicionLevel: "unclear",
        });
      },

      nextResume: () => {
        const state = get();
        const nextIndex = state.currentResumeIndex + 1;

        if (nextIndex >= state.resumes.length) {
          // Case complete — calculate case results
          const results = state.caseResults;
          const correctCount = results.filter((r) => r.correct).length;
          const accuracy = correctCount / results.length;
          const hasFalseNegatives = results.some(
            (r) => !r.correct && r.decision === "hire"
          );
          const totalScore = results.reduce((sum, r) => sum + r.pointsEarned, 0);
          const rating: Rating = calculateRating(accuracy, hasFalseNegatives);

          const caseResult: CaseResult = {
            caseNumber: state.caseNumber,
            results,
            totalScore,
            accuracy,
            rating,
          };

          // Update career stats
          const career = { ...state.career };
          career.totalResumesProcessed += results.length;
          career.totalScore += totalScore;
          career.casesCompleted = [...career.casesCompleted, caseResult];

          // Calculate aggregate detection rates
          const allResults = career.casesCompleted.flatMap((c) => c.results);
          const alienResumes = allResults.filter((r) => {
            const resume = state.resumes.find(
              (res) => res.id === r.resumeId
            );
            return resume?.isAlien;
          });
          // For detection rate we look at all correct flags
          const totalFlags = allResults.filter((r) => r.decision === "flag");
          const correctFlags = totalFlags.filter((r) => r.correct);
          const incorrectFlags = totalFlags.filter((r) => !r.correct);

          if (alienResumes.length > 0) {
            career.alienDetectionRate = correctFlags.length / Math.max(alienResumes.length, 1);
          }
          if (totalFlags.length > 0) {
            career.falsePositiveRate = incorrectFlags.length / totalFlags.length;
          }

          if (accuracy >= 0.7) {
            career.currentCaseStreak += 1;
          } else {
            career.currentCaseStreak = 0;
          }

          set({
            screen: "case-end",
            lastCaseResult: caseResult,
            career,
          });
        } else {
          set({
            screen: "game",
            currentResumeIndex: nextIndex,
            lastResult: null,
          });
        }
      },

      setSuspicionLevel: (level: SuspicionLevel) => {
        set({ suspicionLevel: level });
      },

      setNote: (resumeId: string, note: string) => {
        set((state) => ({
          notes: { ...state.notes, [resumeId]: note },
        }));
      },

      setScreen: (screen: GameScreen) => {
        set({ screen });
      },

      toggleSuspicionMeter: () => {
        set((state) => ({ showSuspicionMeter: !state.showSuspicionMeter }));
      },

      toggleNotepad: () => {
        set((state) => ({ showNotepad: !state.showNotepad }));
      },

      resetGame: () => {
        set({
          screen: "menu",
          difficulty: null,
          strikes: 0,
          caseNumber: 0,
          resumes: [],
          currentResumeIndex: 0,
          caseResults: [],
          suspicionLevel: "unclear",
          notes: {},
          lastResult: null,
          lastCaseResult: null,
          career: { ...initialCareer },
          showSuspicionMeter: true,
          showNotepad: true,
        });
      },
    }),
    {
      name: "meridian-corp-game",
      partialize: (state) => ({
        career: state.career,
        notes: state.notes,
        difficulty: state.difficulty,
        strikes: state.strikes,
      }),
    }
  )
);
