import React, { useEffect, useState } from "react";
import './PokemonList.css';

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemons, setTotalPokemons] = useState(0);
  const [search, setSearch] = useState("");

  const pokemonsPerPage = 10;

  useEffect(() => {
    const offset = (currentPage - 1) * pokemonsPerPage;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerPage}&offset=${offset}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
        setTotalPokemons(data.count);
      });
  }, [currentPage]);

  const totalPages = Math.ceil(totalPokemons / pokemonsPerPage);

  // Filtra los Pokémon según el texto de búsqueda
  const filteredPokemons = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(search.toLowerCase())
  );

  const startNumber = (currentPage - 1) * pokemonsPerPage + 1;

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
      <table className="pokemon-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {filteredPokemons.map((poke, idx) => (
            <tr key={poke.name}>
              <td>{startNumber + idx}</td>
              <td style={{ textTransform: "capitalize" }}>{poke.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="paginacion">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span> Página {currentPage} de {totalPages} </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default PokemonList;