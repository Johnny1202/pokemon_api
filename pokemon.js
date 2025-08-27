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
const tableContainer = document.getElementById("tableContainer");
const totalPokemons = document.getElementById("totalPokemons");

function showSpinner(show) {
  if (show) {
    tableContainer.classList.remove("table-loaded");
  } else {
    tableContainer.classList.add("table-loaded");
  }
}

async function fetchAllPokemons() {
  showSpinner(true);

  try {
    // Obtener el total de pokemones
    const res = await fetch(`${apiUrl}?limit=1`);
    const data = await res.json();
    total = data.count;
    totalPokemons.textContent = total;

    // Traer todos los pokemones
    const resAll = await fetch(`${apiUrl}?limit=${total}`);
    const dataAll = await resAll.json();
    allPokemons = dataAll.results;
    filteredPokemons = allPokemons;

    showSpinner(false);
    renderTable();
    updatePagination();
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    spinner.innerHTML =
      '<div class="no-results">Error al cargar los datos. Intenta nuevamente.</div>';
  }
}

function renderTable() {
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const pokemonsToShow = filteredPokemons.slice(start, end);

  if (filteredPokemons.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="2" class="no-results">No se encontraron pokemones</td></tr>`;
    return;
  }

  tableBody.innerHTML = pokemonsToShow
    .map(
      (p, i) => `
                <tr>
                    <td>${start + i + 1}</td>
                    <td>${p.name.charAt(0).toUpperCase() + p.name.slice(1)}</td>
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
  filteredPokemons = allPokemons.filter((p) => p.name.includes(filter));
  currentPage = 1;
  renderTable();
  updatePagination();
  totalPokemons.textContent = filteredPokemons.length;
});

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
  fetchAllPokemons();

  // Asegurarse de que los botones sean visibles
  prevBtn.style.visibility = "visible";
  nextBtn.style.visibility = "visible";
});
