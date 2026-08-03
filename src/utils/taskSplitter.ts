// ─── Task Splitter ─────────────────────────────────────────────────────────────
// Converts a natural-language string into an array of task titles.
//
// Example: "Buy milk and call mom, then walk the dog"
//       → ["Buy milk", "call mom", "walk the dog"]

// Words that typically join two separate actions in spoken language
const SPLIT_CONJUNCTIONS = /\band\b|\balso\b|\bthen\b|\bplus\b|\bfinally\b/gi;

// Split on conjunctions OR commas/semicolons
const SPLIT_PATTERN = /[,;]|\band\b|\balso\b|\bthen\b|\bplus\b|\bfinally\b/gi;

/**
 * Capitalises the first letter of a string.
 * "buy milk" → "Buy milk"
 */
function capitalise(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Strips filler words from the start of a phrase so tasks read cleanly.
 * "and then go to the gym" → "go to the gym"
 */
function stripLeadingFillers(str: string): string {
  return str.replace(/^(and|then|also|plus|finally)\s+/i, "").trim();
}

/**
 * Converts a spoken sentence into one or more task titles.
 *
 * Single action → returns one task:
 *   "Schedule dentist appointment" → ["Schedule dentist appointment"]
 *
 * Multiple actions → splits them:
 *   "Buy provisions and call mom" → ["Buy provisions", "call mom"]
 */
export function splitIntoTasks(rawText: string): string[] {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  // If there are no conjunctions or commas, it's a single task
  if (!SPLIT_PATTERN.test(trimmed)) {
    return [capitalise(trimmed)];
  }

  // Reset regex lastIndex after the test() call above
  SPLIT_PATTERN.lastIndex = 0;

  const parts = trimmed
    .split(SPLIT_PATTERN) // split on "and", "then", ",", etc.
    .map((part) => stripLeadingFillers(part)) // remove dangling fillers
    .map((part) => capitalise(part)) // capitalise each task
    .filter((part) => part.length > 1); // discard empty fragments

  return parts.length > 0 ? parts : [capitalise(trimmed)];
}
