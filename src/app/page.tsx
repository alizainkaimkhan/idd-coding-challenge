"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CourseCard from "@/components/CourseCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { matchesQuery } from "@/lib/search";
import { paginate } from "@/lib/pagination";
import type { Course } from "@/lib/types";

const DATA_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/data/courses.json`;

export default function Home() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  function handleQueryChange(next: string) {
    setQuery(next);
    setPage(1);
  }

  const filteredCourses = useMemo(() => {
    if (!courses) return null;
    return courses.filter((course) => matchesQuery(course, query));
  }, [courses, query]);

  const pagination = useMemo(() => {
    if (!filteredCourses) return null;
    return paginate(filteredCourses, page);
  }, [filteredCourses, page]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    resultsRef.current?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [page]);

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

      <SearchBar value={query} onChange={handleQueryChange} />

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

      {!error && courses !== null && courses.length > 0 && filteredCourses && pagination && (
        <>
          {filteredCourses.length === 0 ? (
            <p className="text-foreground/70">No courses match your search.</p>
          ) : (
            <div ref={resultsRef}>
              <p className="text-sm text-foreground/70 mb-4">
                Showing {pagination.rangeStart}–{pagination.rangeEnd} of{" "}
                {filteredCourses.length} courses
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pagination.pageItems.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </ul>

              {pagination.totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
