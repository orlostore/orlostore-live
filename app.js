const WHATSAPP_NUMBER = "971XXXXXXXXX";
const FREE_DELIVERY_THRESHOLD = 75;
var MAX_QTY_PER_PRODUCT = MAX_QTY_PER_PRODUCT || 10;

const deliveryZones = {
    dubai: { name: "Dubai", nameAr: "دبي", fee: 18, freeThreshold: FREE_DELIVERY_THRESHOLD },
    sharjah_ajman: { name: "Sharjah / Ajman", nameAr: "الشارقة / عجمان", fee: 18, freeThreshold: FREE_DELIVERY_THRESHOLD },
    abu_dhabi: { name: "Abu Dhabi", nameAr: "أبو ظبي", fee: 18, freeThreshold: FREE_DELIVERY_THRESHOLD },
    other: { name: "Other Emirates", nameAr: "إمارات أخرى", fee: 18, freeThreshold: FREE_DELIVERY_THRESHOLD }
};

const DELIVERY_TIME = "2-5 business days";
const DELIVERY_TIME_AR = "٢-٥ أيام عمل";

const policies = {
    shipping: `<h2>Shipping & Delivery</h2><h2 class="arabic-heading">الشحن والتوصيل</h2><p><strong>Coverage:</strong> We currently deliver within the UAE only.</p><p class="arabic-text"><strong>التغطية:</strong> نقوم حالياً بالتوصيل داخل الإمارات العربية المتحدة فقط.</p><p><strong>Processing Time:</strong> Orders are processed within 24–48 hours of payment confirmation.</p><p class="arabic-text"><strong>وقت المعالجة:</strong> يتم معالجة الطلبات خلال ٢٤-٤٨ ساعة من تأكيد الدفع.</p><p><strong>Delivery Timeline:</strong> 2-5 business days for all locations.</p><p class="arabic-text"><strong>مدة التوصيل:</strong> ٢-٥ أيام عمل لجميع المواقع.</p><p><strong>Delivery Fees:</strong></p><p class="arabic-text"><strong>رسوم التوصيل:</strong></p><ul><li><strong>All UAE:</strong> 18 AED (FREE on orders over ${FREE_DELIVERY_THRESHOLD} AED)</li><li class="arabic-text"><strong>جميع أنحاء الإمارات:</strong> ١٨ درهم (مجاناً للطلبات فوق ${FREE_DELIVERY_THRESHOLD} درهم)</li></ul><p><strong>Tracking:</strong> You will receive tracking information via WhatsApp once your order ships.</p><p class="arabic-text"><strong>التتبع:</strong> ستتلقى معلومات التتبع عبر واتساب بمجرد شحن طلبك.</p>`,
    returns: `<h2>Returns & Refunds</h2><h2 class="arabic-heading">الإرجاع والاسترداد</h2><p><strong>7-Day Return Window:</strong> Returns are accepted within 7 days of delivery only.</p><p class="arabic-text"><strong>فترة الإرجاع ٧ أيام:</strong> يتم قبول المرتجعات خلال ٧ أيام من التسليم فقط.</p>`,
    privacy: `<h2>Privacy Policy</h2><h2 class="arabic-heading">سياسة الخصوصية</h2><p><strong>Information Collection:</strong> We collect only the information necessary to process your order.</p><p class="arabic-text"><strong>جمع المعلومات:</strong> نجمع فقط المعلومات الضرورية لمعالجة طلبك.</p>`,
    terms: `<h2>Terms of Service</h2><h2 class="arabic-heading">شروط الخدمة</h2><p><strong>Order Agreement:</strong> By placing an order, you agree to these terms.</p><p class="arabic-text"><strong>اتفاقية الطلب:</strong> بتقديم طلب، فإنك توافق على هذه الشروط.</p>`
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let upsellUsed = false;
let savedUpsellProducts = null;
let selectedCategory = "All Products";
let selectedDeliveryZone = localStorage.getItem("deliveryZone") || "dubai";

function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }
function saveDeliveryZone() { localStorage.setItem("deliveryZone", selectedDeliveryZone); }
function getCategories() { return ["All Products", ...new Set(products.map(p => p.category))]; }
function calculateDeliveryFee(subtotal) { const zone = deliveryZones[selectedDeliveryZone]; return subtotal >= zone.freeThreshold ? 0 : zone.fee; }

