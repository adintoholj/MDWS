const app = (() => {

    const API = {
        products: "/api/products",
        addToCart: "/api/cart/add",
        getCart: "/api/cart",              // /{userId}
        checkout: "/api/orders/checkout"
    };

    const USER_ID = 1;

    // =====================
    // PRODUCTS LIST
    // =====================
    function loadProducts() {
        const container = document.querySelector(".products");
        if (!container) return;

        fetch(API.products)
            .then(r => r.json())
            .then(products => {
                console.log("PRODUCTS FROM API:", products); // DEBUG

                container.innerHTML = "";

                products.forEach(p => {
                    container.innerHTML += `
                        <article class="card product">
                            <div class="thumb">Slika</div>
                            <h3>${p.name}</h3>
                            <p class="muted">Brend: ${p.brand} · ${p.price} KM</p>
                            <div class="row">
                                <button class="btn" onclick="app.addToCart(${p.id})">
                                    Dodaj u korpu
                                </button>
                            </div>
                        </article>
                    `;
                });
            })
            .catch(err => console.error("LOAD PRODUCTS ERROR:", err));
    }

    // =====================
    // CART
    // =====================
    function addToCart(productId) {
        fetch(API.addToCart, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: USER_ID,
                productId: productId,
                quantity: 1
            })
        }).then(() => loadCart());
    }

    function loadCart() {
        const list = document.getElementById("cartItems");
        if (!list) return;

        fetch(`${API.getCart}/${USER_ID}`)
            .then(r => r.json())
            .then(items => {
                list.innerHTML = "";

                if (items.length === 0) {
                    list.innerHTML = "<p class='muted'>Korpa je prazna.</p>";
                    updateCartCount(0);
                    setTotals(0);
                    return;
                }

                let subtotal = 0;

                items.forEach(i => {
                    const price = 1000; // prototip
                    subtotal += price * i.quantity;

                    list.innerHTML += `
                        <div class="row between">
                            <div>
                                <strong>Proizvod ID: ${i.productId}</strong>
                                <div class="muted">Količina: ${i.quantity}</div>
                            </div>
                        </div>
                    `;
                });

                updateCartCount(items.length);
                setTotals(subtotal);
            });
    }

    function updateCartCount(count) {
        const el = document.getElementById("cartCount");
        if (el) el.textContent = count;
    }

    function setTotals(subtotal) {
        const shipping = subtotal > 0 ? 10 : 0;
        const total = subtotal + shipping;

        const s = document.getElementById("subtotal");
        const t = document.getElementById("total");

        if (s) s.textContent = `${subtotal.toFixed(2)} KM`;
        if (t) t.textContent = `${total.toFixed(2)} KM`;
    }

    // =====================
    // CHECKOUT
    // =====================
    function checkoutBackend() {
        fetch(`${API.checkout}?userId=${USER_ID}`, { method: "POST" })
            .then(r => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(() => window.location.href = "payment-success.html")
            .catch(() => window.location.href = "payment-fail.html");
    }

    // =====================
    // INIT
    // =====================
    function init() {
        loadProducts();
        loadCart();
    }

    return {
        init,
        addToCart,
        checkoutBackend
    };

})();

document.addEventListener("DOMContentLoaded", app.init);
