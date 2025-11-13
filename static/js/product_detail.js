document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const nameEl = document.getElementById("product-name");
    const authorEl = document.getElementById("product-author");
    const editorialEl = document.getElementById("product-editorial");
    const descEl = document.getElementById("product-description");
    const priceEl = document.getElementById("product-price");
    const stockEl = document.getElementById("product-stock");
    const imgEl = document.getElementById("product-image");
    const typeEl = document.getElementById("product-type");

    if (!productId) {
        nameEl.textContent = "Producto no encontrado";
        return;
    }

    try {
        const res = await fetch(`/api/product/${productId}`);
        const product = await res.json();

        if (product.error) {
            nameEl.textContent = "Producto no encontrado.";
            return;
        }

        // Asignar valores al DOM
        nameEl.textContent = product.nombre;
        authorEl.textContent = product.autor;
        editorialEl.textContent = product.editorial;
        descEl.textContent = product.descripcion || "Sin descripción disponible.";
        priceEl.textContent = product.precio.toFixed(2);
        stockEl.textContent = product.cantidad;
        typeEl.textContent = product.tipo_producto;
        imgEl.src = product.imagen_url || "../static/images/no-image.png";
        imgEl.alt = product.nombre;

    } catch (error) {
        nameEl.textContent = "Error al cargar el producto.";
        console.error(error);
    }

    // Control de cantidad
    const quantityEl = document.getElementById("quantity");
    let quantity = 1;

    document.getElementById("increase").addEventListener("click", () => {
        quantity++;
        quantityEl.textContent = quantity;
    });

    document.getElementById("decrease").addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            quantityEl.textContent = quantity;
        }
    });

    document.getElementById("add-to-cart").addEventListener("click", () => {
        alert(`Agregado ${quantity} unidad(es) de "${nameEl.textContent}" al carrito 🛒`);
    });
});
