interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <label htmlFor="course-search" className="sr-only">
        Search courses
      </label>
      <input
        id="course-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by subject, number, or title…"
        className="w-full rounded-lg border border-black/10 dark:border-white/15 px-4 py-2 pr-9 text-base"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-lg leading-none text-foreground/50 hover:text-foreground"
        >
          ×
        </button>
      )}
    </div>
  );
}
