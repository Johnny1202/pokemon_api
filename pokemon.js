const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
const limit = 10;
let offset = 0;
let total = 0;
let allPokemons = []; // Lista global de todos los pokemones
let filteredPokemons = []; // Lista filtrada
let currentPage = 1;

const tableBody = document.getElementById('pokemonTableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const filterInput = document.getElementById('filterInput');
const spinner = document.getElementById('spinner');

function showSpinner(show) {
    spinner.style.display = show ? 'block' : 'none';
}

async function fetchAllPokemons() {
    showSpinner(true);
    // Primero obtenemos el total de pokemones
    const res = await fetch(`${apiUrl}?limit=1`);
    const data = await res.json();
    total = data.count;
    // Ahora traemos todos los pokemones (solo nombre y url)
    const resAll = await fetch(`${apiUrl}?limit=${total}`);
    const dataAll = await resAll.json();
    allPokemons = dataAll.results;
    filteredPokemons = allPokemons;
    showSpinner(false);
    renderTable();
    updatePagination();
}

function renderTable() {
    // Calcula el offset según la página actual y el filtro
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const pokemonsToShow = filteredPokemons.slice(start, end);

    // Si no hay resultados
    if (filteredPokemons.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="2">No se encontraron pokemones</td></tr>`;
        return;
    }

    tableBody.innerHTML = pokemonsToShow.map((p, i) => `
        <tr>
            <td>${start + i + 1}</td>
            <td>${p.name}</td>
        </tr>
    `).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredPokemons.length / limit) || 1;
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

prevBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination();
    }
};

nextBtn.onclick = () => {
    const totalPages = Math.ceil(filteredPokemons.length / limit) || 1;
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePagination();
    }
};

filterInput.oninput = () => {
    const filter = filterInput.value.trim().toLowerCase();
    filteredPokemons = allPokemons.filter(p => p.name.includes(filter));
    currentPage = 1;
    renderTable();
    updatePagination();
};

// Inicializar
fetchAllPokemons();