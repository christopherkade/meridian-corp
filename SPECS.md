# Meridian Corp - Full Game Design Specification

## 1. Concept & Elevator Pitch

The player is an HR drone at a generic corporation called **Meridian Solutions™**. Their job: process a stack of incoming resumes. What HR doesn't know - but the player suspects - is that Earth is being quietly infiltrated by aliens who have learned to forge human credentials. The player must review each resume and decide: **Hire** or **Flag as alien**. Clues start laughably obvious and grow gradually, brutally subtle.

The tone is dry corporate comedy. The UI is a faithful parody of office software.

---

## 2. Interface Design

### 2.1 Overall Layout

The game is rendered as a **fake desktop application** - a spoofed HR software suite called **TalentBridge Pro 3.2**. It fills the browser window with a chrome bar at the top, a taskbar at the bottom, and the resume viewer as the main content area.

The screen is divided into three zones:

**Left panel (20% width)** - The resume pile. Shows a stack of paper icons counting down. The current resume number and total are displayed (e.g. "Resume 7 of 30"). Below it, a small notepad widget where the player can jot free-text notes about any resume (this persists during a run and becomes mechanically important at later tiers).

**Center panel (60% width)** - The resume itself. Rendered to look like a real formatted CV - clean typography, section headers, bullet points. This is the primary reading area. Sections are: Contact Info, Work Experience, Education, Skills, and Interests/Hobbies. Sections are scrollable if long.

**Right panel (20% width)** - Decision and tools. Contains the **Hire** button (green) and **Flag as Alien** button (red), a suspicion meter (described in §3.3), and a small timer if a time-pressure mode is active.

### 2.2 Resume Visual Design

Resumes use a clean, slightly generic corporate template - the kind of design a real HR tool would produce. Key design decisions:

- Font is a neutral serif for the candidate's name and section headers, monospace for bullet content (so anomalies feel "off" subtly).
- There is no color in the resume itself until the player uses a **Highlight Tool** (unlocked at tier 2), after which they can click-highlight suspicious phrases. Highlights glow amber.
- The resume is never "obviously fake" in presentation - the formatting is always professional. Only the *content* is wrong.
- At higher tiers, the resume may span two pages (scrollable).

### 2.3 Fake OS Chrome

The top bar reads: **TalentBridge Pro 3.2 - Meridian Solutions HR Portal**. There are fake menu items (File, Edit, View, Help) that are clickable and open deadpan joke dropdowns - e.g. Help → "Have you tried being more human?" These are flavor only, no gameplay impact.

At the bottom taskbar: a clock (real time), a notification area that occasionally shows fake system alerts ("Reminder: Q3 Compliance Training due in 847 days"), and a fake antivirus icon that flickers ominously at later tiers.

---

## 3. Core Gameplay

### 3.1 The Decision Loop

The game is structured as a series of rounds. Each round is a single resume. The player reads the resume at their own pace, uses available tools, and then clicks either **Hire** or **Flag as Alien**. Feedback is given immediately.

The feedback screen shows: the correct answer, a brief explanation of the tells (e.g. "Zorb Glorb applied for the role of 'Junior Atmosphere Sampler' - the clue was in the name"), the points earned, and a **Next Resume** button.

The player cannot go back to a previous resume once a decision is made.

### 3.2 Clue Architecture

Each resume is procedurally composed from a template system. Resumes have **N clue slots** distributed across sections. A clue is either:

- **A genuine alien tell** (something wrong)
- **A red herring** (something that looks suspicious but is human-normal, e.g. an unusual hobby like competitive cheese rolling)
- **Neutral filler** (ordinary correct human content)

At tier 1, alien resumes contain 3–5 obvious tells and no red herrings. As difficulty increases:
- Number of tells decreases (tier 5: often just 1)
- Red herrings increase
- Tells become subtler (see §4 for the full clue taxonomy)
- Human resumes become harder to distinguish (richer, more plausible content)

### 3.3 The Suspicion Meter

