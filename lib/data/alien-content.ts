// Alien tell content pools organized by clue category and case progression
// Case 1 (Tier 1): Category A — Contact/identity tells
// Case 2 (Tier 2): + Category B — Career/experience tells
// Case 3 (Tier 3): + Interests & hobbies (A2 interests, E interests)
// Case 4 (Tier 4): + Skills (A2 skills, D, E skills)
// Case 5+ (Tier 5): + Category C — Education tells (all categories)

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
  // Obvious (early cases)
  "Senior Oxygen Analyst",
  "Lead Human Observer",
  "Coordinator of Mammalian Activities",
  "Junior Atmosphere Sampler",
  "Chief Bipedal Locomotion Researcher",
  "Planetary Infiltration Associate",
  // Subtle (later cases - sound almost corporate)
  "Environmental Adaptation Coordinator",
  "Cross-Cultural Integration Lead",
  "Regional Compliance Observer",
  "Population Analytics Specialist",
  "Behavioral Norms Consultant",
  "Terrestrial Operations Analyst",
];

const alienCompanies = [
  // Obvious
  "Galactic Resources Inc.",
  "Earth Branch Office - TBD",
  "Xelnar Consolidated",
  "Human-Observing Solutions Ltd.",
  // Subtle - sound almost real
  "Terranova Consulting Group",
  "Blue Planet Staffing Solutions",
  "Heliocentric Partners LLC",
  "New Horizon Integration Services",
  "Atmosphere One Global",
];

const alienBullets = [
  // Obvious
  "Monitored human procurement patterns across regional sectors",
  "Documented bipedal locomotion efficiency in urban environments",
  "Facilitated nutrient distribution among carbon-based personnel",
  "Oversaw atmospheric composition compliance for visiting delegates",
  "Maintained disguise coherence across multiple social interactions",
  "Ensured gravitational adaptation protocols were followed by team",
  // Subtle - almost normal corporate speak
  "Conducted ongoing field observation of workplace social dynamics",
  "Developed frameworks for understanding local team bonding rituals",
  "Coordinated orientation sessions for newly relocated personnel",
  "Assisted with acclimation procedures for staff from diverse backgrounds",
  "Reported on daily behavioral patterns to regional oversight committee",
  "Catalogued emotional response patterns during fiscal quarters",
];

const alienUniversities = [
  // Obvious
  "University of Northern Proxima",
  "Galactic Institute of Applied Biology",
  "Centauri Academy of Terran Studies",
  "Kepler School of Business",
  "Betelgeuse Community College",
  "Andromeda State University",
  // Subtle - sound like real places with a slight twist
  "Northfield University of Applied Sciences",
  "Pacific Institute of Integrative Studies",
  "Lakeview College of Behavioral Research",
  "Western Continental Academy",
];

const alienDegrees = [
  // Obvious
  "B.Sc. in Human Behavioral Analysis",
  "Masters of Carbon-Based Lifeform Studies",
  "Ph.D. in Terrestrial Adaptation Sciences",
  "B.A. in Atmospheric Composition",
  "M.S. in Gravity-Dependent Biology",
  // Subtle - sound almost like real degrees
  "B.Sc. in Applied Behavioral Observation",
  "M.A. in Cultural Acclimatization Studies",
  "B.A. in Environmental Integration",
  "M.S. in Population Behavior Analytics",
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
  // Obvious
  "Breathing (Advanced)",
  "Bipedal walking (Proficient)",
  "Consuming Earth food (Intermediate)",
  "Blinking at normal intervals",
  "Maintaining body temperature (Expert)",
  // Subtle - almost pass as real skills
  "Emotional recognition (Trained)",
  "Facial expression calibration",
  "Social cue interpretation (Intermediate)",
  "Temperature-appropriate clothing selection",
  "Handwriting (Practiced)",
  "Tone of voice modulation",
];

const alienInterests = [
  // Obvious
  "cataloguing human social rituals",
  "studying local gravitational variations",
  "collecting soil samples from various continents",
  "observing mammalian bonding ceremonies",
  "documenting water-based precipitation events",
  // Subtle - sound like someone trying too hard to be relatable
  "practicing normal greetings with neighbors",
  "attending outdoor gatherings to study group dynamics",
  "watching cooking shows to understand food preparation norms",
  "sampling regional cuisine to build tolerance",
  "observing family units at public parks",
  "maintaining a journal of daily human interactions",
  "learning to enjoy the sensation of sunlight",
  "participating in the tradition of small talk",
  "collecting examples of humor for personal reference",
];

const oddLocalSkills = [
  "Adapted to local gravity",
  "Familiar with local sun cycles",
  "Local atmospheric tolerance",
  "Regional dialect acquisition (In Progress)",
  "Seasonal wardrobe adaptation",
];

const earlyConfusedSkills = [
  // Obvious
  "Handshaking (Certified)",
  "Sitting in chairs (Proficient)",
  "Using door handles",
  "Verbal greeting protocols",
  "Maintaining eye contact (Intermediate)",
  "Water drinking (Advanced)",
  // Subtle
  "Personal space awareness (Trained)",
  "Appropriate volume control",
  "Elevator etiquette (Practicing)",
  "Queue forming (Competent)",
];

const earlyAlienInterests = [
  // Obvious
  "learning about human holidays",
  "exploring the concept of weekends",
  "understanding currency exchange",
  "trying different Earth beverages",
  "researching domestic pet ownership",
  "adjusting to seasonal weather patterns",
  // Subtle - almost normal but slightly off
  "getting used to sleeping at night",
  "learning when it is appropriate to wave",
  "building a personal music preference list",
  "practicing appropriate laughter timing",
  "studying which foods are eaten at which meals",
  "learning the rules of birthdays",
];

// ============ UTILITY ============

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getCluesForTier(tier: number): AlienClue[] {
  const available: AlienClue[] = [];

  // Case 1+: Contact/identity tells (name, email, phone, location)
  if (tier >= 1) available.push(...categoryAClues);

  // Case 2+: Work experience tells (job title, company, bullets)
  if (tier >= 2) available.push(...categoryBClues);

  // Case 3+: Interests & hobbies tells
  if (tier >= 3) {
    available.push(...categoryA2Clues.filter((c) => c.section === "interests"));
    available.push(...categoryEClues.filter((c) => c.section === "interests"));
  }

  // Case 4+: Skills tells
  if (tier >= 4) {
    available.push(...categoryA2Clues.filter((c) => c.section === "skills"));
    available.push(...categoryDClues);
    available.push(...categoryEClues.filter((c) => c.section === "skills"));
  }

  // Case 5+: Education tells (all categories available)
  if (tier >= 5) available.push(...categoryCClues);

  return available;
}
