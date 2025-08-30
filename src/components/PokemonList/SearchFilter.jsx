import React from "react";

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavorites,
}) {
  return (
    <div className="flex justify-between items-center mb-4 gap-4">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 p-2 border rounded-md"
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="checkbox"
          id="favorites"
          checked={showFavoritesOnly}
          onChange={(e) => onToggleFavorites(e.target.checked)}
        />
        <label htmlFor="favorites" className="text-sm">
          Show Favorites Only
        </label>
      </div>
    </div>
  );
}
