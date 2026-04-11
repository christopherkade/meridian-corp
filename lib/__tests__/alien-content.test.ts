import { describe, it, expect } from "vitest";
import { getCluesForTier } from "@/lib/data/alien-content";

describe("Alien Content", () => {
  describe("getCluesForTier", () => {
    it("returns category A and B clues at tier 1", () => {
      const clues = getCluesForTier(1);
      const categories = new Set(clues.map((c) => c.category));
      expect(categories.has("A")).toBe(true);
      expect(categories.has("B")).toBe(true);
      expect(categories.has("C")).toBe(false);
      expect(categories.has("D")).toBe(false);
      expect(categories.has("E")).toBe(false);
    });

    it("adds category C at tier 2", () => {
      const clues = getCluesForTier(2);
      const categories = new Set(clues.map((c) => c.category));
      expect(categories.has("A")).toBe(true);
      expect(categories.has("B")).toBe(true);
      expect(categories.has("C")).toBe(true);
      expect(categories.has("D")).toBe(false);
    });

    it("adds category D at tier 3", () => {
      const clues = getCluesForTier(3);
      const categories = new Set(clues.map((c) => c.category));
      expect(categories.has("D")).toBe(true);
      expect(categories.has("E")).toBe(false);
    });

    it("adds category E at tier 4", () => {
      const clues = getCluesForTier(4);
      const categories = new Set(clues.map((c) => c.category));
      expect(categories.has("E")).toBe(true);
    });

    it("has more clues available at higher tiers", () => {
      const tier1 = getCluesForTier(1);
      const tier5 = getCluesForTier(5);
      expect(tier5.length).toBeGreaterThan(tier1.length);
    });
  });
});
