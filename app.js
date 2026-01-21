// ==========================================
// PRODUCTS (FLAG BEST SELLERS)
// ==========================================

const products = [
    {
        id: 1,
        name: "Cable Management Kit",
        description: "315-piece adhesive cable organizer",
        price: 65,
        category: "Workspace",
        image: "📦",
        featured: true
    },
    {
        id: 2,
        name: "Wireless Charging Stand",
        description: "Fast Qi charging stand",
        price: 120,
        category: "Phone Accessories",
        image: "📱",
        featured: true
    },
    {
        id: 3,
        name: "LED Strip Lights",
        description: "RGB smart LED strip (5m)",
        price: 95,
        category: "Home",
        image: "💡"
    },
    {
        id: 4,
        name: "Laptop Stand",
        description: "Adjustable aluminum stand",
        price: 110,
        category: "Workspace",
        image: "💻",
        featured: true
    }
];

// ==========================================
// STATE (PERSISTED)
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedCategory = "All Products";

// ==========================================
// UTILITIES
// ==========================================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCategories() {
    return ["All Products", ...new Set(products.map(p => p.category))];
}

// ==========================================
// RENDERING
// ==========================================

function renderProducts(list) {
    const grid = document.getElementById("productsGrid");

    if (!list.length) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;">No products found</p>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="product-card">
            ${p.featured ? `<span class="badge">Best Seller</span>` : ""}
            <div class="product-image">${p.image}</div>
            <div class="product-info">
                <small>${p.category}</small>
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <strong>${p.price} AED</strong>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join("");
}

function loadProducts(category = "All Products") {
    selectedCategory = category;
    const list = category === "All Products"
        ? products
        : products.filter(p => p.category === category);

    renderProducts(list);
    updateCategoryButtons();
}

function createCategoryFilters() {
    const container = document.getElementById("categoryFilters");
    container.innerHTML = getCategories().map(cat => `
        <button class="category-btn ${cat === selectedCategory ? "active" : ""}"
                onclick="loadProducts('${cat}')">${cat}</button>
    `).join("");
}

function updateCategoryButtons() {
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.toggle("active", btn.textContent === selectedCategory);
    });
}

// ==========================================
// SEARCH
// ==========================================

function searchProducts() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();

    const scoped = selectedCategory === "All Products"
        ? products
        : products.filter(p => p.category === selectedCategory);

    const results = scoped.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );

    renderProducts(results);
}

// ==========================================
// CART
// ==========================================

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);

    item ? item.quantity++ : cart.push({ ...product, quantity: 1 });
    saveCart();
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    if (!cart.length) {
        cartItems.innerHTML = "<p>Your cart is empty</p>";
        cartCount.textContent = 0;
        cartTotal.textContent = "0.00 AED";
        return;
    }

    cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    cartTotal.textContent = total.toFixed(2) + " AED";

    cartItems.innerHTML = cart.map(i => `
        <div>
            ${i.name} × ${i.quantity}
            <button onclick="removeFromCart(${i.id})">✕</button>
        </div>
    `).join("");
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCart();
}

function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("active");
}

// ==========================================
// CHECKOUT (WHATSAPP)
// ==========================================

function checkout() {
    if (!cart.length) return alert("Your cart is empty");

    let message = "Hello ORLO, I’d like to order:%0A";
    cart.forEach(i => {
        message += `${i.name} x${i.quantity} — ${i.price * i.quantity} AED%0A`;
    });

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    message += `%0ATotal: ${total} AED`;

    window.open(`https://wa.me/971500000000?text=${message}`, "_blank");
}

// ==========================================
// INIT
// ==========================================

window.onload = () => {
    createCategoryFilters();
    loadProducts();
    updateCart();

    document.getElementById("searchBtn").onclick = searchProducts;
    document.getElementById("cartIcon").onclick = toggleCart;
    document.getElementById("closeCart").onclick = toggleCart;
    document.getElementById("checkoutBtn").onclick = checkout;
};
