import { describe, it, expect } from "vitest";
import { calculateScore, getExplanation, calculateRating } from "@/lib/scoring";

describe("Scoring System", () => {
  describe("calculateScore", () => {
    it("gives +100 for correct hire (human → hired)", () => {
      const score = calculateScore({
        isAlien: false,
        decision: "hire",
        tier: 1,
      });
      expect(score).toBe(100);
    });

    it("gives +150 for correct flag (alien → flagged)", () => {
      const score = calculateScore({
        isAlien: true,
        decision: "flag",
        tier: 1,
      });
      expect(score).toBe(150);
    });

    it("gives -75 for false positive (human → flagged)", () => {
      const score = calculateScore({
        isAlien: false,
        decision: "flag",
        tier: 1,
      });
      expect(score).toBe(-75);
    });

    it("gives -200 for false negative (alien → hired)", () => {
      const score = calculateScore({
        isAlien: true,
        decision: "hire",
        tier: 1,
      });
      expect(score).toBe(-200);
    });

    it("multiplies by tier", () => {
      const score = calculateScore({
        isAlien: true,
        decision: "flag",
        tier: 3,
      });
      expect(score).toBe(450); // 150 * 3
    });

    it("applies confidence bonus at tier 3+", () => {
      const score = calculateScore({
        isAlien: true,
        decision: "flag",
        tier: 3,
        suspicionLevel: "definitely-alien",
      });
      expect(score).toBe(Math.round(150 * 3 * 1.3)); // 585
    });

    it("no confidence bonus at tier 1-2", () => {
      const score = calculateScore({
        isAlien: true,
        decision: "flag",
        tier: 2,
        suspicionLevel: "definitely-alien",
      });
      expect(score).toBe(300); // 150 * 2, no bonus
    });

    it("no confidence bonus when meter disagrees", () => {
      const score = calculateScore({
        isAlien: true,
        decision: "flag",
        tier: 3,
        suspicionLevel: "probably-human",
      });
      expect(score).toBe(450); // 150 * 3, no bonus
    });
  });

  describe("getExplanation", () => {
    it("explains correct alien flag", () => {
      const explanation = getExplanation(true, "flag", [
        { description: "Implausible alien name" },
      ]);
      expect(explanation).toContain("Correct");
      expect(explanation).toContain("alien");
    });

    it("explains correct human hire", () => {
      const explanation = getExplanation(false, "hire", []);
      expect(explanation).toContain("Correct");
      expect(explanation).toContain("human");
    });

    it("explains missed alien", () => {
      const explanation = getExplanation(true, "hire", [
        { description: "Alien email TLD" },
      ]);
      expect(explanation).toContain("alien");
    });

    it("explains false alarm", () => {
      const explanation = getExplanation(false, "flag", []);
      expect(explanation).toContain("human");
      expect(explanation).toContain("False alarm");
    });
  });

  describe("calculateRating", () => {
    it("returns S for ≥95% with no false negatives", () => {
      expect(calculateRating(0.95, false)).toBe("S");
      expect(calculateRating(1.0, false)).toBe("S");
    });

    it("returns A for S accuracy but with false negatives", () => {
      expect(calculateRating(0.95, true)).toBe("A");
    });

    it("returns A for ≥85%", () => {
      expect(calculateRating(0.85, false)).toBe("A");
      expect(calculateRating(0.89, true)).toBe("A");
    });

    it("returns B for ≥70%", () => {
      expect(calculateRating(0.70, false)).toBe("B");
    });

    it("returns C for ≥50%", () => {
      expect(calculateRating(0.50, false)).toBe("C");
    });

    it("returns F for <50%", () => {
      expect(calculateRating(0.30, false)).toBe("F");
    });
  });
});
