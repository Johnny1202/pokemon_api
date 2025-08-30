import React from "react";
import FavoriteButton from "../FavoriteButton";

export default function PokemonRow({ pokemon, isFavorite, onToggleFavorite, onSelect }) {
  return (
    <tr className="cursor-pointer hover:bg-gray-50" onClick={() => onSelect(pokemon.id)}>
      <td className="p-3 text-left">{pokemon.id}</td>
      <td className="p-3 text-left capitalize">{pokemon.name}</td>
      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton 
          isFavorite={isFavorite} 
          onClick={() => onToggleFavorite(pokemon.id)} 
        />
      </td>
    </tr>
  );
}
