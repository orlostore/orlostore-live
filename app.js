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
// POLICIES CONTENT (STRICT RETURN POLICY)
// ==========================================

const policies = {
    shipping: `
        <h2>Shipping & Delivery</h2>
        <p><strong>Coverage:</strong> We currently deliver within the UAE only.</p>
        <p><strong>Processing Time:</strong> Orders are processed within 24–48 hours of payment confirmation.</p>
        <p><strong>Delivery Timeline:</strong> Delivery times vary by location:</p>
        <ul>
            <li>Dubai: 1-2 business days</li>
            <li>Other Emirates: 2-4 business days</li>
        </ul>
        <p><strong>Tracking:</strong> You will receive tracking information via WhatsApp once your order ships.</p>
        <p><strong>Delivery Fees:</strong> Calculated at checkout based on your location.</p>
    `,
    returns: `
        <h2>Returns & Refunds</h2>
        <p><strong>7-Day Return Window:</strong> Returns are accepted within 7 days of delivery only. No exceptions.</p>
        <p><strong>Unopened Items Only:</strong> Items must be completely unused, unopened, and in original sealed packaging with all tags and seals intact.</p>
        <p><strong>No Returns on Opened Items:</strong> Once opened, used, or packaging is damaged, items cannot be returned for any reason.</p>
        <p><strong>Return Shipping Costs:</strong> All return shipping costs are the buyer's responsibility. We do not provide prepaid return labels.</p>
        <p><strong>Inspection Required:</strong> All returns are inspected upon receipt. Items showing any signs of use, missing components, or damaged packaging will be rejected.</p>
        <p><strong>Refund Process:</strong> Refunds are issued only after inspection confirms the item is unopened and undamaged. Processing takes 5-7 business days after we receive the return.</p>
        <p><strong>Non-Returnable Items:</strong> Sale items, clearance items, items with damaged packaging, or items showing any signs of use are not eligible for return.</p>
        <p><strong>How to Initiate a Return:</strong> Contact us via WhatsApp or email within 7 days of delivery with your order number and reason for return.</p>
    `,
    privacy: `
        <h2>Privacy Policy</h2>
        <p><strong>Information Collection:</strong> We collect only the information necessary to process and fulfill your order (name, phone number, delivery address, email).</p>
        <p><strong>Data Usage:</strong> Your information is used solely for order processing, delivery coordination, and customer support.</p>
        <p><strong>Third-Party Sharing:</strong> Your data is never sold or shared with third parties except for delivery partners who need your address to complete delivery.</p>
        <p><strong>Data Security:</strong> We use secure communication channels (WhatsApp, encrypted email) to protect your information.</p>
        <p><strong>Your Rights:</strong> You may request deletion of your data at any time by contacting us.</p>
    `,
    terms: `
        <h2>Terms of Service</h2>
        <p><strong>Order Agreement:</strong> By placing an order, you agree to provide accurate information and accept these terms.</p>
        <p><strong>Payment:</strong> Full payment is required before order processing begins. We accept bank transfer and online payment methods.</p>
        <p><strong>Product Accuracy:</strong> We strive to display accurate product information and images. Actual products may vary slightly from images shown.</p>
        <p><strong>Right to Refuse Service:</strong> ORLO reserves the right to refuse or cancel any order if fraud, misuse, or policy violations are detected.</p>
        <p><strong>Liability:</strong> ORLO is not responsible for delivery delays caused by courier services, incorrect addresses provided by customers, or force majeure events.</p>
        <p><strong>Changes to Terms:</strong> We reserve the right to update these terms at any time. Continued use of our service constitutes acceptance of updated terms.</p>
        <p><strong>Contact:</strong> For questions about these terms, contact us at info@orlostore.com</p>
    `
};

// ==========================================
// STATE (PERSISTED IN LOCALSTORAGE)
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
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#999;">No products found</p>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="product-card">
            ${p.featured ? `<span class="badge">Best Seller</span>` : ""}
            <div class="product-image">${p.image}</div>
            <div class="product-info">
                <small>${p.category}</small>
                <h3 class="product-title">${p.name}</h3>
                <p>${p.description}</p>
                <div class="product-price">${p.price} AED</div>
                <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
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
// SEARCH (WITH ENTER KEY SUPPORT)
// ==========================================

function searchProducts() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();

    if (!term) {
        loadProducts(selectedCategory);
        return;
    }

    const scoped = selectedCategory === "All Products"
        ? products
        : products.filter(p => p.category === selectedCategory);

    const results = scoped.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );

    renderProducts(results);
}

// ==========================================
// CART
// ==========================================

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    if (!cart.length) {
        cartItems.innerHTML = "<p style='text-align:center;padding:2rem;color:#999;'>Your cart is empty</p>";
        cartCount.textContent = 0;
        cartTotal.textContent = "0.00 AED";
        return;
    }

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = total.toFixed(2) + " AED";

    cartItems.innerHTML = cart.map(i => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border-bottom:1px solid #eee;">
            <div style="flex:1;">
                <strong>${i.name}</strong><br>
                <span style="color:#888;">${i.price} AED × ${i.quantity}</span>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
                <button onclick="updateQuantity(${i.id}, -1)" style="padding:0.25rem 0.75rem; background:#ddd; border:none; border-radius:3px; cursor:pointer;">-</button>
                <span>${i.quantity}</span>
                <button onclick="updateQuantity(${i.id}, 1)" style="padding:0.25rem 0.75rem; background:#ddd; border:none; border-radius:3px; cursor:pointer;">+</button>
                <button onclick="removeFromCart(${i.id})" style="padding:0.25rem 0.75rem; background:#dc3545; color:white; border:none; border-radius:3px; cursor:pointer; margin-left:0.5rem;">✕</button>
            </div>
        </div>
    `).join("");
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCart();
        }
    }
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
    if (!cart.length) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello ORLO, I'd like to order:%0A%0A";
    
    cart.forEach(i => {
        message += `• ${i.name} × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)} AED%0A`;
    });

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    message += `%0ATotal: ${total.toFixed(2)} AED`;
    message += `%0A%0APlease confirm delivery address and payment method.`;

    // Replace with your actual WhatsApp number
    window.open(`https://wa.me/971500000000?text=${message}`, "_blank");
}

// ==========================================
// POLICY MODAL
// ==========================================

function openPolicy(type) {
    document.getElementById("policyText").innerHTML = policies[type];
    document.getElementById("policyModal").style.display = "block";
}

function closePolicy() {
    document.getElementById("policyModal").style.display = "none";
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e07856;
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ==========================================
// INIT (WITH ENTER KEY SUPPORT)
// ==========================================

window.onload = () => {
    createCategoryFilters();
    loadProducts();
    updateCart();

    // Search button click
    document.getElementById("searchBtn").onclick = searchProducts;
    
    // ENTER KEY SUPPORT FOR SEARCH
    document.getElementById("searchInput").onkeypress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchProducts();
        }
    };
    
    // Cart controls
    document.getElementById("cartIcon").onclick = toggleCart;
    document.getElementById("closeCart").onclick = toggleCart;
    document.getElementById("checkoutBtn").onclick = checkout;
    
    // Close policy modal when clicking outside
    document.getElementById("policyModal").onclick = (e) => {
        if (e.target.id === "policyModal") {
            closePolicy();
        }
    };
};
