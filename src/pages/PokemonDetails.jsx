import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPokemonById } from "../api/pokemonApi";

export default function PokemonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);

  const getTypeColor = (type) => {
    const typeColors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return typeColors[type] || "#68A090";
  };

  useEffect(() => {
    const loadPokemon = async () => {
      const data = await fetchPokemonById(id);
      setPokemon(data);
    };
    loadPokemon();
  }, [id]);

  if (!pokemon) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <button className="mb-4 text-blue-600 hover:underline" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <div className="text-center">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="mx-auto w-40 h-40"
          />
          <h1 className="text-3xl font-bold capitalize text-gray-800">{pokemon.name}</h1>
          <p className="text-gray-500">#{pokemon.id}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Type</h2>
          <div className="flex gap-2 mt-2">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: getTypeColor(t.type.name), color: "#fff" }}
              >
                {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Stats</h2>
          <ul className="mt-2 space-y-2">
            {pokemon.stats.map((s) => (
              <li key={s.stat.name} className="flex justify-between">
                <span className="capitalize">{s.stat.name}</span>
                <span className="font-medium">{s.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
