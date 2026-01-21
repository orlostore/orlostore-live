// ===============================
// PRODUCTS DATA (SAMPLES ONLY)
// ===============================
const products = [
  { id: 1, name: "Cable Management Kit", price: 89, category: "Workspace", image: "📦" },
  { id: 2, name: "Laptop Stand", price: 129, category: "Workspace", image: "💻" },
  { id: 3, name: "Wireless Charger", price: 119, category: "Phone", image: "📱" },
  { id: 4, name: "Bluetooth Speaker", price: 159, category: "Electronics", image: "🔊" },
  { id: 5, name: "Desk Organizer", price: 79, category: "Workspace", image: "📋" }
];

// ===============================
// STATE
// ===============================
let cart = [];
let selectedCategory = "All";
let isSearching = false;

// ===============================
// ELEMENTS
// ===============================
const productsGrid = document.getElementById("productsGrid");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// ===============================
// RENDER PRODUCTS
// ===============================
function renderProducts(list) {
  productsGrid.innerHTML = "";

  if (list.length === 0) {
    productsGrid.innerHTML = `<p style="padding:2rem">No products found.</p>`;
    return;
  }

  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <div class="product-img">${p.image}</div>
      <h3>${p.name}</h3>
      <p>${p.category}</p>
      <strong>${p.price} AED</strong>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productsGrid.appendChild(div);
  });
}

// ===============================
// CATEGORIES
// ===============================
function getCategories() {
  return ["All", ...new Set(products.map(p => p.category))];
}

function renderCategories() {
  categoryFilters.innerHTML = "";

  getCategories().forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.onclick = () => {
      selectedCategory = cat;
      isSearching = false;
      filterProducts();
    };
    categoryFilters.appendChild(btn);
  });
}

function filterProducts() {
  let list = [...products];
  if (selectedCategory !== "All") {
    list = list.filter(p => p.category === selectedCategory);
  }
  renderProducts(list);
}

// ===============================
// SEARCH (REAL SEARCH)
// ===============================
function searchProducts() {
  const term = searchInput.value.toLowerCase().trim();
  if (!term) {
    isSearching = false;
    filterProducts();
    return;
  }

  isSearching = true;
  const results = products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term)
  );

  renderProducts(results);
}

searchBtn.onclick = searchProducts;
searchInput.onkeypress = e => {
  if (e.key === "Enter") searchProducts();
};

// ===============================
// CART
// ===============================
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (item) item.qty++;
  else cart.push({ ...product, qty: 1 });

  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.textContent = "0.00 AED";
    cartCount.textContent = "0";
    return;
  }

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${item.name}</strong>
      <div>
        <button onclick="changeQty(${item.id},-1)">−</button>
        ${item.qty}
        <button onclick="changeQty(${item.id},1)">+</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2) + " AED";
  cartCount.textContent = count;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCart();
}

// ===============================
// POLICIES MODAL
// ===============================
function openPolicy(type) {
  const modal = document.getElementById("policyModal");
  const box = document.getElementById("policyContent");

  const policies = {
    shipping: "We ship across UAE. Delivery in 1–3 business days.",
    returns: "Returns accepted within 7 days for unused items.",
    privacy: "Your data is never sold. We respect your privacy.",
    terms: "By using ORLO, you agree to fair and honest use."
  };

  box.innerHTML = `<h2>${type.toUpperCase()}</h2><p>${policies[type]}</p>`;
  modal.style.display = "block";
}

function closePolicy() {
  document.getElementById("policyModal").style.display = "none";
}

// ===============================
// INIT
// ===============================
renderCategories();
renderProducts(products);
