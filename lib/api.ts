import type { Category, Meal } from "./types";

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(
    `/api/meals?endpoint=${encodeURIComponent(endpoint)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function searchMeals(query: string): Promise<Meal[]> {
  const trimmed = query.trim();
  const endpoint = trimmed
    ? `/search.php?s=${encodeURIComponent(trimmed)}`
    : "/search.php?s=";
  const data = await fetchJson<{ meals: Meal[] | null }>(endpoint);
  return data.meals ?? [];
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await fetchJson<{ categories: Category[] }>("/categories.php");
  return data.categories;
}
