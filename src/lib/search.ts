import type { Course } from "./types";

export function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

// Bidirectional token-prefix match, not substring match: every query token
// must prefix-match some course token, OR be prefix-matched BY some course
// token. This is what lets a query for "Philosophy of Technology" find a
// course whose DESCR is the abbreviated "PHIL OF TECHNOLOGY" — "phil"
// (course token) is a prefix of "philosophy" (query token), even though
// "philosophy" never appears as a substring anywhere in the course data.
export function matchesQuery(course: Course, query: string): boolean {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return true;

  const courseTokens = tokenize(`${course.subject} ${course.catalogNbr} ${course.descr}`);

  return queryTokens.every((qt) =>
    courseTokens.some((ct) => ct.startsWith(qt) || qt.startsWith(ct))
  );
}
