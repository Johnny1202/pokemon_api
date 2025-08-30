import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchAllPokemons } from "../../api/pokemonApi";
import PokemonRow from "./PokemonRow";
import SearchFilter from "./SearchFilter";
import Pagination from "../Pagination";

export default function PokemonList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("pokemonFavorites")) || {}
  );
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const searchTerm = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pokemonsPerPage = 10;

  const updateSearchParams = useCallback(
    (updates) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      const data = await fetchAllPokemons();
      setPokemons(data);
      setLoading(false);
    };
    loadPokemons();
  }, []);

  useEffect(() => {
    localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let result = pokemons;
    if (searchTerm)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (showFavoritesOnly) result = result.filter((p) => favorites[p.id]);
    setFilteredPokemons(result);

    const totalPages = Math.ceil(result.length / pokemonsPerPage);
    if (currentPage > totalPages && totalPages > 0)
      updateSearchParams({ page: 1 });
  }, [
    pokemons,
    favorites,
    showFavoritesOnly,
    searchTerm,
    currentPage,
    updateSearchParams,
  ]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goToDetails = (id) => {
    navigate(`/pokemon/${id}`, {
      state: {
        returnPage: currentPage,
        returnSearch: searchTerm,
        returnFavorites: showFavoritesOnly,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-blue-100 p-4">
      <div className="container mx-auto max-w-3xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mt-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-red-600 drop-shadow-sm mb-4">
          Pokédex Advanced
        </h1>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(value) =>
            updateSearchParams({ search: value, page: 1 })
          }
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={setShowFavoritesOnly}
        />

        <div className="mb-2 text-gray-700 text-sm">
          Showing{" "}
          {
            filteredPokemons.slice(
              (currentPage - 1) * pokemonsPerPage,
              currentPage * pokemonsPerPage
            ).length
          }{" "}
          of {filteredPokemons.length} Pokémon (Total: {pokemons.length})
        </div>

        <table className="w-full rounded-lg border overflow-hidden min-h-[450px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">ID</th>
              <th className="p-3 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="p-3 text-center font-semibold text-gray-700">❤</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
                  Loading Pokémon...
                </td>
              </tr>
            ) : filteredPokemons.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
                  No Pokémon found.
                </td>
              </tr>
            ) : (
              filteredPokemons
                .slice(
                  (currentPage - 1) * pokemonsPerPage,
                  currentPage * pokemonsPerPage
                )
                .map((pokemon) => (
                  <PokemonRow
                    key={pokemon.id}
                    pokemon={pokemon}
                    isFavorite={favorites[pokemon.id]}
                    onToggleFavorite={toggleFavorite}
                    onSelect={goToDetails}
                  />
                ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredPokemons.length}
          itemsPerPage={pokemonsPerPage}
          onPageChange={(page) => updateSearchParams({ page })}
        />
      </div>
    </div>
  );
}
