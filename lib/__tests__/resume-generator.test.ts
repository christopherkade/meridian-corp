import { describe, it, expect } from "vitest";
import { generateResume, generateCase } from "@/lib/resume-generator";

describe("Resume Generator", () => {
  describe("generateResume", () => {
    it("generates a human resume with no alien clues", () => {
      const resume = generateResume(false, 1);
      expect(resume.isAlien).toBe(false);
      expect(resume.clues).toHaveLength(0);
      expect(resume.data.contact.name).toBeTruthy();
      expect(resume.data.contact.email).toContain("@");
      expect(resume.data.experience.length).toBeGreaterThan(0);
      expect(resume.data.education.length).toBeGreaterThan(0);
      expect(resume.data.skills.length).toBeGreaterThan(0);
      expect(resume.data.interests.length).toBeGreaterThan(0);
    });

    it("generates an alien resume with clues at tier 1", () => {
      const resume = generateResume(true, 1);
      expect(resume.isAlien).toBe(true);
      expect(resume.clues.length).toBeGreaterThanOrEqual(3);
      expect(resume.clues.length).toBeLessThanOrEqual(5);
    });

    it("generates fewer clues at higher tiers", () => {
      // Run multiple times to average out randomness
      let tier1Total = 0;
      let tier5Total = 0;
      const iterations = 20;

      for (let i = 0; i < iterations; i++) {
        tier1Total += generateResume(true, 1).clues.length;
        tier5Total += generateResume(true, 5).clues.length;
      }

      expect(tier1Total / iterations).toBeGreaterThan(tier5Total / iterations);
    });

    it("generates unique IDs for each resume", () => {
      const r1 = generateResume(false, 1);
      const r2 = generateResume(false, 1);
      expect(r1.id).not.toBe(r2.id);
    });

    it("adds red herrings at higher tiers", () => {
      // At tier 1, no red herrings
      let hasRedHerrings = false;
      for (let i = 0; i < 10; i++) {
        const resume = generateResume(false, 1);
        if (resume.redHerrings.length > 0) hasRedHerrings = true;
      }
      expect(hasRedHerrings).toBe(false);
    });
  });

  describe("generateCase", () => {
    it("generates correct number of resumes for case 1", () => {
      const resumes = generateCase(1);
      expect(resumes.length).toBe(8);
    });

    it("generates a mix of alien and human resumes", () => {
      const resumes = generateCase(1);
      const alienCount = resumes.filter((r) => r.isAlien).length;
      const humanCount = resumes.filter((r) => !r.isAlien).length;

      expect(alienCount).toBeGreaterThan(0);
      expect(humanCount).toBeGreaterThan(0);
      // 40-60% alien
      expect(alienCount / resumes.length).toBeGreaterThanOrEqual(0.3);
      expect(alienCount / resumes.length).toBeLessThanOrEqual(0.7);
    });

    it("increases resume count for later cases", () => {
      const case1 = generateCase(1);
      const case10 = generateCase(10);
      expect(case10.length).toBeGreaterThan(case1.length);
    });
  });
});
