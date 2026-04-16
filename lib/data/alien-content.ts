// Alien tell content pools organized by clue category and tier
// Category A: Identity Tells (Tiers 1-2)
// Category B: Career Tells (Tiers 1-3)
// Category C: Education Tells (Tiers 2-4)
// Category D: Skill & Language Tells (Tiers 3-5)
// Category E: Soft Tells (Tiers 4-5)

import { ClueCategory } from "../types";

export interface AlienClue {
  category: ClueCategory;
  section: string;
  description: string;
  apply: (data: AlienClueApplication) => AlienClueApplication;
}

export interface AlienClueApplication {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  company?: string;
  bullets?: string[];
  degree?: string;
  institution?: string;
  graduationYear?: number;
  skills?: string[];
  interests?: string[];
}

// ============ CATEGORY A - Identity Tells ============

export const categoryAClues: AlienClue[] = [
  {
    category: "A",
    section: "contact",
    description: "Suspicious name",
    apply: (d) => ({ ...d, name: generateAlienName() }),
  },
  {
    category: "A",
    section: "contact",
    description: "Email uses non-existent TLD",
    apply: (d) => ({
      ...d,
      email: pickRandom(alienEmails),
    }),
  },
  {
    category: "A",
    section: "contact",
    description: "Phone number has wrong digit count",
    apply: (d) => ({ ...d, phone: pickRandom(alienPhones) }),
  },
  {
    category: "A",
    section: "contact",
    description: "Location is a planet or star system",
    apply: (d) => ({ ...d, location: pickRandom(alienLocations) }),
  },
];

// ============ CATEGORY A2 - Early Skills/Interests Tells ============

export const categoryA2Clues: AlienClue[] = [
  {
    category: "A",
    section: "skills",
    description: "Oddly basic human skill listed",
    apply: (d) => ({
      ...d,
      skills: [...(d.skills || []), pickRandom(earlyConfusedSkills)],
    }),
  },
  {
    category: "A",
    section: "interests",
    description: "Interest implies unfamiliarity with Earth",
    apply: (d) => ({
      ...d,
      interests: [...(d.interests || []), pickRandom(earlyAlienInterests)],
    }),
  },
];

// ============ CATEGORY B - Career Tells ============

export const categoryBClues: AlienClue[] = [
  {
    category: "B",
    section: "experience",
    description: "Job title is not a real role",
    apply: (d) => ({ ...d, jobTitle: pickRandom(alienJobTitles) }),
  },
  {
    category: "B",
    section: "experience",
    description: "Employer is subtly wrong",
    apply: (d) => ({ ...d, company: pickRandom(alienCompanies) }),
  },
  {
    category: "B",
    section: "experience",
    description: "Job description implies alien observation",
    apply: (d) => ({
      ...d,
      bullets: [pickRandom(alienBullets), ...(d.bullets || [])],
    }),
  },
];

// ============ CATEGORY C - Education Tells ============

export const categoryCClues: AlienClue[] = [
  {
    category: "C",
    section: "education",
    description: "Degree from fictional university",
    apply: (d) => ({ ...d, institution: pickRandom(alienUniversities) }),
  },
  {
    category: "C",
    section: "education",
    description: "Suspicious degree subject",
    apply: (d) => ({ ...d, degree: pickRandom(alienDegrees) }),
  },
];

// ============ CATEGORY D - Skill & Language Tells ============

export const categoryDClues: AlienClue[] = [
  {
    category: "D",
    section: "skills",
    description: "Non-human language proficiency",
    apply: (d) => ({
      ...d,
      skills: [...(d.skills || []), pickRandom(alienLanguages)],
    }),
  },
  {
    category: "D",
    section: "skills",
    description: "Alien technical skill listed",
    apply: (d) => ({
      ...d,
      skills: [...(d.skills || []), pickRandom(alienSkills)],
    }),
  },
  {
    category: "D",
    section: "skills",
    description: "Skills imply confusion about human work",
    apply: (d) => ({
      ...d,
      skills: [...(d.skills || []), pickRandom(confusedSkills)],
    }),
  },
];

// ============ CATEGORY E - Soft Tells ============

export const categoryEClues: AlienClue[] = [
  {
    category: "E",
    section: "interests",
    description: "Subtle alien tell in interests",
    apply: (d) => ({
      ...d,
      interests: [...(d.interests || []), pickRandom(alienInterests)],
    }),
  },
  {
    category: "E",
    section: "skills",
    description: 'Odd use of the word "local"',
    apply: (d) => ({
      ...d,
      skills: [...(d.skills || []), pickRandom(oddLocalSkills)],
    }),
  },
];

// ============ DATA POOLS ============

const alienFirstNames = [
  "Glorp",
  "Zxq-47",
  "Blarvek",
  "Kreelix",
  "Zorb",
  "Thraxian",
  "Qweenth",
  "Greetok",
  "Xylph",
  "Bleep",
];

const alienLastNames = [
  "Xanthium",
  "Tnok",
  "Glorb",
  "Farblox",
  "Zorgon",
  "Monder",
  "Vexlis",
  "Dranthu",
  "Krellax",
  "Plinth",
];

