const app = (() => {
  const state = {
    cart: JSON.parse(localStorage.getItem("proto_cart") || "[]"),
    auth: JSON.parse(localStorage.getItem("proto_auth") || "null"), // { email, active:true }
  };

  function save() {
    localStorage.setItem("proto_cart", JSON.stringify(state.cart));
    localStorage.setItem("proto_auth", JSON.stringify(state.auth));
    updateCartCount();
    renderCart();
  }

  function updateCartCount() {
    const el = document.getElementById("cartCount");
    if (el) el.textContent = String(state.cart.length);
  }

  function addToCart(name) {
    state.cart.push({ name, qty: 1, price: 999 });
    alert(`Dodano u korpu: ${name}`);
    save();
  }

  function clearCart() {
    state.cart = [];
    save();
  }

  function renderCart() {
    const list = document.getElementById("cartItems");
    if (!list) return;

    if (state.cart.length === 0) {
      list.innerHTML = `<p class="muted">Korpa je prazna.</p>`;
      const subtotal = document.getElementById("subtotal");
      const total = document.getElementById("total");
      if (subtotal) subtotal.textContent = "0,00 KM";
      if (total) total.textContent = "0,00 KM";
      return;
    }

    list.innerHTML = state.cart
      .map(
        (x, idx) => `
        <div class="row between" style="border-bottom:1px solid rgba(232,238,252,.12); padding:10px 0">
          <div>
            <strong>${x.name}</strong><div class="muted">Količina: ${x.qty}</div>
          </div>
          <div class="row">
            <button class="btn" type="button" onclick="app.removeFromCart(${idx})">Ukloni</button>
          </div>
        </div>`
      )
      .join("");

    const subtotalValue = state.cart.reduce((s, x) => s + (x.price * x.qty), 0);
    const shipping = state.cart.length ? 10 : 0;
    const totalValue = subtotalValue + shipping;

    const subtotal = document.getElementById("subtotal");
    const total = document.getElementById("total");
    if (subtotal) subtotal.textContent = `${subtotalValue.toFixed(2)} KM`;
    if (total) total.textContent = `${totalValue.toFixed(2)} KM`;
  }

  function removeFromCart(idx) {
    state.cart.splice(idx, 1);
    save();
  }

  // Login prototype rules from UI:
  // - password "test" => success (active)
  // - password "inactive" => account not activated
  // - else => wrong
  function login(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    const msg = document.getElementById("loginMsg");

    if (password === "inactive") {
      if (msg) msg.textContent = "Molimo registrujte se na stranicu."; // as written in SRS
      state.auth = null;
      save();
      return false;
    }

    if (password !== "test") {
      if (msg) msg.textContent = "Pogrešan e-mail ili lozinka.";
      state.auth = null;
      save();
      return false;
    }

    state.auth = { email, active: true };
    save();
    window.location.href = "index.html";
    return false;
  }

  // Registration prototype:
  // - email "used@mail.com" => already in use
  // - else => "send verification email" => redirect to verify-email.html
  function register(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim().toLowerCase();
    const msg = document.getElementById("registerMsg");

    if (email === "used@mail.com") {
      if (msg) msg.textContent = "Ova e-mail adresa je već u upotrebi.";
      return false;
    }

    if (msg) msg.textContent = "Poslali smo verifikacijski e-mail (prototip).";
    setTimeout(() => (window.location.href = "verify-email.html"), 600);
    return false;
  }

  function submitCheckout(e) {
    e.preventDefault();

    // BP-01 auth gate
    if (!state.auth) {
      const gate = document.getElementById("authGate");
      if (gate) gate.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    // pretend inventory + payment validation OK; pick random success/fail for demo
    const ok = Math.random() > 0.2;
    window.location.href = ok ? "payment-success.html" : "payment-fail.html";
    return false;
  }

  function init() {
    updateCartCount();
    renderCart();

    // BP-01 helper: if checkout page and not logged in, show gate immediately
    if (window.location.pathname.endsWith("/checkout.html") || window.location.pathname.endsWith("checkout.html")) {
      const gate = document.getElementById("authGate");
      if (gate && !state.auth) gate.hidden = false;
    }
  }

  return {
    init,
    addToCart,
    clearCart,
    removeFromCart,
    login,
    register,
    submitCheckout
  };
})();

document.addEventListener("DOMContentLoaded", app.init);