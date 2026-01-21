// Search functionality for products

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const grid = document.getElementById('productsGrid');
    
    if (!grid) {
        console.error('Products grid not found');
        return;
    }
    
    // Check if products array exists
    if (typeof products === 'undefined' || !Array.isArray(products)) {
        console.error('Products array not loaded yet');
        alert('Please wait for products to load');
        return;
    }
    
    // If search is empty, reload all products
    if (!searchTerm) {
        if (typeof loadProducts === 'function') {
            const category = typeof selectedCategory !== 'undefined' ? selectedCategory : 'All Products';
            loadProducts(category);
        }
        return;
    }
    
    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        if (!product) return false;
        const nameMatch = product.name ? product.name.toLowerCase().includes(searchTerm) : false;
        const descMatch = product.description ? product.description.toLowerCase().includes(searchTerm) : false;
        const catMatch = product.category ? product.category.toLowerCase().includes(searchTerm) : false;
        return nameMatch || descMatch || catMatch;
    });
    
    // Display filtered products
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
    
    // Show filtered results
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image || '📦'}</div>
            <div class="product-info">
                <div class="product-category">${product.category || ''}</div>
                <h3 class="product-title">${product.name || 'Product'}</h3>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-price">${product.price || 0} AED</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    console.log(`Found ${filteredProducts.length} products for "${searchTerm}"`);
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (typeof loadProducts === 'function') {
        const category = typeof selectedCategory !== 'undefined' ? selectedCategory : 'All Products';
        loadProducts(category);
    } else {
        console.error('loadProducts function not found');
    }
}

// Initialize search when page is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
    initializeSearch();
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        console.log('Search initialized');
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter pressed, searching...');
                searchProducts();
            }
        });
    } else {
        console.error('Search input not found during initialization');
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Search button clicked');
            searchProducts();
        });
    } else {
        console.error('Search button not found during initialization');
    }
}