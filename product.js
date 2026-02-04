// Products - Fetches from D1 database via API

let products = [];
let productsLoaded = false; // Flag to track if products are ready

// Cache settings
const CACHE_KEY = 'orlo_products_cache';
const CACHE_TIME_KEY = 'orlo_products_cache_time';
const CACHE_DURATION = 60 * 1000; // 1 minute

// Load from cache (instant)
function loadFromCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            products = JSON.parse(cached);
            console.log('⚡ Loaded', products.length, 'products from cache');
            return true;
        }
    } catch (e) {
        console.log('No cache available');
    }
    return false;
}

// Save to cache
function saveToCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } catch (e) {
        console.log('Could not save to cache');
    }
}

// Check if cache is expired
function isCacheExpired() {
    const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
    if (!cacheTime) return true;
    return (Date.now() - parseInt(cacheTime)) > CACHE_DURATION;
}

// Fetch products from D1 API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (Array.isArray(data)) {
            console.log('🌐 Fetched', data.length, 'products from D1');
            return data;
        }
        return null;
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        return null;
    }
}

// Trigger UI update - called when products are ready
function triggerUIUpdate() {
    productsLoaded = true;
    
    // Only call these if app.js has loaded them
    if (typeof createCategoryFilters === 'function') {
        createCategoryFilters();
    }
    if (typeof loadProducts === 'function') {
        loadProducts();
    }
    if (typeof updateCart === 'function') {
        updateCart();
    }
    
    // Dispatch custom event for any listeners
    window.dispatchEvent(new CustomEvent('productsReady', { detail: { count: products.length } }));
}

// Update UI if products changed
function updateUIIfNeeded(newProducts) {
    const oldJSON = JSON.stringify(products);
    const newJSON = JSON.stringify(newProducts);
    
    if (oldJSON !== newJSON) {
        products = newProducts;
        saveToCache(newProducts);
        triggerUIUpdate();
        console.log('🔄 Products updated!');
    }
}

// Main initialization
async function initProducts() {
    // Step 1: Load from cache instantly
    const hasCache = loadFromCache();
    
    // Step 2: Show cached products immediately if app.js is ready
    if (hasCache) {
        triggerUIUpdate();
    }
    
    // Step 3: Fetch fresh data from API
    const freshProducts = await fetchProducts();
    
    if (freshProducts && freshProducts.length > 0) {
        if (hasCache) {
            // Compare and update if different
            updateUIIfNeeded(freshProducts);
        } else {
            // No cache - first load
            products = freshProducts;
            saveToCache(freshProducts);
            triggerUIUpdate();
        }
    } else if (!hasCache) {
        // No cache AND no API response - show error state
        console.error('❌ No products available from cache or API');
        productsLoaded = true;
        window.dispatchEvent(new CustomEvent('productsError'));
    }
}

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
} else {
    // DOM already loaded, but use setTimeout to ensure app.js has time to load
    setTimeout(initProducts, 10);
}
