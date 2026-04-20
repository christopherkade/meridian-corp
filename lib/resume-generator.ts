// Resume generation engine
// Assembles resumes from content pools based on tier and alien/human status

import {
  Resume,
  ResumeData,
  ClueInfo,
  Tier,
  ContactInfo,
  WorkExperience,
  Education,
} from "./types";
import {
  humanNames,
  humanEmails,
  humanLocations,
  humanJobTitles,
  humanCompanies,
  humanBullets,
  humanDegrees,
  humanUniversities,
  humanSkills,
  humanInterests,
  humanLanguages,
} from "./data/human-content";
import { getCluesForTier, AlienClue } from "./data/alien-content";

let resumeCounter = 0;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

function generatePhone(): string {
  const area = Math.floor(Math.random() * 900) + 100;
  const mid = Math.floor(Math.random() * 900) + 100;
  const end = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${mid}-${end}`;
}

function generateEmail(name: string): string {
  // Strip any nickname in quotes for email generation
  const cleanName = name.replace(/\s*"[^"]*"\s*/g, " ").trim();
  const parts = cleanName.toLowerCase().split(" ");
  const domain = pickRandom(humanEmails);
  return `${parts[0]}.${parts[parts.length - 1]}@${domain}`;
}

const humanNicknames = [
  "The Rock",
  "Ace",
  "Sparky",
  "The Machine",
  "Big Red",
  "Tiny",
  "Champ",
  "Flash",
  "Doc",
  "The Professor",
  "Hawk",
  "Slim",
  "Tank",
  "Zippy",
  "Turbo",
  "Chief",
  "Wheels",
  "Maverick",
  "Blaze",
  "Frosty",
  "Knuckles",
  "T-Bone",
  "Radar",
  "Skippy",
  "Pickles",
  "Wombat",
  "The Hammer",
  "Sunshine",
  "Noodles",
  "Boss",
];

function generateHumanContact(): ContactInfo {
  let name = pickRandom(humanNames);
  // ~10% chance to add a nickname
  if (Math.random() < 0.1) {
    const parts = name.split(" ");
    const nickname = pickRandom(humanNicknames);
    name = `${parts[0]} "${nickname}" ${parts.slice(1).join(" ")}`;
  }
  return {
    name,
    email: generateEmail(name),
    phone: generatePhone(),
    location: pickRandom(humanLocations),
  };
}

function generateHumanExperience(count: number): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  let year = 2024;
  for (let i = 0; i < count; i++) {
    const duration = Math.floor(Math.random() * 4) + 1;
    const endYear = i === 0 ? ("Present" as const) : year;
    const startYear = (typeof endYear === "number" ? endYear : 2024) - duration;
    experiences.push({
      title: pickRandom(humanJobTitles),
      company: pickRandom(humanCompanies),
      startYear,
      endYear,
      bullets: pickRandomN(humanBullets, Math.floor(Math.random() * 2) + 2),
    });
    year = startYear - 1;
  }
  return experiences;
}

function generateHumanEducation(): Education[] {
  const gradYear = Math.floor(Math.random() * 10) + 2010;
  return [
    {
      degree: pickRandom(humanDegrees),
      institution: pickRandom(humanUniversities),
      graduationYear: gradYear,
    },
  ];
}

function generateHumanSkills(): string[] {
  const skills = pickRandomN(humanSkills, Math.floor(Math.random() * 3) + 4);
  const lang = pickRandom(humanLanguages);
  return [...skills, lang];
}

function generateHumanInterests(): string[] {
  return pickRandomN(humanInterests, Math.floor(Math.random() * 2) + 3);
}

function generateBaseResume(): ResumeData {
  return {
    contact: generateHumanContact(),
    experience: generateHumanExperience(Math.floor(Math.random() * 2) + 2),
    education: generateHumanEducation(),
    skills: generateHumanSkills(),
    interests: generateHumanInterests(),
  };
}

// Red herrings - suspicious-sounding but human-normal content
const redHerringContent = [
  "competitive cheese rolling",
  "amateur UFO photography",
  "collecting vintage conspiracy theory magazines",
  "speaking Esperanto",
  "taxidermy enthusiast",
  "worked at a company named 'Alien Gear Holsters'",
  "degree in Astrobiology",
  "hobby: rocket building",
];

function getTellCountForTier(tier: Tier): number {
  switch (tier) {
    case 1:
      return Math.floor(Math.random() * 3) + 3; // 3-5
    case 2:
      return Math.floor(Math.random() * 3) + 2; // 2-4
    case 3:
      return Math.floor(Math.random() * 2) + 2; // 2-3
    case 4:
      return Math.floor(Math.random() * 2) + 1; // 1-2
    case 5:
      return 1; // 1
  }
}

function getRedHerringCountForTier(tier: Tier): number {
  switch (tier) {
    case 1:
      return 0;
    case 2:
      return 0;
    case 3:
      return Math.floor(Math.random() * 2); // 0-1
    case 4:
      return Math.floor(Math.random() * 2) + 1; // 1-2
    case 5:
      return Math.floor(Math.random() * 2) + 2; // 2-3
  }
}

export function generateResume(isAlien: boolean, tier: Tier): Resume {
  resumeCounter++;
  const data = generateBaseResume();
  const clues: ClueInfo[] = [];
  const redHerrings: string[] = [];

  if (isAlien) {
    const availableClues = getCluesForTier(tier);
    const tellCount = getTellCountForTier(tier);
    const selectedClues = pickRandomN(availableClues, tellCount);

    // Apply alien clues to the resume data
    for (const clue of selectedClues) {
      const result = clue.apply({});

      // Apply mutations
      if (result.name) data.contact.name = result.name;
      if (result.email) data.contact.email = result.email;
      if (result.phone) data.contact.phone = result.phone;
      if (result.location) data.contact.location = result.location;
      if (result.jobTitle && data.experience[0]) {
        data.experience[0].title = result.jobTitle;
      }
      if (result.company && data.experience[0]) {
        data.experience[0].company = result.company;
      }
      if (result.bullets && data.experience[0]) {
        data.experience[0].bullets = [
          ...result.bullets,
          ...data.experience[0].bullets.slice(0, 2),
        ];
      }
      if (result.degree && data.education[0]) {
        data.education[0].degree = result.degree;
      }
      if (result.institution && data.education[0]) {
        data.education[0].institution = result.institution;
      }
      if (result.skills) {
        data.skills = [...data.skills, ...result.skills];
      }
      if (result.interests) {
        data.interests = [...data.interests, ...result.interests];
      }

      clues.push({
        category: clue.category,
        section: clue.section,
        description: clue.description,
      });
    }
  }

  // Add red herrings (to both alien and human resumes at higher tiers)
  const rhCount = getRedHerringCountForTier(tier);
  const rhs = pickRandomN(redHerringContent, rhCount);
  for (const rh of rhs) {
    data.interests.push(rh);
    redHerrings.push(rh);
  }

  return {
    id: `resume-${resumeCounter}`,
    isAlien,
    tier,
    data,
    clues,
    redHerrings,
  };
}

export function generateCase(caseNumber: number): Resume[] {
  const { tier, resumeCount } = getCaseConfig(caseNumber);
  const alienCount = Math.floor(resumeCount * (0.4 + Math.random() * 0.2));
  const humanCount = resumeCount - alienCount;

  const resumes: Resume[] = [];

  for (let i = 0; i < alienCount; i++) {
    resumes.push(generateResume(true, tier));
  }
  for (let i = 0; i < humanCount; i++) {
    resumes.push(generateResume(false, tier));
  }

  // Shuffle
  return resumes.sort(() => Math.random() - 0.5);
}

interface CaseConfig {
  tier: Tier;
  resumeCount: number;
}

function getCaseConfig(caseNumber: number): CaseConfig {
  if (caseNumber <= 1) return { tier: 1, resumeCount: 8 };
  if (caseNumber <= 2) return { tier: 2, resumeCount: 8 };
  if (caseNumber <= 3) return { tier: 3, resumeCount: 10 };
  if (caseNumber <= 4) return { tier: 4, resumeCount: 10 };
  // Case 5+: all categories, gradually more resumes
  const resumeCount = Math.min(15, 10 + Math.floor((caseNumber - 4) / 2));
  return { tier: 5 as Tier, resumeCount };
}
