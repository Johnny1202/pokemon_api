import React from "react";

export default function FavoriteButton({ isFavorite, onClick }) {
  return (
    <button
      className={`h-8 w-8 rounded-full flex items-center justify-center transition-all 
        ${isFavorite 
          ? "bg-red-100 text-red-500 scale-110" 
          : "bg-gray-200 hover:bg-gray-300 text-gray-400"}`
      }
      onClick={onClick}
    >
      {isFavorite ? "❤️" : ""}
    </button>
  );
}
