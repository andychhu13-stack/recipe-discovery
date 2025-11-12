# Recipe Discovery

Cookbook-style Next.js app for exploring and saving recipes from [TheMealDB](https://www.themealdb.com/).

## Stack

- Next.js 14 (App Router) with TypeScript
- Tailwind CSS for styling
- Heroicons for UI icons

## Getting Started

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

> ℹ️ The project fetches directly from TheMealDB. No API key is required.

## Features

- **Keyword Search**: Search recipes by ingredient, cuisine, or meal name
- **Infinite Scroll**: Empty searches load recipes progressively by category as you scroll for better performance
- **Filtering**: Category and region filters work on search results and saved recipes. Region options update dynamically based on available results
- **Responsive Grid**: Results display in a responsive grid (1–3 columns) with images, tags, and quick source links
- **Recipe Details**: Clicking a card opens a modal with full ingredients list, step-by-step instructions, and video/source links
- **Bookmarking**: localStorage-backed bookmarks persist across sessions. A toggle switches between search results and saved recipes. New searches automatically exit saved-view mode
- **UX Enhancements**: Dark theme, loading skeletons, empty states, error handling, and responsive breakpoints

## Project Structure

- `app/` – Next.js App Router entry points (`page.tsx`, shared layout, global styles)
- `components/` – UI building blocks such as `SearchBar`, `RecipeCard`, and `RecipeDetail`
- `lib/` – Type definitions and MealDB fetch helpers

## Implementation Details

### Feature Rationale

**Search & Discovery**: Keyword search queries TheMealDB by ingredient, cuisine, or meal name. Results display in a responsive grid with images and metadata. Clicking a card opens a modal with ingredients, instructions, and source/YouTube links.

**Infinite Scrolling**: For empty searches, recipes are loaded progressively by category as the user scrolls. This improves initial load performance by fetching only what's needed, rather than loading all recipes at once.

**Filtering**: Category and region filters work on both search results and saved recipes. Region options update dynamically based on available results, providing a seamless filtering experience.

**Bookmarking**: localStorage-backed bookmarks persist across sessions without requiring user accounts. A toggle switches between search results and saved recipes. New searches automatically exit saved-view mode to show fresh results.

**UX**: Dark theme optimized for evening cooking sessions, loading skeletons for better perceived performance, comprehensive empty states, robust error handling, and responsive breakpoints for all device sizes.

## Outside Resources

**TheMealDB API**: Used `/search.php?s={query}` for searches, `/categories.php` for filter options, `/filter.php?c={category}` for category-based recipe fetching, and `/lookup.php?i={id}` for detailed recipe information.

**Next.js 14**: App Router patterns, `next/image` optimization for recipe thumbnails, and image domain configuration in `next.config.mjs`.

**Tailwind CSS & Heroicons**: Styling utilities and icon set for consistent UI components.

**ChatGPT**: Used exclusively for debugging assistance and project documentation.
