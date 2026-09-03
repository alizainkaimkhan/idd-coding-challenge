"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import type { Course } from "@/lib/types";

const DATA_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/data/courses.json`;

export default function Home() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
        return res.json();
      })
      .then((data: Course[]) => {
        if (!cancelled) setCourses(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load courses");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen p-6 sm:p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">UofL Course Catalog</h1>

      {error && (
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {!error && courses === null && (
        <p className="text-foreground/70">Loading courses…</p>
      )}

      {!error && courses !== null && courses.length === 0 && (
        <p className="text-foreground/70">No courses found.</p>
      )}

      {!error && courses !== null && courses.length > 0 && (
        <ul className="flex flex-col gap-3">
          {courses.slice(0, 10).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </ul>
      )}
    </main>
  );
}
