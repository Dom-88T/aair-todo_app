const SPLIT_PATTERN = /[,;]|\band\b|\balso\b|\bthen\b|\bplus\b|\bfinally\b/gi;

function capitalise(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripLeadingFillers(str: string): string {
  return str.replace(/^(and|then|also|plus|finally)\s+/i, "").trim();
}

export function splitIntoTasks(rawText: string): string[] {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  if (!SPLIT_PATTERN.test(trimmed)) {
    return [capitalise(trimmed)];
  }

  SPLIT_PATTERN.lastIndex = 0;

  const parts = trimmed
    .split(SPLIT_PATTERN)
    .map((part) => stripLeadingFillers(part))
    .map((part) => capitalise(part))
    .filter((part) => part.length > 1);

  return parts.length > 0 ? parts : [capitalise(trimmed)];
}
