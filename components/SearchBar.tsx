"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export function SearchBar({ placeholder, value, onValueChange, onSearch }: SearchBarProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value);
      }}
      className="flex items-center gap-3"
    >
      <div className="relative flex w-full items-center">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
        <input
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
          }}
          placeholder={placeholder ?? "Search by ingredient, meal, or region..."}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-12 pr-12 text-base transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          aria-label="Search recipes"
        />
        {value.length > 0 && (
          <button
            type="button"
            className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:text-white"
            onClick={() => {
              onValueChange("");
              onSearch("");
            }}
            aria-label="Clear search"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/70"
      >
        Search
      </button>
    </form>
  );
}

