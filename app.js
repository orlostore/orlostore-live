// ==========================================
// PRODUCTS DATA
// ==========================================

const products = [
    {
        id: 1,
        name: "Cable Management Kit",
        description: "315 PCS Fast Adhesive Cable Organizer for Home and Office",
        price: 65,
        category: "Cable Management",
        image: "📦"
    },
    {
        id: 2,
        name: "Wireless Charging Stand",
        description: "Fast charging stand compatible with all Qi devices",
        price: 120,
        category: "Phone Accessories",
        image: "📱"
    },
    {
        id: 3,
        name: "LED Strip Lights",
        description: "RGB Smart LED Strip 5M with Remote Control",
        price: 95,
        category: "Smart Home",
        image: "💡"
    },
    {
        id: 4,
        name: "Car Phone Holder",
        description: "Magnetic premium quality mount for dashboard",
        price: 85,
        category: "Phone Accessories",
        image: "🚗"
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker with 12-hour battery",
        price: 150,
        category: "Electronics",
        image: "🔊"
    },
    {
        id: 6,
        name: "Laptop Stand",
        description: "Ergonomic aluminum adjustable laptop stand",
        price: 110,
        category: "Computer Accessories",
        image: "💻"
    },
    {
        id: 7,
        name: "Desk Organizer",
        description: "Multi-compartment desk organizer with phone holder",
        price: 75,
        category: "Cable Management",
        image: "📋"
    },
    {
        id: 8,
        name: "USB Hub",
        description: "7-Port USB 3.0 Hub with individual power switches",
        price: 90,
        category: "Electronics",
        image: "🔌"
    }
];

// ==========================================
// STATE VARIABLES
// ==========================================

let cart = [];
let selectedCategory = 'All Products';

// ==========================================
// PRODUCT FUNCTIONS
// ==========================================

function getCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    return ['All Products', ...categories.sort()];
}

function loadProducts(category = 'All Products') {
    selectedCategory = category;
    const grid = document.getElementById('productsGrid');
    
    const filteredProducts = category === 'All Products' 
        ? products 
        : products.filter(p => p.category === category);
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #6c757d; grid-column: 1/-1;">No products in this category yet.</p>';
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} AED</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    updateCategoryButtons();
}

function createCategoryFilters() {
    const container = document.getElementById('categoryFilters');
    if (!container) return;
    
    const categories = getCategories();
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === selectedCategory ? 'active' : ''}" 
                onclick="loadProducts('${cat}')">
            ${cat}
        </button>
    `).join('');
}

function updateCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === selectedCategory) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ==========================================
// SEARCH FUNCTIONS
// ==========================================

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const grid = document.getElementById('productsGrid');
    
    if (!searchTerm) {
        loadProducts(selectedCategory);
        return;
    }
    
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.description.toLowerCase().includes(searchTerm) ||
               product.category.toLowerCase().includes(searchTerm);
    });
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                    No products found for "<strong>${searchTerm}</strong>"
                </p>
                <button onclick="clearSearch()" style="padding: 0.75rem 2rem; background: #e07856; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: 500;">
                    Clear Search
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} AED</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    loadProducts(selectedCategory);
}

// ==========================================
// CART FUNCTIONS
// ==========================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification('Added to cart!');
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        cartCount.textContent = '0';
        cartTotal.textContent = '0.00 AED';
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2) + ' AED';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} AED</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let orderSummary = 'Order Summary:\n\n';
    cart.forEach(item => {
        orderSummary += `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} AED\n`;
    });
    orderSummary += `\nTotal: ${total.toFixed(2)} AED`;
    
    alert(orderSummary + '\n\nPayment gateway will be integrated here!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e07856;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 2000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
}

// ==========================================
// INITIALIZE - FIXED EVENT LISTENERS
// ==========================================

// Wait for DOM to be fully loaded
window.addEventListener('load', function() {
    console.log('Page loaded, initializing...');
    
    // Load products
    createCategoryFilters();
    loadProducts();
    
    // FIXED: Search event listeners with direct binding
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        console.log('Search input found');
        // Use onclick instead of addEventListener
        searchInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter pressed');
                searchProducts();
            }
        };
    } else {
        console.error('Search input NOT found');
    }
    
    if (searchBtn) {
        console.log('Search button found');
        // Use onclick instead of addEventListener
        searchBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Search button clicked');
            searchProducts();
        };
    } else {
        console.error('Search button NOT found');
    }
    
    // Cart event listeners
    const cartIcon = document.getElementById('cartIcon');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartIcon) {
        cartIcon.onclick = toggleCart;
    }
    
    if (closeCart) {
        closeCart.onclick = toggleCart;
    }
    
    if (checkoutBtn) {
        checkoutBtn.onclick = checkout;
    }
    
    console.log('Initialization complete');
});
