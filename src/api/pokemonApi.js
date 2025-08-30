export async function fetchAllPokemons() {
  // Primero obtenemos el total
  const resCount = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
  const totalData = await resCount.json();
  const total = totalData.count;

  // Ahora traemos todos los Pokémon de golpe
  const resAll = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${total}`);
  const dataAll = await resAll.json();

  // Devolvemos con IDs
  return dataAll.results.map((pokemon) => {
    const urlParts = pokemon.url.split("/");
    const id = parseInt(urlParts[urlParts.length - 2]);
    return { ...pokemon, id };
  });
}

export async function fetchPokemonById(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching Pokémon by ID:", err);
    return null;
  }
}
