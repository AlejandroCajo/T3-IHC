document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-input");
    const button = document.getElementById("search-btn");
    const resultsDiv = document.getElementById("search-results");

    async function buscar() {
        const q = input.value.trim();
        if (!q) {
            resultsDiv.innerHTML = "<p>Escribe algo para buscar.</p>";
            return;
        }

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const productos = await res.json();

            if (productos.length === 0) {
                resultsDiv.innerHTML = "<p>No se encontraron productos.</p>";
                return;
            }

            resultsDiv.innerHTML = productos.map(p => `
                <div class="product-card" data-id="${p.id}">
                    <img src="${p.imagen_url}" alt="${p.nombre}">
                    <div class="card-body">
                        <h3 class="card-title">${p.nombre}</h3>
                        <p>${p.autor || ''}</p>
                        <p class="text-price">S/ ${p.precio}</p>
                    </div>
                </div>
            `).join("");

            // Evento click para abrir el detalle
            document.querySelectorAll(".product-card").forEach(card => {
                card.addEventListener("click", () => {
                    const id = card.getAttribute("data-id");
                    window.location.href = `/templates/product_detail.html?id=${id}`;
                });
            });
        } catch (error) {
            console.error("Error al buscar productos:", error);
            resultsDiv.innerHTML = "<p>Error al realizar la búsqueda.</p>";
        }
    }

    button.addEventListener("click", buscar);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscar();
    });
});
