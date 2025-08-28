const apiUrl = "https://pokeapi.co/api/v2/pokemon";
const limit = 10;
let offset = 0;
let total = 0;
let allPokemons = [];
let filteredPokemons = [];
let currentPage = 1;
let favorites = JSON.parse(localStorage.getItem("pokemonFavorites")) || {};

const tableBody = document.getElementById("pokemonTableBody");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const filterInput = document.getElementById("filterInput");
const favoritesOnly = document.getElementById("favoritesOnly");
const spinner = document.getElementById("spinner");
const pokemonTable = document.getElementById("pokemonTable");
const shownCount = document.getElementById("shownCount");
const totalCount = document.getElementById("totalCount");
const pokemonDetail = document.getElementById("pokemonDetail");
const detailClose = document.getElementById("detailClose");

// Cargar estado desde la URL
function loadStateFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page");
  const search = urlParams.get("search");
  const fav = urlParams.get("favorites");

  if (page) currentPage = parseInt(page);
  if (search) filterInput.value = search;
  if (fav) favoritesOnly.checked = fav === "true";
}

// Actualizar la URL con el estado actual
function updateURL() {
  const urlParams = new URLSearchParams();
  urlParams.set("page", currentPage);
  if (filterInput.value) urlParams.set("search", filterInput.value);
  if (favoritesOnly.checked) urlParams.set("favorites", "true");

  const newURL = window.location.pathname + "?" + urlParams.toString();
  window.history.replaceState({}, "", newURL);
}

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
      const urlParts = pokemon.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 2]);
      return {
        ...pokemon,
        id: id,
      };
    });

    // Cargar estado desde la URL
    loadStateFromURL();

    // Aplicar filtros
    applyFilters();

    showSpinner(false);
    renderTable();
    updatePagination();
    updateURL();
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    tableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="no-results">
                            <i class="fas fa-exclamation-circle"></i>
                            <div>Error al cargar los datos. Intenta nuevamente.</div>
                        </td>
                    </tr>
                `;
    showSpinner(false);
  }
}

function applyFilters() {
  let result = [...allPokemons];

  // Aplicar filtro de búsqueda
  const searchTerm = filterInput.value.trim().toLowerCase();
  if (searchTerm) {
    result = result.filter((p) => p.name.toLowerCase().includes(searchTerm));
  }

  // Aplicar filtro de favoritos
  if (favoritesOnly.checked) {
    result = result.filter((p) => favorites[p.id]);
  }

  filteredPokemons = result;
  shownCount.textContent = filteredPokemons.length;

  // Ajustar página actual si es necesario
  const totalPages = Math.ceil(filteredPokemons.length / limit) || 1;
  if (currentPage > totalPages) {
    currentPage = totalPages || 1;
  }
}

function renderTable() {
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const pokemonsToShow = filteredPokemons.slice(start, end);

  if (filteredPokemons.length === 0) {
    tableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="no-results">
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
                <tr data-id="${pokemon.id}">
                    <td class="id-cell">#${pokemon.id
                      .toString()
                      .padStart(3, "0")}</td>
                    <td class="name-cell">${
                      pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)
                    }</td>
                    <td class="favorite-cell">
                        <button class="favorite-btn ${
                          favorites[pokemon.id] ? "active" : ""
                        }" data-id="${pokemon.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </td>
                </tr>
            `
    )
    .join("");

  // Agregar event listeners
  document.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.id);
    });
  });

  document.querySelectorAll("tr[data-id]").forEach((row) => {
    row.addEventListener("click", () => {
      showPokemonDetail(row.dataset.id);
    });
  });
}

function toggleFavorite(pokemonId) {
  if (favorites[pokemonId]) {
    delete favorites[pokemonId];
  } else {
    favorites[pokemonId] = true;
  }

  // Guardar en localStorage
  localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));

  // Si estamos en modo "solo favoritos", aplicar filtros
  if (favoritesOnly.checked) {
    applyFilters();
    renderTable();
    updatePagination();
  } else {
    // Solo actualizar el botón de favorito
    const btn = document.querySelector(`.favorite-btn[data-id="${pokemonId}"]`);
    if (btn) {
      btn.classList.toggle("active", favorites[pokemonId]);
    }
  }

  updateURL();
}

async function showPokemonDetail(pokemonId) {
  try {
    const response = await fetch(`${apiUrl}/${pokemonId}`);
    const pokemon = await response.json();

    // Actualizar el modal con la información
    document.getElementById("detailName").textContent =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById("detailId").textContent = `#${pokemon.id
      .toString()
      .padStart(3, "0")}`;
    document.getElementById("detailHeight").textContent = `${
      pokemon.height / 10
    }m`;
    document.getElementById("detailWeight").textContent = `${
      pokemon.weight / 10
    }kg`;
    document.getElementById("detailImage").src =
      pokemon.sprites.other["official-artwork"].front_default;

    // Mostrar tipos
    const typesContainer = document.getElementById("detailTypes");
    typesContainer.innerHTML = "";
    pokemon.types.forEach((type) => {
      const span = document.createElement("span");
      span.className = "type-badge";
      span.style.backgroundColor = getTypeColor(type.type.name);
      span.textContent =
        type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
      typesContainer.appendChild(span);
    });

    // Mostrar estadísticas
    const statsContainer = document.getElementById("detailStats");
    statsContainer.innerHTML = "";
    pokemon.stats.forEach((stat) => {
      const statRow = document.createElement("div");
      statRow.className = "stat-row";

      const statName = document.createElement("div");
      statName.className = "stat-name";
      statName.textContent =
        stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1);

      const statValue = document.createElement("div");
      statValue.className = "stat-value";

      const statBar = document.createElement("div");
      statBar.className = "stat-bar";

      const statBarFill = document.createElement("div");
      statBarFill.className = "stat-bar-fill";
      statBarFill.style.width = `${Math.min(100, stat.base_stat / 2)}%`;

      statBar.appendChild(statBarFill);
      statValue.appendChild(statBar);
      statValue.innerHTML += ` ${stat.base_stat}`;

      statRow.appendChild(statName);
      statRow.appendChild(statValue);
      statsContainer.appendChild(statRow);
    });

    // Mostrar el modal
    pokemonDetail.style.display = "block";
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    alert("Error al cargar los detalles del Pokémon");
  }
}

function getTypeColor(type) {
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
}

function updatePagination() {
  const totalPages = Math.ceil(filteredPokemons.length / limit) || 1;
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function goToPage(page) {
  currentPage = page;
  renderTable();
  updatePagination();
  updateURL();
}

// Event Listeners
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredPokemons.length / limit) || 1;
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
});

filterInput.addEventListener("input", () => {
  applyFilters();
  goToPage(1);
});

favoritesOnly.addEventListener("change", () => {
  applyFilters();
  goToPage(1);
});

detailClose.addEventListener("click", () => {
  pokemonDetail.style.display = "none";
});

// Cerrar modal al hacer clic fuera
pokemonDetail.addEventListener("click", (e) => {
  if (e.target === pokemonDetail) {
    pokemonDetail.style.display = "none";
  }
});

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
  fetchAllPokemons();
});
