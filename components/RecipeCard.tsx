"use client";

import Image from "next/image";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import type { Meal } from "@/lib/types";

interface RecipeCardProps {
  meal: Meal;
  isBookmarked: boolean;
  onSelect: (meal: Meal) => void;
  onToggleBookmark: (meal: Meal) => void;
}

export function RecipeCard({ meal, isBookmarked, onSelect, onToggleBookmark }: RecipeCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-brand-500/70 hover:shadow-brand-500/20">
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        {meal.strMealThumb ? (
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <span className="text-sm">No image</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => onToggleBookmark(meal)}
          className="absolute right-3 top-3 rounded-full bg-slate-900/70 p-2 text-white transition hover:bg-brand-500/90"
          aria-label={isBookmarked ? "Remove from saved recipes" : "Save recipe"}
        >
          {isBookmarked ? <BookmarkIcon className="h-5 w-5" /> : <BookmarkOutlineIcon className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-white line-clamp-2">{meal.strMeal}</h3>
          <p className="text-sm text-slate-400">
            {meal.strArea} • {meal.strCategory}
          </p>
        </header>
        {meal.strTags && (
          <ul className="flex flex-wrap gap-2 text-xs text-brand-300">
            {meal.strTags.split(",").map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-brand-500/40 bg-brand-500/10 px-2 py-1 uppercase tracking-wide"
              >
                {tag.trim()}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelect(meal)}
            className="rounded-xl border border-transparent bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            View recipe
          </button>
          {meal.strSource && (
            <a
              href={meal.strSource}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}