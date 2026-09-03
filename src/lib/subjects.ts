import type { Course } from "./types";

export function getUniqueSubjects(courses: Course[]): string[] {
  return [...new Set(courses.map((c) => c.subject))].sort();
}

export function matchesSubject(course: Course, subject: string): boolean {
  const trimmed = subject.trim();
  if (trimmed === "") return true;
  return course.subject.toLowerCase() === trimmed.toLowerCase();
}
