"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookmarkIcon as BookmarkOutlineIcon,
  FunnelIcon,
  RectangleStackIcon
} from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { SearchBar } from "@/components/SearchBar";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetail } from "@/components/RecipeDetail";
import { fetchCategories, searchMeals } from "@/lib/api";
import type { Category, Meal } from "@/lib/types";

const BOOKMARK_STORAGE_KEY = "recipe-discovery-bookmarks";

export default function Page() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [bookmarks, setBookmarks] = useState<Record<string, Meal>>({});
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, Meal>;
        setBookmarks(parsed);
      } catch (error_) {
        console.warn("Unable to parse saved bookmarks", error_);
        localStorage.removeItem(BOOKMARK_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleSearch = useCallback(
    async (newQuery: string) => {
      setShowSaved(false);
      setQuery(newQuery);
      setSelectedCategory("all");
      setSelectedArea("all");
      const sanitized = newQuery.trim();

      setLoading(true);
      setError(null);
      
      try {
        const results = await searchMeals(sanitized);
        console.log("results", results);
        setMeals(results);
        if (results.length === 0) {
          setError("No recipes found. Try another ingredient or cuisine.");
        }
      } catch (error_) {
        console.error(error_);
        setError("We hit a snag fetching recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (query === "") {
      handleSearch("");
    }
  }, [query, handleSearch]);

  const handleToggleBookmark = useCallback((meal: Meal) => {
    setBookmarks((prev) => {
      const updated = { ...prev };
      if (updated[meal.idMeal]) {
        delete updated[meal.idMeal];
      } else {
        updated[meal.idMeal] = meal;
      }
      return updated;
    });
  }, []);

  const areas = useMemo(() => {
    const set = new Set<string>();
    (showSaved ? Object.values(bookmarks) : meals).forEach((meal) => {
      if (meal.strArea) set.add(meal.strArea);
    });
    return Array.from(set).sort();
  }, [meals, bookmarks, showSaved]);

  const filteredMeals = useMemo(() => {
    const source = showSaved ? Object.values(bookmarks) : meals;
    return source.filter((meal) => {
      const matchesCategory = selectedCategory === "all" || meal.strCategory === selectedCategory;
      const matchesArea = selectedArea === "all" || meal.strArea === selectedArea;
      return matchesCategory && matchesArea;
    });
  }, [meals, bookmarks, selectedCategory, selectedArea, showSaved]);

  const savedCount = Object.keys(bookmarks).length;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-6">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-400">Weeknight explorer</p>
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          Discover new recipes without spending hours scrolling.
        </h1>
        <p className="max-w-3xl text-lg text-slate-300">
          Search by ingredients, cuisine, or name. <br />Filter your results, peek through the instructions, and save your
          favorites for later. <br />Data courtesy of TheMealDB.
        </p>
        <SearchBar value={query} onValueChange={setQuery} onSearch={handleSearch} />
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2">
            <FunnelIcon className="h-4 w-4 text-brand-300" />
            <label className="flex items-center gap-2">
              Category
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
              >
                <option value="all">All</option>
                {categories.map((category) => (
                  <option key={category.idCategory} value={category.strCategory}>
                    {category.strCategory}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2">
            <RectangleStackIcon className="h-4 w-4 text-brand-300" />
            <label className="flex items-center gap-2">
              Region
              <select
                value={selectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
              >
                <option value="all">All</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => setShowSaved((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-slate-200 transition hover:border-brand-500 hover:text-white"
          >
            {showSaved ? <BookmarkIcon className="h-4 w-4 text-brand-300" /> : <BookmarkOutlineIcon className="h-4 w-4" />}
            {showSaved ? `Viewing saved recipes (${savedCount})` : `Saved recipes (${savedCount})`}
          </button>
        </div>
      </header>

      <section className="flex-1">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60"
              />
            ))}
          </div>
        )}

        {!loading && !showSaved && error && <p className="text-base text-slate-300">{error}</p>}

        {!loading && showSaved && filteredMeals.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-slate-300">
            <h2 className="text-2xl font-semibold text-white">No saved recipes yet</h2>
            <p className="mt-2 text-sm">
              Tap the bookmark button on any recipe card to collect your go-to meals.
            </p>
          </div>
        )}

        {!loading && !showSaved && !error && filteredMeals.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-slate-300">
            <h2 className="text-2xl font-semibold text-white">Search for a recipe to begin</h2>
            <p className="mt-2 text-sm">
              Try typing an ingredient like &ldquo;chicken,&rdquo; a cuisine like &ldquo;Italian,&rdquo; or a meal name.
            </p>
          </div>
        )}

        {!loading && filteredMeals.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMeals.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                isBookmarked={Boolean(bookmarks[meal.idMeal])}
                onSelect={setSelectedMeal}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </section>

      {selectedMeal && (
        <RecipeDetail
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          isBookmarked={Boolean(bookmarks[selectedMeal.idMeal])}
          onToggleBookmark={handleToggleBookmark}
        />
      )}
    </main>
  );
}