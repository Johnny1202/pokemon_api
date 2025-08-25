 const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
        const limit = 10;
        let offset = 0;
        let total = 0;
        let pokemons = [];

        const tableBody = document.getElementById('pokemonTableBody');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageInfo = document.getElementById('pageInfo');
        const filterInput = document.getElementById('filterInput');

        async function fetchPokemons() {
            const res = await fetch(`${apiUrl}?limit=${limit}&offset=${offset}`);
            const data = await res.json();
            pokemons = data.results;
            total = data.count;
            renderTable();
            updatePagination();
        }

        function renderTable() {
            const filter = filterInput.value.trim().toLowerCase();
            const filtered = pokemons.filter(p => p.name.includes(filter));
            tableBody.innerHTML = filtered.map((p, i) => `
                <tr>
                    <td>${offset + i + 1}</td>
                    <td>${p.name}</td>
                </tr>
            `).join('');
        }

        function updatePagination() {
            const currentPage = Math.floor(offset / limit) + 1;
            const totalPages = Math.ceil(total / limit);
            pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
            prevBtn.disabled = offset === 0;
            nextBtn.disabled = offset + limit >= total;
        }

        prevBtn.onclick = () => {
            if (offset >= limit) {
                offset -= limit;
                fetchPokemons();
            }
        };

        nextBtn.onclick = () => {
            if (offset + limit < total) {
                offset += limit;
                fetchPokemons();
            }
        };

        filterInput.oninput = renderTable;

        // Inicializar
        fetchPokemons();