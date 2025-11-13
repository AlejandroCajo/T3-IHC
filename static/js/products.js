document.addEventListener('DOMContentLoaded', () => {

    // Precio fijo de envío (Manejado por el backend después)
    const SHIPPING_COST = 10.00;

    /**
     * FUNCIÓN CENTRAL: Recalcula todos los valores del resumen del pedido.
     */
    const updateCartSummary = () => {
        let subtotal = 0;
        // Selecciona solo los ítems visibles (no eliminados)
        const visibleItems = document.querySelectorAll('.cart-item:not([style*="display: none"])');
        
        visibleItems.forEach(item => {
            const priceElement = item.querySelector('.item-actions .detail-price');
            if (priceElement) {
                const totalText = priceElement.textContent.replace('S/ ', '').trim();
                const total = parseFloat(totalText);
                
                if (!isNaN(total)) {
                    subtotal += total;
                }
            }
        });

        // Lógica de Envío: Solo se cobra si hay productos (Subtotal > 0).
        let finalShippingCost = 0;
        let totalToPay = 0;
        
        if (subtotal > 0) {
            finalShippingCost = SHIPPING_COST;
            totalToPay = subtotal + finalShippingCost;
        } 

        // 1. ACTUALIZAR EL SUBTOTAL Y EL CONTADOR DE PRODUCTOS
        const summarySubtotal = document.querySelector('.cart-summary .summary-item:first-child span:last-child');
        const summaryItemCount = document.querySelector('.cart-summary .summary-item:first-child span:first-child');
        
        if (summarySubtotal) {
            summarySubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
        }
        if (summaryItemCount) {
            // Esto asegura que el texto se actualice dinámicamente.
            summaryItemCount.textContent = `Subtotal (${visibleItems.length} producto${visibleItems.length !== 1 ? 's' : ''})`;
        }

        // 2. Actualizar el costo de Envío
        const summaryShippingCost = document.querySelector('.cart-summary .summary-item:nth-child(2) span:last-child');
        if (summaryShippingCost) {
            summaryShippingCost.textContent = `S/ ${finalShippingCost.toFixed(2)}`;
        }

        // 3. Actualizar el TOTAL
        const summaryTotalValue = document.querySelector('.cart-summary .summary-total span:last-child');
        
        if (summaryTotalValue) {
            summaryTotalValue.textContent = `S/ ${totalToPay.toFixed(2)}`;
        }

        // 4. Actualizar botones de pago
        const checkoutButton = document.querySelector('.btn-primary[href="checkout.html"]'); 
        const finalPayButton = document.querySelector('.checkout-page button.btn-primary'); 

        // Botón en la página del carrito
        if (checkoutButton) {
            if (totalToPay === 0) {
                 checkoutButton.classList.add('btn-secondary'); 
                 checkoutButton.classList.remove('btn-primary');
                 checkoutButton.textContent = 'Tu Carrito Está Vacío';
                 checkoutButton.href = '#'; 
            } else {
                 checkoutButton.classList.add('btn-primary');
                 checkoutButton.classList.remove('btn-secondary');
                 checkoutButton.textContent = 'Proceder al Pago';
                 checkoutButton.href = 'checkout.html';
            }
        }
        
        // Botón en la página de checkout
        if (finalPayButton) {
            if (totalToPay === 0) {
                finalPayButton.disabled = true;
                finalPayButton.textContent = 'No hay nada que pagar';
            } else {
                finalPayButton.disabled = false;
                finalPayButton.textContent = `Confirmar Pedido y Pagar S/ ${totalToPay.toFixed(2)}`;
            }
        }
    };

    // --- LÓGICA DE DETALLE DE PRODUCTO (quantity-control en product_detail.html) ---
    const productDetailPage = document.querySelector('.product-detail-page');
    if (productDetailPage) {
        const quantityControlDetail = productDetailPage.querySelector('.quantity-control');
        const addToCartBtn = productDetailPage.querySelector('.add-to-cart-btn');

        if (quantityControlDetail) {
            const minusBtn = quantityControlDetail.querySelector('#minusBtn');
            const plusBtn = quantityControlDetail.querySelector('#plusBtn');
            // La variable quantitySpan es necesaria para leer el valor
            const quantitySpan = quantityControlDetail.querySelector('#quantity'); 
            
            if (minusBtn && plusBtn && quantitySpan) {
                let quantity = parseInt(quantitySpan.textContent);

                minusBtn.addEventListener('click', () => {
                    if (quantity > 1) {
                        quantity--;
                        quantitySpan.textContent = quantity;
                    }
                });

                plusBtn.addEventListener('click', () => {
                    quantity++;
                    quantitySpan.textContent = quantity;
                });
            }
        }
        
        // LÓGICA DE AÑADIR AL CARRITO: Ahora solo redirige. El backend se encargará de añadir.
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (event) => {
                event.preventDefault();
                // Aquí el backend tomaría el valor de quantitySpan y haría la llamada.
                // Nosotros solo redirigimos a la página del carrito:
                window.location.href = 'cart.html';
            });
        }
    }


    // --- LÓGICA DE CARRITO (Eliminar y Cantidad en cart.html) ---
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        
        const removeLink = item.querySelector('.item-actions a');
        const minusBtn = item.querySelector('.item-quantity .quantity-control button:first-child');
        const plusBtn = item.querySelector('.item-quantity .quantity-control button:last-child');
        const quantitySpan = item.querySelector('.item-quantity .quantity-control span');
        const priceElement = item.querySelector('.item-actions .detail-price');
        
        // Extraer precio unitario
        const unitPriceText = item.querySelector('.item-details p') ? item.querySelector('.item-details p').textContent : "S/ 0.00 c/u";
        const unitPrice = parseFloat(unitPriceText.replace('S/ ', '').replace(' c/u', ''));
        
        // Función para recalcular total del item y el resumen
        const updateItemTotal = () => {
            let quantity = parseInt(quantitySpan.textContent);
            const newTotal = (quantity * unitPrice).toFixed(2);
            priceElement.textContent = `S/ ${newTotal}`;
            updateCartSummary(); 
        };

        // 1. Funcionalidad de Eliminación
        if (removeLink) {
            removeLink.addEventListener('click', (event) => {
                event.preventDefault();
                item.style.opacity = 0;
                item.style.height = 0;
                item.style.marginBottom = 0;
                item.style.paddingTop = 0;
                item.style.paddingBottom = 0;
                item.style.borderBottom = 'none';
                
                setTimeout(() => {
                    item.style.display = 'none'; 
                    updateCartSummary(); 
                }, 300);
            });
        }
        
        // 2. Funcionalidad de Cantidad (Aumentar/Restar)
        if (minusBtn && plusBtn && quantitySpan && priceElement && unitPrice) {

            minusBtn.addEventListener('click', () => {
                let quantity = parseInt(quantitySpan.textContent);
                if (quantity > 1) {
                    quantity--;
                    quantitySpan.textContent = quantity;
                    updateItemTotal();
                }
            });

            plusBtn.addEventListener('click', () => {
                let quantity = parseInt(quantitySpan.textContent);
                quantity++;
                quantitySpan.textContent = quantity;
                updateItemTotal();
            });
        }
    });

    // INICIALIZACIÓN: Ejecuta el resumen al cargar la página para actualizar el contador inicial.
    if (document.querySelector('.cart-page')) {
        updateCartSummary();
    }


    // --- LÓGICA DE BÚSQUEDA Y CATEGORÍAS ---

    // LÓGICA DE BÚSQUEDA (Eliminar búsqueda reciente)
    const searchHistoryItems = document.querySelectorAll('.search-history-item button');
    searchHistoryItems.forEach(button => {
        if (button.textContent.trim() === '✕' || button.textContent.trim() === 'x' || button.textContent.trim() === '×') {
             button.addEventListener('click', () => {
                const parentItem = button.closest('.search-history-item');
                if (parentItem) {
                    parentItem.style.opacity = 0;
                    setTimeout(() => parentItem.remove(), 200);
                }
            });
        }
    });






    // static/js/products.js
document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");

    try {
        const res = await fetch("/api/products");
        const products = await res.json();

        products.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.dataset.id = p.id;
            card.innerHTML = `
                <img src="${p.imagen_url}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.autor}</p>
                <p>S/ ${p.precio}</p>
            `;
            
            // al hacer clic, redirige al detalle
            card.addEventListener("click", () => {
                window.location.href = `/templates/product_detail.html?id=${p.id}`;
            });

            productList.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
});




    // LÓGICA DE CATEGORÍAS (Redirección/Simulación)
    const categoryNav = document.querySelector('.category-nav');
    if (categoryNav) {
        const categoryLinks = categoryNav.querySelectorAll('a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                
                categoryLinks.forEach(l => l.classList.remove('active-category'));
                link.classList.add('active-category');
            });
        });
    }

});
