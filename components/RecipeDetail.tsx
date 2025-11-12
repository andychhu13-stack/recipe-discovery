"use client";

import { useMemo } from "react";
import Image from "next/image";
import { XMarkIcon, PlayCircleIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { Meal } from "@/lib/types";

interface RecipeDetailProps {
  meal: Meal;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (meal: Meal) => void;
}

function extractIngredients(meal: Meal): Array<{ ingredient: string; measure: string }> {
  const ingredients: Array<{ ingredient: string; measure: string }> = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredientKey = `strIngredient${index}` as const;
    const measureKey = `strMeasure${index}` as const;
    const ingredient = meal[ingredientKey];
    const measure = meal[measureKey];
    if (!ingredient || ingredient.trim().length === 0) continue;

    ingredients.push({
      ingredient: ingredient.trim(),
      measure: (measure ?? "").trim()
    });
  }

  return ingredients;
}

export function RecipeDetail({ meal, onClose, isBookmarked, onToggleBookmark }: RecipeDetailProps) {
  const ingredients = useMemo(() => extractIngredients(meal), [meal]);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-lg">
      <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-brand-500/20">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 text-slate-200 transition hover:bg-brand-500/80 hover:text-white"
          aria-label="Close recipe details"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[2fr,3fr]">
          <div className="relative h-64 w-full lg:h-full bg-slate-800">
            {meal.strMealThumb ? (
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <span className="text-sm">No image</span>
              </div>
            )}
            <div className="absolute bottom-0 flex w-full flex-col gap-2 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-6">
              <h2 className="text-2xl font-bold text-white">{meal.strMeal}</h2>
              <p className="text-sm text-slate-300">
                {meal.strArea} • {meal.strCategory}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(meal)}
                  className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  {isBookmarked ? "Remove from saved" : "Save to cookbook"}
                </button>
                {meal.strSource && (
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Visit source
                  </a>
                )}
                {meal.strYoutube && (
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-full bg-red-600/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    <PlayCircleIcon className="h-5 w-5" />
                    Watch tutorial
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto p-6 scrollbar-thin">
            <div>
              <h3 className="text-lg font-semibold text-white">Ingredients</h3>
              <ul className="mt-2 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
                {ingredients.map(({ ingredient, measure }) => (
                  <li
                    key={ingredient}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 shadow-sm shadow-slate-950/30"
                  >
                    <span className="font-medium text-white">{ingredient}</span>
                    {measure && <span className="text-slate-400"> — {measure}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Instructions</h3>
              <ol className="mt-2 space-y-3 text-sm leading-6 text-slate-200">
                {meal.strInstructions
                  .split(/\r?\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, index) => (
                    <li key={`${index}-${line}`} className="flex gap-3">
                      <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-400">
                        {index + 1}
                      </span>
                      <p>{line}</p>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}