function getCategoryArabic(category) {
    if (category === "All Products") return "جميع المنتجات";
    const product = products.find(p => p.category === category);
    return product && product.categoryAr ? product.categoryAr : '';
}

function renderProducts(list) { 
    const grid = document.getElementById("productsGrid"); 
    if (!grid) return; // NULL CHECK
    if (!list.length) { 
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#999;padding:3rem;">No products found</p>`; 
        return; 
    } 
    grid.innerHTML = list.map(p => {
        const isUrl = p.image && p.image.startsWith('http');
        const imageHTML = isUrl 
            ? `<img src="${p.image}" alt="${p.name}" style="max-width:100%; max-height:100%; object-fit:contain;">` 
            : p.image;
        const outOfStock = p.quantity === 0;
        return `
        <div class="product-card ${outOfStock ? 'out-of-stock' : ''}">
            ${p.featured ? `<span class="badge">Best Seller</span>` : ""}
            ${outOfStock ? `<span class="badge out-of-stock-badge">Out of Stock</span>` : ""}
            <a href="product.html?product=${p.slug}" style="text-decoration:none;">
                <div class="product-image">${imageHTML}</div>
            </a>
            <div class="product-info">
                <a href="product.html?product=${p.slug}" style="text-decoration:none; color:inherit;">
                    <h3 class="product-title">${p.name}</h3>
                    ${p.nameAr ? `<p class="product-title-ar">${p.nameAr}</p>` : ''}
                </a>
                <div class="product-price">AED ${p.price}</div>
                ${outOfStock 
                    ? `<button class="add-to-cart" disabled style="background:#999;cursor:not-allowed;">Out of Stock | نفذ المخزون</button>` 
                    : `<button class="add-to-cart" onclick="addToCart(${p.id}, event)">Add to Cart | أضف إلى السلة</button>`
                }
            </div>
        </div>
    `}).join(""); 
}

function loadProducts(category = "All Products") { 
    selectedCategory = category; 
    const list = category === "All Products" ? products : products.filter(p => p.category === category); 
    renderProducts(list); 
    updateCategoryButtons(); 
    const heroSection = document.querySelector(".hero"); 
    const searchInput = document.getElementById("searchInput"); 
    if (heroSection && (!searchInput || !searchInput.value.trim())) { 
        heroSection.classList.remove("hidden"); 
    } 
}

function createCategoryFilters() { 
    const container = document.getElementById("categoryFilters"); 
    if (!container) return; // NULL CHECK
    container.innerHTML = getCategories().map(cat => {
        const catAr = getCategoryArabic(cat);
        return `<button class="category-btn ${cat === selectedCategory ? "active" : ""}" onclick="loadProducts('${cat}')">${cat}${catAr ? `<br><span class="arabic-text category-arabic">${catAr}</span>` : ''}</button>`;
    }).join(""); 
}

function updateCategoryButtons() { 
    document.querySelectorAll(".category-btn").forEach(btn => { 
        const firstLine = btn.childNodes[0]; 
        if (firstLine && firstLine.textContent) { 
            btn.classList.toggle("active", firstLine.textContent.trim() === selectedCategory); 
        } 
    }); 
}

function searchProducts() { 
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return; // NULL CHECK
    const term = searchInput.value.toLowerCase().trim(); 
    const heroSection = document.querySelector(".hero"); 
    if (!term) { 
        loadProducts(selectedCategory); 
        if (heroSection) heroSection.classList.remove("hidden"); 
        return; 
    } 
    if (heroSection) heroSection.classList.add("hidden"); 
    const scoped = selectedCategory === "All Products" ? products : products.filter(p => p.category === selectedCategory); 
    const results = scoped.filter(p => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)) || p.category.toLowerCase().includes(term)); 
    renderProducts(results); 
}

function addToCart(id, event) { 
    const product = products.find(p => p.id === id);
    if (!product || product.quantity === 0) return;
    
    const item = cart.find(i => i.id === id);
    const currentInCart = item ? item.quantity : 0;
    const maxAllowed = Math.min(MAX_QTY_PER_PRODUCT, product.quantity);
    if (currentInCart >= maxAllowed) return;
    
    if (item) { item.quantity++; } 
    else { cart.push({ ...product, quantity: 1 }); } 
    saveCart(); 
    updateCart(); 
    showCartPopup(product);
}

