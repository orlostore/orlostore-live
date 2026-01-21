// Search functionality for products

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const grid = document.getElementById('productsGrid');
    
    if (!searchTerm) {
        // If search is empty, reload all products
        loadProducts(selectedCategory || 'All Products');
        return;
    }
    
    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const descMatch = product.description.toLowerCase().includes(searchTerm);
        const catMatch = product.category.toLowerCase().includes(searchTerm);
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
    
    // Show results count
    const resultsMsg = document.createElement('p');
    resultsMsg.style.cssText = 'text-align: center; color: #666; margin-bottom: 1rem; font-size: 0.95rem;';
    resultsMsg.textContent = `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} for "${searchTerm}"`;
    grid.parentElement.insertBefore(resultsMsg, grid);
    
    // Remove message after displaying results
    setTimeout(() => resultsMsg.remove(), 3000);
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    loadProducts(selectedCategory || 'All Products');
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts();
            }
        });
        
        // Also search on input (live search)
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length >= 3 || searchInput.value.length === 0) {
                searchProducts();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchProducts();
        });
    }
});