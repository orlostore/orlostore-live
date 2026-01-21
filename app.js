// ===============================
// PRODUCTS
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
let activeCategory = "All";

// ===============================
// ELEMENTS
// ===============================
const grid = document.getElementById("productsGrid");
const filters = document.getElementById("categoryFilters");
const hero = document.querySelector(".hero");
const about = document.getElementById("about");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// ===============================
// RENDER PRODUCTS (GRID ONLY)
// ===============================
function renderProducts(list) {
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p style="padding:2rem;">No products found.</p>`;
    return;
  }

  list.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <div class="product-image">${p.image}</div>
        <h3>${p.name}</h3>
        <p class="product-category">${p.category}</p>
        <strong>${p.price} AED</strong>
        <button>Add to Cart</button>
      </div>
    `;
  });
}

// ===============================
// CATEGORIES (TOP PILLS)
// ===============================
function renderCategories() {
  const cats = ["All", ...new Set(products.map(p => p.category))];
  filters.innerHTML = "";

  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.onclick = () => filterByCategory(cat);
    filters.appendChild(btn);
  });
}

function filterByCategory(cat) {
  activeCategory = cat;
  hero.style.display = "block";
  about.style.display = "block";

  const list =
    cat === "All"
      ? products
      : products.filter(p => p.category === cat);

  renderProducts(list);
}

// ===============================
// SEARCH (NO LAYOUT CHANGE)
// ===============================
function searchProducts() {
  const term = searchInput.value.toLowerCase().trim();

  if (!term) {
    filterByCategory(activeCategory);
    return;
  }

  hero.style.display = "none";
  about.style.display = "none";

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
// POLICIES MODAL
// ===============================
function openPolicy(type) {
  const text = {
    shipping: "Delivery across UAE in 1–3 business days.",
    returns: "7-day returns for unused items.",
    privacy: "Your data is safe and never shared.",
    terms: "Using ORLO means fair and honest usage."
  };

  document.getElementById("policyContent").innerHTML = `
    <h2>${type.toUpperCase()}</h2>
    <p>${text[type]}</p>
  `;
  document.getElementById("policyModal").style.display = "block";
}

function closePolicy() {
  document.getElementById("policyModal").style.display = "none";
}

// ===============================
// INIT
// ===============================
renderCategories();
renderProducts(products);
