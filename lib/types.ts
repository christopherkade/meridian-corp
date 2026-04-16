// Core types for the Meridian Corp game

export type Tier = 1 | 2 | 3 | 4 | 5;

export type ClueCategory = "A" | "B" | "C" | "D" | "E";

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  startYear: number;
  endYear: number | "Present";
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
}

export interface ResumeData {
  contact: ContactInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  interests: string[];
}

export interface ClueInfo {
  category: ClueCategory;
  section: string;
  description: string;
}

export interface Resume {
  id: string;
  isAlien: boolean;
  tier: Tier;
  data: ResumeData;
  clues: ClueInfo[];
  redHerrings: string[];
}

export type Decision = "hire" | "flag";

export interface ResumeResult {
  resumeId: string;
  decision: Decision;
  correct: boolean;
  pointsEarned: number;
  explanation: string;
  clues: ClueInfo[];
}

export type SuspicionLevel =
  | "definitely-human"
  | "probably-human"
  | "unclear"
  | "probably-alien"
  | "definitely-alien";

export type Rating = "S" | "A" | "B" | "C" | "F";

export interface CaseResult {
  caseNumber: number;
  results: ResumeResult[];
  totalScore: number;
  accuracy: number;
  rating: Rating;
}

export interface CareerStats {
  totalResumesProcessed: number;
  alienDetectionRate: number;
  falsePositiveRate: number;
  currentCaseStreak: number;
  totalScore: number;
  casesCompleted: CaseResult[];
  runElapsedMs: number | null;
}

export interface RunRecord {
  id: number;
  difficulty: Difficulty;
  career: CareerStats;
  strikes: number;
  maxStrikes: number;
  completedAt: string; // ISO timestamp
}

export type GameScreen =
  | "menu"
  | "difficulty"
  | "game"
  | "feedback"
  | "case-end"
  | "dashboard"
  | "game-over"
  | "leaderboard";

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    maxStrikes: number;
    timerSeconds: number;
    label: string;
    description: string;
  }
> = {
  easy: {
    maxStrikes: 10,
    timerSeconds: 15,
    label: "Easy",
    description: "10 strikes · 15s per resume",
  },
  medium: {
    maxStrikes: 5,
    timerSeconds: 10,
    label: "Medium",
    description: "5 strikes · 10s per resume",
  },
  hard: {
    maxStrikes: 3,
    timerSeconds: 5,
    label: "Hard",
    description: "3 strikes · 5s per resume",
  },
};
