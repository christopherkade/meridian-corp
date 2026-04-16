import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const RESERVED_NAMES = ["admin", "administrator", "moderator", "mod", "system"];

/**
 * Validates a player name. Returns an error message if invalid, or null if OK.
 */
export function validateName(name: string): string | null {
  const lower = name.toLowerCase().replace(/\s+/g, "");

  if (RESERVED_NAMES.includes(lower)) {
    return "That name is reserved.";
  }

  const hasMatch = matcher.hasMatch(name);

  if (hasMatch) {
    return "That name contains inappropriate language.";
  }

  return null;
}
