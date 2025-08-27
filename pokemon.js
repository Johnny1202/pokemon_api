const apiUrl = "https://pokeapi.co/api/v2/pokemon";
const limit = 10;
let offset = 0;
let total = 0;
let allPokemons = [];
let filteredPokemons = [];
let currentPage = 1;

const tableBody = document.getElementById("pokemonTableBody");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const filterInput = document.getElementById("filterInput");
const spinner = document.getElementById("spinner");
const pokemonTable = document.getElementById("pokemonTable");
const shownCount = document.getElementById("shownCount");
const totalCount = document.getElementById("totalCount");

function showSpinner(show) {
  spinner.style.display = show ? "flex" : "none";
  pokemonTable.style.visibility = show ? "hidden" : "visible";
}

async function fetchAllPokemons() {
  showSpinner(true);

  try {
    // Obtener el total de pokemones
    const res = await fetch(`${apiUrl}?limit=1`);
    const data = await res.json();
    total = data.count;
    totalCount.textContent = total;

    // Traer todos los pokemones
    const resAll = await fetch(`${apiUrl}?limit=${total}`);
    const dataAll = await resAll.json();

    // Guardar con ID real
    allPokemons = dataAll.results.map((pokemon, index) => {
      // Extraer el ID de la URL
      const urlParts = pokemon.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 2]);
      return {
        ...pokemon,
        id: id,
      };
    });

    filteredPokemons = allPokemons;
    shownCount.textContent = filteredPokemons.length;

    showSpinner(false);
    renderTable();
    updatePagination();
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    tableBody.innerHTML = `
                    <tr>
                        <td colspan="2" class="no-results">
                            <i class="fas fa-exclamation-circle"></i>
                            <div>Error al cargar los datos. Intenta nuevamente.</div>
                        </td>
                    </tr>
                `;
    showSpinner(false);
  }
}

function renderTable() {
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const pokemonsToShow = filteredPokemons.slice(start, end);

  if (filteredPokemons.length === 0) {
    tableBody.innerHTML = `
                    <tr>
                        <td colspan="2" class="no-results">
                            <i class="fas fa-search"></i>
                            <div>No se encontraron Pokémon</div>
                        </td>
                    </tr>
                `;
    return;
  }

  tableBody.innerHTML = pokemonsToShow
    .map(
      (pokemon) => `
                <tr>
                    <td class="id-cell">#${pokemon.id
                      .toString()
                      .padStart(3, "0")}</td>
                    <td class="name-cell">${
                      pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)
                    }</td>
                </tr>
            `
    )
    .join("");
}

function updatePagination() {
  const totalPages = Math.ceil(filteredPokemons.length / limit) || 1;
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    updatePagination();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredPokemons.length / limit) || 1;
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
    updatePagination();
  }
});

filterInput.addEventListener("input", () => {
  const filter = filterInput.value.trim().toLowerCase();
  filteredPokemons = allPokemons.filter((p) =>
    p.name.toLowerCase().includes(filter)
  );
  currentPage = 1;
  shownCount.textContent = filteredPokemons.length;
  renderTable();
  updatePagination();
});

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
  fetchAllPokemons();
});
