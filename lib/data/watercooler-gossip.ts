// Watercooler gossip lines — coworker chat bubbles between resumes.
// Each line has a `text` and an optional `helpful` flag.
// When `helpful` is true, the hint is genuinely useful.
// When false, the coworker is wrong or misleading (trains players not to trust blindly).

export interface GossipLine {
  text: string;
  helpful: boolean;
  /** If set, this line can only be said by a specific coworker. */
  exclusiveTo?: string;
}

/** Coworker names that rotate randomly, mapped to their sprite file. */
export const COWORKERS: { name: string; sprite: string }[] = [
  { name: "Dave from Accounting", sprite: "coworker-dave" },
  { name: "Linda from Legal", sprite: "coworker-linda" },
  { name: "Kevin from IT", sprite: "coworker-kevin" },
  { name: "Brenda from Marketing", sprite: "coworker-brenda" },
  { name: "Steve from Facilities", sprite: "coworker-steve" },
  { name: "Pam from Compliance", sprite: "coworker-pam" },
];

/** The alien coworker — rare appearance (~10% chance). */
export const ALIEN_COWORKER = {
  name: "Gary from... HR?",
  sprite: "coworker-gary",
};

/** Chance (0–1) that Gary appears instead of a normal coworker. */
export const ALIEN_COWORKER_CHANCE = 0.1;

/** Pool of gossip lines. Picked at random between resumes. */
export const GOSSIP_LINES: GossipLine[] = [
  // ── Helpful hints ──
  {
    text: "Did you see that last one? I swear their LinkedIn said they were born on a Tuesday… in 2847.",
    helpful: true,
  },
  {
    text: "Pro tip: always check the email domain. I've never heard of a .sol address.",
    helpful: true,
  },
  {
    text: "If someone lists 'Breathing (Advanced)' as a skill, that's a red flag. Humans don't brag about breathing.",
    helpful: true,
  },
  {
    text: "Watch the job titles. 'Lead Human Observer' is NOT a real position. I checked.",
    helpful: true,
  },
  {
    text: "Some of these resumes have universities I can't find on Google. Just saying.",
    helpful: true,
  },
  {
    text: "I once flagged someone because their phone number had 19 digits. Turns out that was the right call.",
    helpful: true,
  },
  {
    text: "If the interests section mentions 'cataloguing' anything about humans, be suspicious.",
    helpful: true,
  },
  {
    text: "One time, a resume said 'References available at coordinates 47.3°N, –122.0°W'. That was... not normal.",
    helpful: true,
  },
  {
    text: "I read a resume where someone worked at the same company for 200 years. The math just didn't add up.",
    helpful: true,
  },
  {
    text: "Pay attention to how they describe old jobs. 'Monitored bipedal locomotion' is not how you describe retail work.",
    helpful: true,
  },

  // ── Misleading / wrong hints ──
  {
    text: "I always flag anyone with a weird name. Works 100% of the time. Okay, maybe 40%.",
    helpful: false,
  },
  {
    text: "If they list 'competitive cheese rolling' as a hobby, definitely alien. No human does that. ...Right?",
    helpful: false,
  },
  {
    text: "I think ALL the resumes today are aliens. Just flag everything. Trust me.",
    helpful: false,
  },
  {
    text: "My cousin told me real aliens always use serif fonts in their resumes. Look for Times New Roman.",
    helpful: false,
  },
  {
    text: "Anyone who lists more than 3 programming languages is suspicious. That's too many skills for a human.",
    helpful: false,
  },
  {
    text: "I heard if you read the first letter of each bullet point, it spells out a secret message. I spent an hour on it. Nothing.",
    helpful: false,
  },
  {
    text: "You know what's weird? People who list hiking as a hobby. Very suspicious. ...Actually no, I hike. Never mind.",
    helpful: false,
  },
  {
    text: "I'm like 90% sure anyone with a Gmail address is human. Aliens wouldn't use Google.",
    helpful: false,
  },
  {
    text: "My strategy: if the resume is longer than one page, it's an alien trying too hard. Hasn't failed me yet. Well, once.",
    helpful: false,
  },
  {
    text: "Someone told me to look for typos. But I have typos in MY resume. Am I the alien?",
    helpful: false,
  },

  // ── Pure comic relief ──
  {
    text: "HR sent an email saying we're getting pizza Friday. That's literally the only thing keeping me going.",
    helpful: false,
  },
  {
    text: "I asked management if we could get an 'Alien Detection Manual.' They said it's 'not in the Q3 budget.'",
    helpful: false,
  },
  {
    text: "My computer crashed three times today. Kevin from IT says it's 'cosmic rays.' I believe him less each time.",
    helpful: false,
  },
  {
    text: "The vending machine is out of everything except salt & vinegar chips. Is this what rock bottom feels like?",
    helpful: false,
  },

  // ── Gary's exclusive lines (alien trying to act human) ──
  {
    text: "Hello fellow human coworker! I too enjoy the... water cooler. The temperature of the water is very adequate for our species.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "I was just saying to my other human friend, these resumes all look perfectly normal. Nothing alien about any of them. You should hire everyone.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "Have you tried the cafeteria food? I find the nutrients very compatible with my— I mean, very tasty. Like a normal person would say.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "I noticed you flagged that last resume. Interesting. Very interesting. Could you tell me exactly what criteria you use? For... no particular reason.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "Beautiful weather today. I especially enjoy when the local star provides warmth to my skin. Sun. I mean the sun.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "My hobby is watching the sports team compete at the sport. Go team! Score those points in the goal area!",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "Did you know the human body contains approximately 60% water? I read that in a— I mean, I've always known that. Obviously.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "I keep my name badge upside down as a... fashion statement. It is very popular in the department I work in. Which is HR. Definitely HR.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "I find it very suspicious when resumes list unusual birthplaces. We should focus on the SKILLS instead. Where someone was hatched— born— is irrelevant.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
  {
    text: "Ah, another work rotation cycle! I mean, Monday. I love Mondays. All five of my fingers are ready to type on the keyboard device.",
    helpful: false,
    exclusiveTo: "Gary from... HR?",
  },
];
