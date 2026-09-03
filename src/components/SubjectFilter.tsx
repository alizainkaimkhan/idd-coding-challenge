interface SubjectFilterProps {
  value: string;
  onChange: (value: string) => void;
  subjects: string[];
}

export default function SubjectFilter({ value, onChange, subjects }: SubjectFilterProps) {
  return (
    <div className="relative">
      <label htmlFor="subject-filter" className="sr-only">
        Filter by subject
      </label>
      <input
        id="subject-filter"
        type="text"
        list="subject-options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter by subject (e.g. CHEM)"
        className="w-full rounded-lg border border-black/10 dark:border-white/15 px-4 py-2 pr-9 text-base"
      />
      <datalist id="subject-options">
        {subjects.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear subject filter"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-lg leading-none text-foreground/50 hover:text-foreground"
        >
          ×
        </button>
      )}
    </div>
  );
}
