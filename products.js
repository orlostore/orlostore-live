// Products - Fetches from D1 database via API

let products = [];
let productsLoaded = false;

const CACHE_KEY = 'orlo_products_cache';
const CACHE_TIME_KEY = 'orlo_products_cache_time';
const CACHE_DURATION = 60 * 1000;

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

function saveToCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } catch (e) {
        console.log('Could not save to cache');
    }
}

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

function triggerUIUpdate() {
    productsLoaded = true;
    
    if (typeof createCategoryFilters === 'function') {
        createCategoryFilters();
    }
    if (typeof loadProducts === 'function') {
        loadProducts();
    }
    if (typeof updateCart === 'function') {
        updateCart();
    }
    
    window.dispatchEvent(new CustomEvent('productsReady', { detail: { count: products.length } }));
}

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

async function initProducts() {
    const hasCache = loadFromCache();
    
    if (hasCache) {
        triggerUIUpdate();
    }
    
    const freshProducts = await fetchProducts();
    
    if (freshProducts && freshProducts.length > 0) {
        if (hasCache) {
            updateUIIfNeeded(freshProducts);
        } else {
            products = freshProducts;
            saveToCache(freshProducts);
            triggerUIUpdate();
        }
    } else if (!hasCache) {
        console.error('❌ No products available');
        productsLoaded = true;
        window.dispatchEvent(new CustomEvent('productsError'));
    }
}

// Auto-init
initProducts();
