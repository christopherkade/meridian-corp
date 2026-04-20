// Game state store using Zustand

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Resume,
  ResumeResult,
  Decision,
  SuspicionLevel,
  GameScreen,
  CareerStats,
  CaseResult,
  Rating,
  Difficulty,
  RunRecord,
} from "./types";
import { generateCase } from "./resume-generator";
import {
  calculateScore,
  getExplanation,
  calculateRating,
  getAccuracyThreshold,
} from "./scoring";

interface GameState {
  // Navigation
  screen: GameScreen;

  // Difficulty
  difficulty: Difficulty | null;

  // Current case
  caseNumber: number;
  resumes: Resume[];
  currentResumeIndex: number;
  caseResults: ResumeResult[];

  // Suspicion meter
  suspicionLevel: SuspicionLevel;

  // Feedback (after decision)
  lastResult: ResumeResult | null;

  // Case end
  lastCaseResult: CaseResult | null;

  // Career stats (persisted)
  career: CareerStats;

  // Run timer (only counts time on game screen)
  runActiveMs: number;
  _gameEnteredAt: number | null;

  // UI visibility toggles
  showSuspicionMeter: boolean;
  showHourglassAnimation: boolean;
  soundEnabled: boolean;

  // Player identity (persisted)
  playerName: string;

  // Run history (persisted)
  runHistory: RunRecord[];

  // Score submission tracking
  scoreSubmitted: boolean;

  // Watercooler (shown at start of each case)
  showWatercooler: boolean;

  // Actions
  startNewCase: () => void;
  startRun: (difficulty: Difficulty) => void;
  makeDecision: (decision: Decision) => void;
  advanceResume: () => void;
  setSuspicionLevel: (level: SuspicionLevel) => void;
  setScreen: (screen: GameScreen) => void;
  setPlayerName: (name: string) => void;
  toggleSuspicionMeter: () => void;
  toggleHourglassAnimation: () => void;
  toggleSound: () => void;
  timerExpired: () => void;
  dismissWatercooler: () => void;
  resetRun: () => void;
  resetAllProgress: () => void;
  markScoreSubmitted: () => void;
}

