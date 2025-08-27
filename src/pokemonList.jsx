import React, { useEffect, useState } from "react";
import './PokemonList.css';

function PokemonList() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const pokemonsPerPage = 10;

  // Cargar todos los pokemones una sola vez
  useEffect(() => {
    setLoading(true);
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((response) => response.json())
      .then((data) => {
        setAllPokemons(data.results);
        setLoading(false);
      });
  }, []);

  // Filtrar globalmente
  const filteredPokemons = allPokemons.filter((poke) =>
    poke.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calcular paginación sobre el filtrado
  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
  const startIndex = (currentPage - 1) * pokemonsPerPage;
  const paginatedPokemons = filteredPokemons.slice(startIndex, startIndex + pokemonsPerPage);

  // Si cambia el filtro, vuelve a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Spinner y espacio reservado para evitar layout shift
  return (
    <div className="pokemon-list-container">
      <h1 className="titulo">Pokemones</h1>
      <input
        type="text"
        placeholder="Filtrar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="filtro-busqueda"
      />
      <div style={{ minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loading ? (
          <div className="spinner" style={{ color: "#FFCB05", fontWeight: "bold" }}>Cargando...</div>
        ) : (
          <table className="pokemon-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPokemons.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>No se encontraron pokemones</td>
                </tr>
              ) : (
                paginatedPokemons.map((poke, idx) => (
                  <tr key={poke.name}>
                    <td>{startIndex + idx + 1}</td>
                    <td style={{ textTransform: "capitalize" }}>{poke.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="paginacion">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading || paginatedPokemons.length === 0}
        >
          Anterior
        </button>
        <span> Página {totalPages === 0 ? 0 : currentPage} de {totalPages} </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading || paginatedPokemons.length === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default PokemonList;