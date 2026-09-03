import type { Course } from "@/lib/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <li className="rounded-lg border border-black/10 dark:border-white/15 p-4 shadow-sm">
      <p className="font-semibold">
        {course.subject} {course.catalogNbr}
      </p>
      <p className="text-sm text-foreground/80">{course.descr}</p>
    </li>
  );
}