function showCartPopup(product) {
    const popup = document.getElementById('cartPopup');
    const popupContent = document.getElementById('cartPopupContent');
    if (!popup || !popupContent) return; // NULL CHECK
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const isUrl = product.image && product.image.startsWith('http');
    const imageHTML = isUrl 
        ? `<img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:contain;">` 
        : `<span style="font-size:3rem;">${product.image || '📦'}</span>`;
    
    popupContent.innerHTML = `
        <div class="popup-top">
            <button class="popup-close-btn" onclick="closeCartPopup()">✕</button>
            <div class="popup-success-badge">✓ Success!</div>
            <div class="popup-title">Added to Cart</div>
            <div class="popup-title-ar">تمت الإضافة للسلة</div>
        </div>
        <div class="popup-product-float">
            <div class="popup-product-card">
                <div class="popup-product-image">${imageHTML}</div>
                <div class="popup-product-details">
                    <div class="popup-product-name">${product.name}</div>
                    ${product.nameAr ? `<div class="popup-product-name-ar">${product.nameAr}</div>` : ''}
                    <div class="popup-product-price">AED ${product.price}</div>
                </div>
            </div>
        </div>
        <div class="popup-bottom">
            <div class="popup-cart-summary">
                <span class="popup-summary-label">Cart Total (${cartCount} ${cartCount === 1 ? 'item' : 'items'}):</span>
                <span class="popup-summary-value">AED ${cartTotal.toFixed(2)}</span>
            </div>
            <div class="popup-buttons">
                <button class="popup-btn-view-cart" onclick="closeCartPopup(); toggleCart();">🛒 View Cart | <span class="arabic-text">عرض السلة</span></button>
                <button class="popup-btn-continue" onclick="closeCartPopup()">Continue Shopping | <span class="arabic-text">متابعة التسوق</span></button>
            </div>
        </div>
    `;
    popup.classList.add('active');
}

function closeCartPopup() {
    const popup = document.getElementById('cartPopup');
    if (popup) popup.classList.remove('active');
}

function updateCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const cartItems = document.getElementById("cartItems"); 
    const cartCount = document.getElementById("cartCount"); 
    const bottomCartCount = document.getElementById("bottomCartCount");
    const mobileCartCount = document.getElementById("mobileCartCount");
    const cartFooter = document.querySelector(".cart-footer");
    const cartCheckoutFixed = document.getElementById("cartCheckoutFixed");
    const isMobile = window.innerWidth <= 768;
    
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (bottomCartCount) bottomCartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
    
    if (!cartItems || !cartFooter) return; // NULL CHECK
    
    if (!cart.length) { 
        cartItems.innerHTML = "<p style='text-align:center;padding:3rem;color:#999;font-size:1.1rem;'>Your cart is empty</p>"; 
        cartFooter.innerHTML = `<div style="display: flex; justify-content: space-between; padding: 0.75rem 0 0.5rem; font-size: 1.1rem; font-weight: 700; color: #2c4a5c;"><span>Total / الإجمالي:</span><span>AED 0.00</span></div>`;
        if (cartCheckoutFixed) cartCheckoutFixed.innerHTML = '';
        return; 
    } 
    
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0); 
    const deliveryFee = calculateDeliveryFee(subtotal); 
    const total = subtotal + deliveryFee;
    
    const checkoutBtnHTML = `<button id="stripeBtn" style="width: 100%; padding: 0.9rem; font-size: 0.95rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; background: #2c4a5c; color: white;" onclick="checkout()">💳 Pay with Card / الدفع بالبطاقة</button>`;
    
    if (isMobile && cartCheckoutFixed) {
        cartCheckoutFixed.innerHTML = checkoutBtnHTML;
    } else if (cartCheckoutFixed) {
        cartCheckoutFixed.innerHTML = '';
    }
    
    cartItems.innerHTML = cart.map(i => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem; border-bottom:1px solid #eee;">
            <div style="flex:1;">
                <strong style="font-size:0.9rem; color:#2c4a5c;">${i.name}</strong><br>
                <span style="color:#888; font-size:0.8rem;">AED ${i.price} × ${i.quantity}</span><br>
                <span style="color:#e07856; font-weight:600; font-size:0.9rem;">AED ${(i.price * i.quantity).toFixed(2)}</span>
            </div>
            <div style="display:flex; gap:0.4rem; align-items:center;">
                <button onclick="updateQuantity(${i.id}, -1)" style="padding:0.3rem 0.6rem; background:#f0f0f0; border:none; border-radius:4px; cursor:pointer;">-</button>
                <span style="font-size:0.9rem; font-weight:600; min-width:20px; text-align:center;">${i.quantity}</span>
                <button onclick="updateQuantity(${i.id}, 1)" style="padding:0.3rem 0.6rem; background:#f0f0f0; border:none; border-radius:4px; cursor:pointer;">+</button>
                <button onclick="removeFromCart(${i.id})" style="padding:0.3rem 0.6rem; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; margin-left:0.3rem;">✕</button>
            </div>
        </div>
    `).join(""); 
    
    let footerHTML = `
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.9rem; color: #2c4a5c;">
                <span>Subtotal / المجموع الفرعي:</span><span>AED ${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.9rem; color: #2c4a5c;">
                <span>Delivery / التوصيل:</span>
                <span style="${deliveryFee === 0 ? 'color: #28a745; font-weight: 600;' : ''}">${deliveryFee === 0 ? 'FREE / مجاني' : 'AED ' + deliveryFee.toFixed(2)}</span>
            </div>
            <div style="border-top: 2px solid #ddd; margin: 0.5rem 0;"></div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0 0.5rem; font-size: 1.1rem; font-weight: 700; color: #2c4a5c;">
                <span>Total / الإجمالي:</span><span>AED ${total.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    if (!isMobile) {
        footerHTML += `<div style="padding: 0 1rem 1rem;">${checkoutBtnHTML}</div>`;
    }
    
    cartFooter.innerHTML = footerHTML;
}

function updateQuantity(id, change) { 
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (!item) return;
    
    const newQty = item.quantity + change;
    if (change > 0) {
        const maxAllowed = Math.min(MAX_QTY_PER_PRODUCT, product ? product.quantity : MAX_QTY_PER_PRODUCT);
        if (newQty > maxAllowed) return;
    }
    
    item.quantity = newQty;
    if (item.quantity <= 0) { removeFromCart(id); } 
    else { saveCart(); updateCart(); } 
}

function removeFromCart(id) { 
    cart = cart.filter(i => i.id !== id); 
    upsellUsed = false;
    saveCart(); 
    updateCart(); 
}

function toggleCart() { 
    const cartSidebar = document.getElementById("cartSidebar");
    const bottomCartBtn = document.getElementById("bottomCartBtn");
    const bottomHomeBtn = document.getElementById("bottomHomeBtn");
    
    if (!cartSidebar) return; // NULL CHECK
    cartSidebar.classList.toggle("active");
    
    if (cartSidebar.classList.contains("active")) {
        if (bottomCartBtn) bottomCartBtn.classList.add("cart-active");
        if (bottomHomeBtn) bottomHomeBtn.classList.remove("home-active");
    } else {
        if (bottomCartBtn) bottomCartBtn.classList.remove("cart-active");
        if (bottomHomeBtn) bottomHomeBtn.classList.add("home-active");
        upsellUsed = false;
        savedUpsellProducts = null;
    }
    updateCart();
}

function openPolicy(type) { 
    const policyText = document.getElementById("policyText");
    const policyModal = document.getElementById("policyModal");
    if (!policyText || !policyModal) return; // NULL CHECK
    policyText.innerHTML = policies[type]; 
    policyModal.style.display = "block"; 
    document.body.style.overflow = "hidden"; 
}

function closePolicy() { 
    const policyModal = document.getElementById("policyModal");
    if (!policyModal) return; // NULL CHECK
    policyModal.style.display = "none"; 
    document.body.style.overflow = "auto"; 
}

function toggleMobileMenu() {
    let overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.innerHTML = `
            <div class="mobile-menu">
                <a href="#products" onclick="closeMobileMenu()"><span class="menu-en">🛍️ Shop</span> | <span class="menu-ar">تسوق</span></a>
                <a href="#about" onclick="closeMobileMenu()"><span class="menu-en">ℹ️ About</span> | <span class="menu-ar">من نحن</span></a>
                <a href="#contact" onclick="closeMobileMenu()"><span class="menu-en">📧 Contact</span> | <span class="menu-ar">اتصل بنا</span></a>
                <a href="#terms" onclick="closeMobileMenu()"><span class="menu-en">📋 Terms</span> | <span class="menu-ar">الشروط</span></a>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) closeMobileMenu(); };
    }
    overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) overlay.classList.remove('active');
}

window.onload = () => { 
    // Update cart counts
    updateCart();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showAbout') === 'true') {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.style.display = 'block';
            setTimeout(() => aboutSection.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }
    
    const searchTerm = urlParams.get('search');
    if (searchTerm) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) { searchInput.value = searchTerm; searchProducts(); }
    }
    
    const promoBanner = document.querySelector('.mobile-promo-banner');
    if (promoBanner) {
        promoBanner.innerHTML = `🚚 Free delivery over AED ${FREE_DELIVERY_THRESHOLD} | <span class="arabic-text">توصيل مجاني فوق ${FREE_DELIVERY_THRESHOLD} درهم</span>`;
    }
    
    const heroThreshold = document.getElementById('heroThreshold');
    const heroThresholdAr = document.getElementById('heroThresholdAr');
    if (heroThreshold) heroThreshold.textContent = FREE_DELIVERY_THRESHOLD;
    if (heroThresholdAr) heroThresholdAr.textContent = FREE_DELIVERY_THRESHOLD;
    
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function() {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }
    
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const cartIcon = document.getElementById("cartIcon");
    const closeCart = document.getElementById("closeCart");
    const policyModal = document.getElementById("policyModal");
    
    if (searchBtn) searchBtn.onclick = searchProducts;
    if (searchInput) searchInput.onkeypress = (e) => { if (e.key === "Enter") { e.preventDefault(); searchProducts(); } };
    if (cartIcon) cartIcon.onclick = toggleCart;
    if (closeCart) closeCart.onclick = toggleCart;
    if (policyModal) policyModal.onclick = (e) => { if (e.target.id === "policyModal") closePolicy(); };
    
    const bottomHomeBtn = document.getElementById("bottomHomeBtn");
    const bottomCartBtn = document.getElementById("bottomCartBtn");
    const bottomMenuBtn = document.getElementById("bottomMenuBtn");
    
    if (bottomHomeBtn) {
        bottomHomeBtn.classList.add("home-active");
        bottomHomeBtn.onclick = function() {
            const cartSidebar = document.getElementById("cartSidebar");
            if (cartSidebar && cartSidebar.classList.contains("active")) {
                cartSidebar.classList.remove("active");
                if (bottomCartBtn) bottomCartBtn.classList.remove("cart-active");
            }
            closeMobileMenu();
            bottomHomeBtn.classList.add("home-active");
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
    }
    
    if (bottomCartBtn) bottomCartBtn.onclick = toggleCart;
    if (bottomMenuBtn) {
        bottomMenuBtn.onclick = function() {
            const cartSidebar = document.getElementById("cartSidebar");
            if (cartSidebar && cartSidebar.classList.contains("active")) {
                cartSidebar.classList.remove("active");
                if (bottomCartBtn) bottomCartBtn.classList.remove("cart-active");
            }
            toggleMobileMenu();
        };
    }
};

async function checkout() {
    const btn = document.getElementById("stripeBtn");
    const originalText = btn ? btn.innerHTML : "Pay with Card";
    
    try {
        if (btn) { btn.disabled = true; btn.innerHTML = "Checking stock..."; }
        
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cart, deliveryZoneKey: selectedDeliveryZone }),
        });
        
        const data = await response.json();
        
        if (data.error) {
            if (data.error === 'out_of_stock') {
                alert(data.message);
                if (typeof initProducts === 'function') initProducts();
            } else if (data.error === 'insufficient_stock') {
                let msg = 'Stock issue:\n';
                data.items.forEach(item => { msg += `${item.name}: Only ${item.available} available\n`; });
                alert(msg);
            } else {
                alert(data.message || 'Payment failed.');
            }
            if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
            return;
        }
        
        if (data.url) { window.location.href = data.url; }
        else { throw new Error('No URL'); }
    } catch (err) {
        console.error("Payment Error:", err);
        alert("Payment system error. Please try again.");
        if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
    }
}
