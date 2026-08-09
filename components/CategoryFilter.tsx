"use client";

import { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  active: Category | "All";
  onChange: (cat: Category | "All") => void;
}

export default function CategoryFilter({ categories, active, onChange }: Props) {
  const options: (Category | "All")[] = ["All", ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-4 max-w-6xl mx-auto">
      {options.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              isActive
                ? "bg-navy text-white border-navy"
                : "bg-white text-navy border-navy/20 hover:border-navy/50"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