In the right panel, a **Suspicion Meter** sits between the two decision buttons. It is not a score or a timer - it is a **thinking aid** that the player controls manually. It starts at zero each resume. As the player reads, they can nudge the meter up or down using small +/– buttons, or by clicking highlighted text (which auto-increments it based on how suspicious that passage was flagged by the game's internal weighting). The meter has labels: Definitely Human · Probably Human · Unclear · Probably Alien · Definitely Alien.

The meter has no mechanical effect on the outcome - the player can ignore it. Its purpose is to scaffold active reading and create a moment of commitment before the final decision.

At tier 3+, a **Confidence Bonus** is added: if the player's meter position matches their decision (e.g. they voted Alien and the meter is in "Definitely Alien"), the point multiplier increases slightly.

### 3.4 Time Pressure (Optional Mode)

In the default mode, there is no timer. An optional **Quota Mode** can be toggled in settings: the player is given a fixed number of resumes per in-game "workday" and a soft time limit (displayed as a workday progress bar labeled "Time until end of shift"). This doesn't end the round forcibly but affects the score multiplier - fast correct decisions score higher.

---

## 4. Clue Taxonomy

Clues are organized into five categories, unlocked progressively:

### Category A - Identity Tells
Used in tiers 1–2. The most obvious class.
- Implausible name (e.g. "Glorp Xanthium", "Zxq-47 Williams")
- Birthplace listed as a planet, star, or science fiction location
- Date of birth that is impossible (born in 1847, born "~4.2 billion years ago")
- Contact email from a non-existent TLD (e.g. @proxima.sol)
- Phone number with too many or too few digits, or in an alien notation

### Category B - Career Tells
Used in tiers 1–3.
- Job title that is not a real role ("Senior Oxygen Analyst", "Lead Human Observer", "Coordinator of Mammalian Activities")
- Employer that is subtly wrong ("Galactic Resources Inc.", "Earth Branch Office - TBD")
- Impossibly long tenure at a company that didn't exist yet
- Employment gap described as "travelling" but destination is a star system
- Job description that uses passive voice in a way that implies observation rather than participation ("Monitored human procurement patterns", "Documented bipedal locomotion efficiency")

### Category C - Education Tells
Used in tiers 2–4.
- Degree from a university that doesn't exist, with a plausible-sounding name ("University of Northern Proxima", "Galactic Institute of Applied Biology")
- Degree subject that is suspicious ("B.Sc. in Human Behavioral Analysis", "Masters of Carbon-Based Lifeform Studies")
- Graduation year that doesn't line up with start year
- Academic honors described in alien numerical systems

### Category D - Skill & Language Tells
Used in tiers 3–5.
- Listed language proficiency in a non-human language ("Fluent in Kzinti", "Conversational Grblchk")
- Technical skill that is actually alien ("Xenoform data parsing", "Atmospheric recombination")
- Skills listed in an order that implies confusion about human work (e.g. "Breathing (Advanced), Teamwork (Intermediate)")
- Proficiency in something no human would list ("Undetected movement", "Mass memory suppression")

### Category E - Soft Tells
Used exclusively in tiers 4–5. These require holistic reading and cross-referencing.
- Interests section contains a subtle tell amid normal hobbies ("hiking, photography, cataloguing human social rituals")
- One resume in a group has a different subtle detail that ties it to another alien resume (shared fictional employer, matching cover dates)
- The "References Available Upon Request" is replaced with a coordinates string
- A single digit is transposed in a way that implies a non-base-10 system
- The word "local" is used oddly ("local gravity", "local sun")

---

## 5. Progression System

### 5.1 Structure

The game is organized into **Cases** (equivalent to a workday). Each case contains a fixed pile of resumes. Standard structure:

- **Cases 1–3**: Tier 1 only. Tutorial pacing.
- **Cases 4–6**: Mix of tier 1 and tier 2.
- **Cases 7–12**: Tier 2 and 3.
- **Cases 13–20**: Tier 3 and 4.
- **Cases 21+**: Tier 4 and 5, with decoy patterns.

Within each case, resumes are shuffled. Roughly 40–60% of resumes are alien (never exactly 50/50, to prevent button-alternating strategies).

### 5.2 Scoring

Each resume decision yields a score based on:

| Outcome | Base Points |
|---|---|
| Correct hire (human → hired) | 100 |
| Correct flag (alien → flagged) | 150 |
| False positive (human → flagged) | −75 |
| False negative (alien → hired) | −200 |

This is then multiplied by the **tier multiplier** (×1 to ×5 as shown above) and by a **Confidence Bonus** (up to ×1.3 based on meter position alignment, tier 3+).

A per-case **Accuracy Rating** is displayed at the end of each case: S / A / B / C / F. An S rating requires ≥95% accuracy and no false negatives.

### 5.3 Performance Tracking

A persistent career dashboard (accessible from the main menu) shows:
- Total resumes processed
- Alien detection rate
- False positive rate
- Current case streak
- Employee performance review (a satirical formal letter that updates based on your stats)

---

## 6. Narrative Layer

The game has a light ongoing story delivered through:

- **Email inbox** (fake OS widget): receives memos from HR management. Early emails are mundane ("Please submit your Q3 expense reports"). By case 10, emails start asking why so many applicants are being flagged. By case 20, one email from an anonymous sender reads: "You're closer than you think. Stop looking at the names."
- **End-of-day reports**: a satirical performance review generated each case, written in impeccable corporate HR voice, gradually becoming more uncomfortable as the player excels.
- **The Leaderboard Applicant**: at case 15, the same alien name begins appearing across different resumes in slightly different forms - the player realizes a single alien has been reapplying. Catching all variants unlocks a secret ending.

---

## 7. Technical Implementation Notes

### 7.1 Recommended Stack
The game is well-suited to **ReactJS**. No 3D engine is needed. Key libraries: React for UI, Framer Motion for the resume-flip and decision animations, Tailwind CSS for the corporate aesthetic, and Zustand or Context for game state.

### 7.2 Resume Generation
Resumes are assembled at runtime from a **template engine**. Each section (contact, experience, education, skills, interests) has a pool of human-normal content blocks and alien-tell content blocks. The engine picks based on the configured tier and alien/human status for that resume. This makes the content pool easily extensible - adding new clues is a matter of adding new content entries to JSON data files.

### 7.3 State Persistence
Game progress (case number, unlocked tools, career stats) is persisted to `localStorage`. No backend is required for the base game.

### 7.4 Accessibility
The resume text must be fully readable by screen readers. Decision buttons must be keyboard-accessible. The visual highlighting system should have a keyboard shortcut alternative.

---

## 8. Out of Scope (V1)

The following are noted for future versions: multiplayer co-op case review, procedurally generated alien lore (building a dossier on the invasion), user-submitted resume templates, and a mobile-native layout.