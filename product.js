// Get product slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("product");

// Convert number to Arabic numerals
function toArabicNumerals(num) {
  const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).split('').map(d => arabicNums[parseInt(d)] || d).join('');
}

// Wait for products to load, then display
async function initProductPage() {
  // Wait for products to be loaded from Google Sheets
  let attempts = 0;
  while (products.length === 0 && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  // Find product
  const product = products.find(p => p.slug === slug);

  if (!product) {
    document.body.innerHTML = "<h2 style='text-align:center;padding:2.4rem;'>Product not found</h2>";
    return;
  }

  // Get threshold from app.js (will be available after app.js loads)
  const threshold = typeof FREE_DELIVERY_THRESHOLD !== 'undefined' ? FREE_DELIVERY_THRESHOLD : 75;
  
  // Update all threshold displays
  document.querySelectorAll('.threshold-value').forEach(el => el.textContent = threshold);
  document.querySelectorAll('.threshold-value-ar').forEach(el => el.textContent = toArabicNumerals(threshold));

  // =====================
  // DESKTOP VERSION
  // =====================
  document.getElementById("productTitle").innerText = product.name;
  document.getElementById("productCategory").innerText = product.category;

  // Build detailed description with bilingual header
  let descriptionHTML = `
    <h3 style="margin-top:1.2rem; display: flex; justify-content: space-between;">
      <span>Description</span>
      <span class="arabic-text" style="font-family: 'Almarai', sans-serif;">معلومات المنتج</span>
    </h3>
    <p>${product.detailedDescription || product.description}</p>
  `;

  if (product.detailedDescriptionAr || product.descriptionAr) {
    descriptionHTML += `<p class="arabic-text" style="margin-top:0.8rem; font-family: 'Almarai', sans-serif; direction: rtl; text-align: right;">${product.detailedDescriptionAr || product.descriptionAr}</p>`;
  }

  if (product.colors) {
    descriptionHTML += `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.6rem; margin-top:1.2rem;">
        <div>
          <h3 style="margin:0 0 0.6rem 0;">Available Colors</h3>
          <p style="margin:0;">${product.colors}</p>
        </div>
        <div style="text-align:right;">
          <h3 style="margin:0 0 0.6rem 0; font-family: 'Almarai', sans-serif;">الألوان المتاحة</h3>
          <p style="margin:0; font-family: 'Almarai', sans-serif; direction: rtl;">${product.colorsAr || ''}</p>
        </div>
      </div>
    `;
  }

  if (product.packaging) {
    descriptionHTML += `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.6rem; margin-top:1.2rem;">
        <div>
          <h3 style="margin:0 0 0.6rem 0;">Packaging</h3>
          <p style="margin:0;">${product.packaging}</p>
        </div>
        <div style="text-align:right;">
          <h3 style="margin:0 0 0.6rem 0; font-family: 'Almarai', sans-serif;">التعبئة والتغليف</h3>
          <p style="margin:0; font-family: 'Almarai', sans-serif; direction: rtl;">${product.packagingAr || ''}</p>
        </div>
      </div>
    `;
  }

  if (product.specifications && product.specifications.length > 0) {
    descriptionHTML += `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.6rem; margin-top:1.2rem;">
        <div>
          <h3 style="margin:0 0 0.6rem 0;">Specifications</h3>
          <p style="margin:0; line-height:2;">${product.specifications.join('<br>')}</p>
        </div>
        <div style="text-align:right;">
          <h3 style="margin:0 0 0.6rem 0; font-family: 'Almarai', sans-serif;">المواصفات</h3>
          <p style="margin:0; line-height:2; font-family: 'Almarai', sans-serif; direction: rtl;">${product.specificationsAr ? product.specificationsAr.join('<br>') : ''}</p>
        </div>
      </div>
    `;
  }

  document.getElementById("productDescription").innerHTML = descriptionHTML;
  document.getElementById("productPrice").innerText = product.price + " AED";

  // Desktop gallery
  const gallery = document.getElementById("gallery");
  if (product.images && product.images.length > 0) {
    const isEmoji = !product.images[0].startsWith('http');
    
    if (isEmoji) {
      gallery.innerHTML = `
        <div class="image-gallery">
          <div class="main-image-container" style="font-size: 100px; display: flex; align-items: center; justify-content: center; min-height: 350px;">
            ${product.images[0]}
          </div>
        </div>
      `;
    } else {
      // Only show thumbnails if more than 1 image
      const thumbnailsHTML = product.images.length > 1 ? `
        <div class="thumbnail-strip">
          ${product.images.map((img, index) => `
            <img src="${img}" 
                 alt="${product.name} ${index + 1}" 
                 class="thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="changeMainImage('${img}', ${index})"
                 style="object-fit:contain;">
          `).join('')}
        </div>
      ` : '';
      
      gallery.innerHTML = `
        <div class="image-gallery">
          <div class="main-image-container">
            <img id="mainImage" src="${product.images[0]}" alt="${product.name}" class="main-product-image">
            <div class="zoom-hint">🔍 Click to zoom</div>
          </div>
          ${thumbnailsHTML}
        </div>
      `;
    }
  }

  // =====================
  // MOBILE VERSION
  // =====================
  document.getElementById("mobileProductTitle").innerText = product.name;
  document.getElementById("mobileProductTitleAr").innerText = product.nameAr || '';
  document.getElementById("mobileProductCategory").innerText = product.category;
  document.getElementById("mobileProductPrice").innerText = product.price + " AED";

  // Mobile carousel
  const mobileCarousel = document.getElementById("mobileCarousel");
  const mobileDots = document.getElementById("mobileDots");
  
  if (product.images && product.images.length > 0) {
    const isEmoji = !product.images[0].startsWith('http');
    
    if (isEmoji) {
      mobileCarousel.innerHTML = `
        <div class="mobile-carousel-slide">
          <div style="font-size: 80px;">${product.images[0]}</div>
        </div>
      `;
      mobileDots.innerHTML = '<div class="mobile-dot active"></div>';
    } else {
      // Create slides
      mobileCarousel.innerHTML = product.images.map((img, index) => `
        <div class="mobile-carousel-slide" data-index="${index}">
          <img src="${img}" alt="${product.name} ${index + 1}">
        </div>
      `).join('');
      
      // Create dots
      mobileDots.innerHTML = product.images.map((_, index) => `
        <div class="mobile-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
      `).join('');
      
      // Setup carousel scroll detection
      setupMobileCarousel();
      
      // Setup gallery click
      setupGalleryOverlay(product);
    }
  }

  // =====================
  // MOBILE DETAILS SECTION (Colors, Packaging, Specs, Description - in order)
  // =====================
  const detailsContainer = document.getElementById("mobileDetailsSection");
  let detailsHTML = '';

  // 1. Colors (if available)
  if (product.colors) {
    detailsHTML += `
      <div class="mobile-detail-block">
        <div class="mobile-detail-title">
          <span>Available Colors</span>
          <span class="arabic-text">الألوان المتاحة</span>
        </div>
        <div class="mobile-detail-content">
          <p>${product.colors}</p>
          ${product.colorsAr ? `<p class="arabic-text">${product.colorsAr}</p>` : ''}
        </div>
      </div>
    `;
  }

  // 2. Packaging (if available)
  if (product.packaging) {
    detailsHTML += `
      <div class="mobile-detail-block">
        <div class="mobile-detail-title">
          <span>Packaging</span>
          <span class="arabic-text">التعبئة والتغليف</span>
        </div>
        <div class="mobile-detail-content">
          <p>${product.packaging}</p>
          ${product.packagingAr ? `<p class="arabic-text">${product.packagingAr}</p>` : ''}
        </div>
      </div>
    `;
  }

  // 3. Specifications (if available)
  if (product.specifications && product.specifications.length > 0) {
    detailsHTML += `
      <div class="mobile-detail-block">
        <div class="mobile-detail-title">
          <span>Specifications</span>
          <span class="arabic-text">المواصفات</span>
        </div>
        <div class="mobile-detail-content">
          ${product.specifications.map((spec, i) => `
            <div class="mobile-spec-row">
              <span class="mobile-spec-en">${spec}</span>
              <span class="mobile-spec-ar arabic-text">${product.specificationsAr && product.specificationsAr[i] ? product.specificationsAr[i] : ''}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. Description (always show if available)
  const descEn = product.detailedDescription || product.description || '';
  const descAr = product.detailedDescriptionAr || product.descriptionAr || '';
  
  if (descEn || descAr) {
    detailsHTML += `
      <div class="mobile-detail-block">
        <div class="mobile-detail-content mobile-description-content">
          ${descEn ? `<p>${descEn}</p>` : ''}
          ${descAr ? `<p class="arabic-text">${descAr}</p>` : ''}
        </div>
      </div>
    `;
  }

  if (detailsContainer) {
    detailsContainer.innerHTML = detailsHTML;
  }

  // =====================
  // ADD TO CART BUTTONS
  // =====================
  const addToCartHandler = () => {
    // Get current cart from localStorage
    let localCart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = localCart.find(i => i.id === product.id);
    
    if (item) {
      item.quantity++;
    } else {
      localCart.push({ ...product, quantity: 1 });
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(localCart));
    
    // IMPORTANT: Sync app.js cart variable with localStorage
    // This is needed because app.js has its own cart variable
    if (typeof cart !== 'undefined') {
      // Clear and repopulate the app.js cart array
      cart.length = 0;
      localCart.forEach(item => cart.push(item));
    }
    
    // Update cart counts
    const totalItems = localCart.reduce((s, i) => s + i.quantity, 0);
    const cartCount = document.getElementById("cartCount");
    const bottomCartCount = document.getElementById("bottomCartCount");
    if (cartCount) cartCount.textContent = totalItems;
    if (bottomCartCount) bottomCartCount.textContent = totalItems;
    
    // Update cart display immediately (from app.js)
    if (typeof updateCart === 'function') {
      updateCart();
    }
    
    return true;
  };

  // Desktop button
  document.getElementById("addToCartBtn").onclick = function() {
    addToCartHandler();
    const btn = this;
    const originalText = btn.textContent;
    btn.textContent = "✓ Added!";
    btn.style.background = "#28a745";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
    }, 2000);
  };

  // Mobile button
  document.getElementById("mobileAddToCartBtn").onclick = function() {
    addToCartHandler();
    const btn = this;
    const originalText = btn.textContent;
    btn.textContent = "✓ Added! | تمت الإضافة";
    btn.style.background = "#28a745";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
    }, 2000);
  };

  // Desktop lightbox
  const mainImg = document.getElementById('mainImage');
  if (mainImg) {
    mainImg.style.cursor = 'zoom-in';
    mainImg.onclick = () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img src="${mainImg.src}" alt="${product.name}" class="lightbox-image">
        </div>
      `;
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      lightbox.onclick = (e) => {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
          document.body.removeChild(lightbox);
          document.body.style.overflow = 'auto';
        }
      };
    };
  }
}

// Mobile carousel scroll handler
function setupMobileCarousel() {
  const carousel = document.getElementById('mobileCarousel');
  const dots = document.querySelectorAll('.mobile-dot');
  
  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const slideWidth = carousel.offsetWidth;
    const currentIndex = Math.round(scrollLeft / slideWidth);
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  });
  
  // Click on dot to scroll
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      carousel.scrollTo({
        left: index * carousel.offsetWidth,
        behavior: 'smooth'
      });
    });
  });
}

// Gallery overlay (click image to open full gallery)
function setupGalleryOverlay(product) {
  const carousel = document.getElementById('mobileCarousel');
  const overlay = document.getElementById('galleryOverlay');
  const galleryScroll = document.getElementById('galleryScroll');
  const closeBtn = document.getElementById('galleryClose');
  const bottomNav = document.getElementById('mobileBottomNav');
  
  // Click on carousel to open gallery
  carousel.addEventListener('click', () => {
    // Build vertical gallery
    galleryScroll.innerHTML = product.images.map((img, index) => `
      <div class="gallery-image-wrapper">
        <img src="${img}" alt="${product.name} ${index + 1}">
      </div>
    `).join('');
    
    // Show overlay, hide bottom nav
    overlay.classList.add('active');
    if (bottomNav) bottomNav.style.display = 'none';
    document.body.style.overflow = 'hidden';
  });
  
  // Close gallery
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    if (bottomNav) bottomNav.style.display = '';
    document.body.style.overflow = '';
  });
  
  // Also close on overlay background click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      if (bottomNav) bottomNav.style.display = '';
      document.body.style.overflow = '';
    }
  });
}

// Change main image (desktop)
window.changeMainImage = function(imgSrc, index) {
  const mainImg = document.getElementById('mainImage');
  mainImg.src = imgSrc;
  
  document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
};

// =====================
// SEARCH FUNCTIONALITY
// =====================
function setupSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  
  const doSearch = () => {
    const term = searchInput.value.trim();
    if (term) {
      // Redirect to index.html with search parameter
      window.location.href = `index.html?search=${encodeURIComponent(term)}`;
    } else {
      window.location.href = 'index.html';
    }
  };
  
  if (searchBtn) {
    searchBtn.onclick = doSearch;
  }
  
  if (searchInput) {
    searchInput.onkeypress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    };
  }
}

// =====================
// CART TOGGLE FUNCTIONALITY (shared by mobile and desktop)
// =====================
function toggleCartSidebar() {
  const cartSidebar = document.getElementById('cartSidebar');
  const bottomCartBtn = document.getElementById('bottomCartBtn');
  const bottomHomeBtn = document.getElementById('bottomHomeBtn');
  
  if (cartSidebar) {
    cartSidebar.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
      if (bottomCartBtn) bottomCartBtn.classList.add('cart-active');
      if (bottomHomeBtn) bottomHomeBtn.classList.remove('home-active');
      // Update cart display
      if (typeof updateCart === 'function') {
        updateCart();
      }
    } else {
      if (bottomCartBtn) bottomCartBtn.classList.remove('cart-active');
    }
  }
}

// =====================
// BOTTOM NAV FUNCTIONALITY
// =====================
function setupBottomNav() {
  const bottomHomeBtn = document.getElementById('bottomHomeBtn');
  const bottomCartBtn = document.getElementById('bottomCartBtn');
  const bottomMenuBtn = document.getElementById('bottomMenuBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  
  // Home button - go to index.html
  if (bottomHomeBtn) {
    bottomHomeBtn.onclick = function() {
      window.location.href = 'index.html';
    };
  }
  
  // Cart button - toggle cart sidebar
  if (bottomCartBtn) {
    bottomCartBtn.onclick = toggleCartSidebar;
  }
  
  // Menu button - show mobile menu overlay
  if (bottomMenuBtn) {
    bottomMenuBtn.onclick = function() {
      // Close cart if open
      if (cartSidebar && cartSidebar.classList.contains('active')) {
        cartSidebar.classList.remove('active');
        if (bottomCartBtn) bottomCartBtn.classList.remove('cart-active');
      }
      
      toggleMobileMenu();
    };
  }
  
  // Close cart button
  const closeCart = document.getElementById('closeCart');
  if (closeCart) {
    closeCart.onclick = function() {
      if (cartSidebar) {
        cartSidebar.classList.remove('active');
        if (bottomCartBtn) bottomCartBtn.classList.remove('cart-active');
      }
    };
  }
  
  // Desktop cart icon (in nav)
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.onclick = toggleCartSidebar;
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  let overlay = document.querySelector('.mobile-menu-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.innerHTML = `
      <div class="mobile-menu">
        <a href="index.html#products" onclick="closeMobileMenu()"><span class="menu-en">🛍️ Shop</span> | <span class="menu-ar">تسوق</span></a>
        <a href="index.html?showAbout=true#about" onclick="closeMobileMenu()"><span class="menu-en">ℹ️ About</span> | <span class="menu-ar">من نحن</span></a>
        <a href="index.html#contact" onclick="closeMobileMenu()"><span class="menu-en">📧 Contact</span> | <span class="menu-ar">اتصل بنا</span></a>
        <a href="index.html#terms" onclick="closeMobileMenu()"><span class="menu-en">📋 Terms</span> | <span class="menu-ar">الشروط</span></a>
      </div>
    `;
    document.body.appendChild(overlay);
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeMobileMenu();
      }
    };
  }
  
  overlay.classList.toggle('active');
}

function closeMobileMenu() {
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// =====================
// INITIALIZE
// =====================
window.addEventListener('DOMContentLoaded', () => {
  // Update cart count
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  
  const cartCount = document.getElementById("cartCount");
  const bottomCartCount = document.getElementById("bottomCartCount");
  if (cartCount) cartCount.textContent = totalItems;
  if (bottomCartCount) bottomCartCount.textContent = totalItems;
  
  // Setup search
  setupSearch();
  
  // Setup bottom nav
  setupBottomNav();
});

// Start loading product page
initProductPage();