const humanFirstNames = [
  "Sarah",
  "James",
  "Maria",
  "David",
  "Emily",
  "Michael",
  "Lisa",
  "Robert",
  "Jennifer",
  "Andrew",
];

const humanLastNames = [
  "Mitchell",
  "Chen",
  "Rodriguez",
  "Kim",
  "Thompson",
  "O'Brien",
  "Patel",
  "Johnson",
  "Wu",
  "Martinez",
];

function generateAlienName(): string {
  if (Math.random() > 0.5) {
    return `${pickRandom(humanFirstNames)} ${pickRandom(alienLastNames)}`;
  }
  return `${pickRandom(alienFirstNames)} ${pickRandom(humanLastNames)}`;
}

const alienEmails = [
  "glorpx@proxima.sol",
  "zxq47@andromeda.gal",
  "contact@kepler.sys",
  "hr.ready@betelgeuse.star",
  "apply@centauri.net.gx",
];

const alienPhones = [
  "555-0123-4567-8901",
  "12-34",
  "0x3F7A-00B2",
  "+999 000 0000 0000 0",
  "7",
];

const alienLocations = [
  "Proxima Centauri b",
  "Kepler-442b",
  "Sector 7G, Andromeda",
  "Betelgeuse Orbital Station",
  "Mars Colony 12",
  "Gliese 667Cc",
  "Trappist-1e",
];

const alienJobTitles = [
  "Senior Oxygen Analyst",
  "Lead Human Observer",
  "Coordinator of Mammalian Activities",
  "Junior Atmosphere Sampler",
  "Chief Bipedal Locomotion Researcher",
  "Terran Integration Specialist",
  "Gravity Adjustment Technician",
  "Planetary Infiltration Associate",
];

const alienCompanies = [
  "Galactic Resources Inc.",
  "Earth Branch Office - TBD",
  "Xelnar Consolidated",
  "Human-Observing Solutions Ltd.",
  "Proxima Ventures Earth Division",
  "Terran Assessment Bureau",
];

const alienBullets = [
  "Monitored human procurement patterns across regional sectors",
  "Documented bipedal locomotion efficiency in urban environments",
  "Facilitated nutrient distribution among carbon-based personnel",
  "Oversaw atmospheric composition compliance for visiting delegates",
  "Catalogued human emotional response patterns during fiscal quarters",
  "Maintained disguise coherence across multiple social interactions",
  "Ensured gravitational adaptation protocols were followed by team",
];

const alienUniversities = [
  "University of Northern Proxima",
  "Galactic Institute of Applied Biology",
  "Centauri Academy of Terran Studies",
  "Kepler School of Business",
  "Betelgeuse Community College",
  "Andromeda State University",
];

const alienDegrees = [
  "B.Sc. in Human Behavioral Analysis",
  "Masters of Carbon-Based Lifeform Studies",
  "Ph.D. in Terrestrial Adaptation Sciences",
  "B.A. in Atmospheric Composition",
  "M.S. in Gravity-Dependent Biology",
];

const alienLanguages = [
  "Fluent in Kzinti",
  "Conversational Grblchk",
  "Native Xylophan",
  "Intermediate Thraxese",
  "Basic Zenthari Dialect",
];

const alienSkills = [
  "Xenoform data parsing",
  "Atmospheric recombination",
  "Interstellar navigation (basic)",
  "Quantum field manipulation",
  "Mass memory suppression",
  "Undetected movement",
];

const confusedSkills = [
  "Breathing (Advanced)",
  "Bipedal walking (Proficient)",
  "Consuming Earth food (Intermediate)",
  "Blinking at normal intervals",
  "Maintaining body temperature (Expert)",
];

const alienInterests = [
  "cataloguing human social rituals",
  "studying local gravitational variations",
  "collecting soil samples from various continents",
  "observing mammalian bonding ceremonies",
  "documenting water-based precipitation events",
];

const oddLocalSkills = [
  "Adapted to local gravity",
  "Familiar with local sun cycles",
  "Local atmospheric tolerance",
];

const earlyConfusedSkills = [
  "Handshaking (Certified)",
  "Sitting in chairs (Proficient)",
  "Using door handles",
  "Verbal greeting protocols",
  "Maintaining eye contact (Intermediate)",
  "Water drinking (Advanced)",
];

const earlyAlienInterests = [
  "learning about human holidays",
  "exploring the concept of weekends",
  "understanding currency exchange",
  "trying different Earth beverages",
  "researching domestic pet ownership",
  "adjusting to seasonal weather patterns",
];

// ============ UTILITY ============

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getCluesForTier(tier: number): AlienClue[] {
  const available: AlienClue[] = [];
  if (tier >= 1)
    available.push(...categoryAClues, ...categoryA2Clues, ...categoryBClues);
  if (tier >= 2) available.push(...categoryCClues);
  if (tier >= 3) available.push(...categoryDClues);
  if (tier >= 4) available.push(...categoryEClues);
  return available;
}
