import React from "react";

export default function SearchFilter({ searchTerm, onSearchChange, showFavoritesOnly, onToggleFavorites }) {
  return (
    <div className="flex justify-between items-center mb-4 gap-4">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 p-2 border rounded-md"
      />
        {/* Checkbox de favoritos */}
      <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
        <div className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => onToggleFavorites(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${showFavoritesOnly ? 'bg-indigo-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 transform ${showFavoritesOnly ? 'translate-x-5' : ''}`}></div>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700">Show Favorites Only</span>
      </label>
    </div>
  );
}