const initialCareer: CareerStats = {
  totalResumesProcessed: 0,
  alienDetectionRate: 0,
  falsePositiveRate: 0,
  currentCaseStreak: 0,
  totalScore: 0,
  casesCompleted: [],
  runElapsedMs: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "menu",
      difficulty: null,
      caseNumber: 0,
      resumes: [],
      currentResumeIndex: 0,
      caseResults: [],
      suspicionLevel: "unclear",
      lastResult: null,
      lastCaseResult: null,
      career: { ...initialCareer },
      runActiveMs: 0,
      _gameEnteredAt: null,
      showSuspicionMeter: false,
      showHourglassAnimation: true,
      soundEnabled: true,
      playerName: "",
      runHistory: [],
      scoreSubmitted: false,
      showWatercooler: false,

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
          caseNumber: nextCase,
          resumes,
          currentResumeIndex: 0,
          caseResults: [],
          suspicionLevel: "unclear",
          lastResult: null,
          lastCaseResult: null,
          showWatercooler: true,
        });
      },

      startRun: (difficulty: Difficulty) => {
        const resumes = generateCase(1);
        set({
          difficulty,
          screen: "game",
          caseNumber: 1,
          resumes,
          currentResumeIndex: 0,
          caseResults: [],
          suspicionLevel: "unclear",
          lastResult: null,
          lastCaseResult: null,
          career: { ...initialCareer },
          runActiveMs: 0,
          showWatercooler: false,
          _gameEnteredAt: Date.now(),
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
          resume.clues,
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
        const activeMs = state._gameEnteredAt
          ? state.runActiveMs + (Date.now() - state._gameEnteredAt)
          : state.runActiveMs;

        set({
          lastResult: result,
          caseResults: newResults,
          suspicionLevel: "unclear",
          runActiveMs: activeMs,
          _gameEnteredAt: null,
        });
      },

      advanceResume: () => {
        const state = get();
        const nextIndex = state.currentResumeIndex + 1;

        if (nextIndex >= state.resumes.length) {
          // Case complete - calculate case results
          const results = state.caseResults;
          const correctCount = results.filter((r) => r.correct).length;
          const accuracy = correctCount / results.length;
          const hasFalseNegatives = results.some(
            (r) => !r.correct && r.decision === "hire",
          );
          const totalScore = results.reduce(
            (sum, r) => sum + r.pointsEarned,
            0,
          );
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
          career.runElapsedMs = state.runActiveMs;

          // Calculate aggregate detection rates
          const allResults = career.casesCompleted.flatMap((c) => c.results);
          const alienResumes = allResults.filter((r) => {
            const resume = state.resumes.find((res) => res.id === r.resumeId);
            return resume?.isAlien;
          });
          // For detection rate we look at all correct flags
          const totalFlags = allResults.filter((r) => r.decision === "flag");
          const correctFlags = totalFlags.filter((r) => r.correct);
          const incorrectFlags = totalFlags.filter((r) => !r.correct);

          if (alienResumes.length > 0) {
            career.alienDetectionRate =
              correctFlags.length / Math.max(alienResumes.length, 1);
          }
          if (totalFlags.length > 0) {
            career.falsePositiveRate =
              incorrectFlags.length / totalFlags.length;
          }

          const threshold = getAccuracyThreshold(state.difficulty!);
          if (accuracy >= threshold) {
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
            currentResumeIndex: nextIndex,
            lastResult: null,
            _gameEnteredAt: Date.now(),
          });
        }
      },

      dismissWatercooler: () => {
        set({
          showWatercooler: false,
          screen: "game",
          _gameEnteredAt: Date.now(),
        });
      },

      setSuspicionLevel: (level: SuspicionLevel) => {
        set({ suspicionLevel: level });
      },

      setScreen: (screen: GameScreen) => {
        set({ screen });
      },

      setPlayerName: (name: string) => {
        set({ playerName: name.slice(0, 20) });
      },

      toggleSuspicionMeter: () => {
        set((state) => ({ showSuspicionMeter: !state.showSuspicionMeter }));
      },

      toggleHourglassAnimation: () => {
        set((state) => ({
          showHourglassAnimation: !state.showHourglassAnimation,
        }));
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      timerExpired: () => {
        const state = get();
        const resume = state.resumes[state.currentResumeIndex];
        if (!resume) return;

        const explanation =
          "⏰ Time ran out! The resume was not reviewed in time. At Meridian Corp, we value efficiency. Please try to make your decisions faster to avoid penalties.";
        const result: ResumeResult = {
          resumeId: resume.id,
          decision: "hire",
          correct: false,
          pointsEarned: -200,
          explanation,
          clues: resume.clues,
        };

        const newResults = [...state.caseResults, result];

        const activeMs = state._gameEnteredAt
          ? state.runActiveMs + (Date.now() - state._gameEnteredAt)
          : state.runActiveMs;

        set({
          lastResult: result,
          caseResults: newResults,
          suspicionLevel: "unclear",
          runActiveMs: activeMs,
          _gameEnteredAt: null,
        });

        // Advance to next resume or case-end
        get().advanceResume();
      },

      resetRun: () => {
        const state = get();
        // Archive the completed run into history
        if (state.difficulty && state.career.casesCompleted.length > 0) {
          const record: RunRecord = {
            id: Date.now(),
            difficulty: state.difficulty,
            career: { ...state.career },
            completedAt: new Date().toISOString(),
          };
          set({ runHistory: [...state.runHistory, record] });
        }
        set({
          screen: "menu",
          difficulty: null,
          caseNumber: 0,
          resumes: [],
          currentResumeIndex: 0,
          caseResults: [],
          suspicionLevel: "unclear",
          lastResult: null,
          lastCaseResult: null,
          career: { ...initialCareer },
          runActiveMs: 0,
          _gameEnteredAt: null,
          showSuspicionMeter: false,
          scoreSubmitted: false,
          showWatercooler: false,
        });
      },

      resetAllProgress: () => {
        set({
          screen: "menu",
          difficulty: null,
          caseNumber: 0,
          resumes: [],
          currentResumeIndex: 0,
          caseResults: [],
          suspicionLevel: "unclear",
          lastResult: null,
          lastCaseResult: null,
          career: { ...initialCareer },
          runActiveMs: 0,
          _gameEnteredAt: null,
          showSuspicionMeter: false,
          scoreSubmitted: false,
          runHistory: [],
          playerName: "",
          showWatercooler: false,
        });
      },

      markScoreSubmitted: () => {
        set({ scoreSubmitted: true });
      },
    }),
    {
      name: "meridian-corp-game",
      partialize: (state) => ({
        runHistory: state.runHistory,
        playerName: state.playerName,
      }),
    },
  ),
);
