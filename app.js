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

// Category translations
const categoryTranslations = {
    "All Products": "جميع المنتجات",
    "Workspace": "مساحة العمل",
    "Phone Accessories": "إكسسوارات الهاتف",
    "Home": "المنزل"
};

// ==========================================
// WHATSAPP NUMBER - CHANGE THIS!
// ==========================================
const WHATSAPP_NUMBER = "971XXXXXXXXX";

// ==========================================
// DELIVERY FEES STRUCTURE
// ==========================================
const deliveryZones = {
    dubai: {
        name: "Dubai",
        nameAr: "دبي",
        fee: 15,
        freeThreshold: 150
    },
    sharjah_ajman: {
        name: "Sharjah / Ajman",
        nameAr: "الشارقة / عجمان",
        fee: 20,
        freeThreshold: 200
    },
    abu_dhabi: {
        name: "Abu Dhabi",
        nameAr: "أبو ظبي",
        fee: 30,
        freeThreshold: 250
    },
    other: {
        name: "Other Emirates",
        nameAr: "إمارات أخرى",
        fee: 45,
        freeThreshold: 350
    }
};

const DELIVERY_TIME = "2-5 business days";
const DELIVERY_TIME_AR = "٢-٥ أيام عمل";

// ==========================================
// POLICIES CONTENT (BILINGUAL)
// ==========================================

const policies = {
    shipping: `
        <h2>Shipping & Delivery</h2>
        <h2 class="arabic-heading">الشحن والتوصيل</h2>
        
        <p><strong>Coverage:</strong> We currently deliver within the UAE only.</p>
        <p class="arabic-text"><strong>التغطية:</strong> نقوم حالياً بالتوصيل داخل الإمارات فقط.</p>
        
        <p><strong>Processing Time:</strong> Orders are processed within 24–48 hours of payment confirmation.</p>
        <p class="arabic-text"><strong>وقت المعالجة:</strong> يتم معالجة الطلبات خلال ٢٤-٤٨ ساعة من تأكيد الدفع.</p>
        
        <p><strong>Delivery Timeline:</strong> 2-5 business days for all locations.</p>
        <p class="arabic-text"><strong>مدة التوصيل:</strong> ٢-٥ أيام عمل لجميع المواقع.</p>

        <p><strong>Delivery Fees:</strong></p>
        <p class="arabic-text"><strong>رسوم التوصيل:</strong></p>
        <ul>
            <li><strong>Dubai:</strong> 15 AED (FREE on orders over 150 AED)</li>
            <li class="arabic-text"><strong>دبي:</strong> ١٥ درهم (مجاناً للطلبات فوق ١٥٠ درهم)</li>
            
            <li><strong>Sharjah / Ajman:</strong> 20 AED (FREE on orders over 200 AED)</li>
            <li class="arabic-text"><strong>الشارقة / عجمان:</strong> ٢٠ درهم (مجاناً للطلبات فوق ٢٠٠ درهم)</li>
            
            <li><strong>Abu Dhabi:</strong> 30 AED (FREE on orders over 250 AED)</li>
            <li class="arabic-text"><strong>أبو ظبي:</strong> ٣٠ درهم (مجاناً للطلبات فوق ٢٥٠ درهم)</li>
            
            <li><strong>Other Emirates:</strong> 45 AED (FREE on orders over 350 AED)</li>
            <li class="arabic-text"><strong>إمارات أخرى:</strong> ٤٥ درهم (مجاناً للطلبات فوق ٣٥٠ درهم)</li>
        </ul>

        <p><strong>Tracking:</strong> You will receive tracking information via WhatsApp once your order ships.</p>
        <p class="arabic-text"><strong>التتبع:</strong> ستتلقى معلومات التتبع عبر واتساب بمجرد شحن طلبك.</p>
    `,
    returns: `
        <h2>Returns & Refunds</h2>
        <h2 class="arabic-heading">الإرجاع والاسترداد</h2>
        
        <p><strong>7-Day Return Window:</strong> Returns are accepted within 7 days of delivery only. No exceptions.</p>
        <p class="arabic-text"><strong>فترة الإرجاع ٧ أيام:</strong> يتم قبول المرتجعات خلال ٧ أيام من التسليم فقط. بدون استثناءات.</p>
        
        <p><strong>Unopened Items Only:</strong> Items must be completely unused, unopened, and in original sealed packaging with all tags and seals intact.</p>
        <p class="arabic-text"><strong>المنتجات غير المفتوحة فقط:</strong> يجب أن تكون المنتجات غير مستخدمة تماماً، غير مفتوحة، وفي العبوة الأصلية المغلقة مع جميع الملصقات والأختام سليمة.</p>
        
        <p><strong>No Returns on Opened Items:</strong> Once opened, used, or packaging is damaged, items cannot be returned for any reason.</p>
        <p class="arabic-text"><strong>لا إرجاع للمنتجات المفتوحة:</strong> بمجرد الفتح أو الاستخدام أو تلف العبوة، لا يمكن إرجاع المنتجات لأي سبب.</p>
        
        <p><strong>Return Shipping Costs:</strong> All return shipping costs are the buyer's responsibility. We do not provide prepaid return labels.</p>
        <p class="arabic-text"><strong>تكاليف شحن الإرجاع:</strong> جميع تكاليف شحن الإرجاع على عاتق المشتري. لا نوفر ملصقات إرجاع مدفوعة مسبقاً.</p>
        
        <p><strong>Inspection Required:</strong> All returns are inspected upon receipt. Items showing any signs of use, missing components, or damaged packaging will be rejected.</p>
        <p class="arabic-text"><strong>الفحص مطلوب:</strong> يتم فحص جميع المرتجعات عند الاستلام. سيتم رفض المنتجات التي تظهر أي علامات استخدام أو مكونات مفقودة أو عبوة تالفة.</p>
        
        <p><strong>Refund Process:</strong> Refunds are issued only after inspection confirms the item is unopened and undamaged. Processing takes 5-7 business days after we receive the return.</p>
        <p class="arabic-text"><strong>عملية الاسترداد:</strong> يتم إصدار المبالغ المستردة فقط بعد أن يؤكد الفحص أن المنتج غير مفتوح وغير تالف. تستغرق المعالجة ٥-٧ أيام عمل بعد استلام الإرجاع.</p>
        
        <p><strong>Non-Returnable Items:</strong> Sale items, clearance items, items with damaged packaging, or items showing any signs of use are not eligible for return.</p>
        <p class="arabic-text"><strong>المنتجات غير القابلة للإرجاع:</strong> منتجات التخفيض، منتجات التصفية، المنتجات ذات العبوة التالفة، أو المنتجات التي تظهر أي علامات استخدام غير مؤهلة للإرجاع.</p>
        
        <p><strong>How to Initiate a Return:</strong> Contact us via WhatsApp or email within 7 days of delivery with your order number and reason for return.</p>
        <p class="arabic-text"><strong>كيفية بدء الإرجاع:</strong> اتصل بنا عبر واتساب أو البريد الإلكتروني خلال ٧ أيام من التسليم مع رقم طلبك وسبب الإرجاع.</p>
    `,
    privacy: `
        <h2>Privacy Policy</h2>
        <h2 class="arabic-heading">سياسة الخصوصية</h2>
        
        <p><strong>Information Collection:</strong> We collect only the information necessary to process and fulfill your order (name, phone number, delivery address, email).</p>
        <p class="arabic-text"><strong>جمع المعلومات:</strong> نجمع فقط المعلومات الضرورية لمعالجة وتنفيذ طلبك (الاسم، رقم الهاتف، عنوان التوصيل، البريد الإلكتروني).</p>
        
        <p><strong>Data Usage:</strong> Your information is used solely for order processing, delivery coordination, and customer support.</p>
        <p class="arabic-text"><strong>استخدام البيانات:</strong> تُستخدم معلوماتك فقط لمعالجة الطلبات، وتنسيق التوصيل، ودعم العملاء.</p>
        
        <p><strong>Third-Party Sharing:</strong> Your data is never sold or shared with third parties except for delivery partners who need your address to complete delivery.</p>
        <p class="arabic-text"><strong>المشاركة مع أطراف ثالثة:</strong> لا يتم بيع بياناتك أو مشاركتها مع أطراف ثالثة أبداً باستثناء شركاء التوصيل الذين يحتاجون إلى عنوانك لإتمام التوصيل.</p>
        
        <p><strong>Data Security:</strong> We use secure communication channels (WhatsApp, encrypted email) to protect your information.</p>
        <p class="arabic-text"><strong>أمن البيانات:</strong> نستخدم قنوات اتصال آمنة (واتساب، بريد إلكتروني مشفر) لحماية معلوماتك.</p>
        
        <p><strong>Your Rights:</strong> You may request deletion of your data at any time by contacting us.</p>
        <p class="arabic-text"><strong>حقوقك:</strong> يمكنك طلب حذف بياناتك في أي وقت عن طريق الاتصال بنا.</p>
    `,
    terms: `
        <h2>Terms of Service</h2>
        <h2 class="arabic-heading">شروط الخدمة</h2>
        
        <p><strong>Order Agreement:</strong> By placing an order, you agree to provide accurate information and accept these terms.</p>
        <p class="arabic-text"><strong>اتفاقية الطلب:</strong> بتقديم طلب، فإنك توافق على تقديم معلومات دقيقة وقبول هذه الشروط.</p>
        
        <p><strong>Payment:</strong> Full payment is required before order processing begins. We accept bank transfer and online payment methods.</p>
        <p class="arabic-text"><strong>الدفع:</strong> يلزم الدفع الكامل قبل بدء معالجة الطلب. نقبل التحويل البنكي وطرق الدفع الإلكتروني.</p>
        
        <p><strong>Product Accuracy:</strong> We strive to display accurate product information and images. Actual products may vary slightly from images shown.</p>
        <p class="arabic-text"><strong>دقة المنتج:</strong> نسعى لعرض معلومات وصور المنتج بدقة. قد تختلف المنتجات الفعلية قليلاً عن الصور المعروضة.</p>
        
        <p><strong>Right to Refuse Service:</strong> ORLO reserves the right to refuse or cancel any order if fraud, misuse, or policy violations are detected.</p>
        <p class="arabic-text"><strong>الحق في رفض الخدمة:</strong> تحتفظ أورلو بالحق في رفض أو إلغاء أي طلب في حالة اكتشاف احتيال أو إساءة استخدام أو انتهاكات للسياسة.</p>
        
        <p><strong>Liability:</strong> ORLO is not responsible for delivery delays caused by courier services, incorrect addresses provided by customers, or force majeure events.</p>
        <p class="arabic-text"><strong>المسؤولية:</strong> أورلو غير مسؤولة عن تأخيرات التوصيل الناتجة عن خدمات التوصيل، أو العناوين غير الصحيحة المقدمة من العملاء، أو أحداث القوة القاهرة.</p>
        
        <p><strong>Changes to Terms:</strong> We reserve the right to update these terms at any time. Continued use of our service constitutes acceptance of updated terms.</p>
        <p class="arabic-text"><strong>التغييرات على الشروط:</strong> نحتفظ بالحق في تحديث هذه الشروط في أي وقت. الاستخدام المستمر لخدمتنا يشكل قبولاً للشروط المحدثة.</p>
        
        <p><strong>Contact:</strong> For questions about these terms, contact us at info@orlostore.com</p>
        <p class="arabic-text"><strong>الاتصال:</strong> للاستفسارات حول هذه الشروط، اتصل بنا على info@orlostore.com</p>
    `
};

// ==========================================
// STATE (PERSISTED IN LOCALSTORAGE)
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedCategory = "All Products";
let selectedDeliveryZone = localStorage.getItem("deliveryZone") || "dubai";

// ==========================================
// UTILITIES
// ==========================================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function saveDeliveryZone() {
    localStorage.setItem("deliveryZone", selectedDeliveryZone);
}

function getCategories() {
    return ["All Products", ...new Set(products.map(p => p.category))];
}

function calculateDeliveryFee(subtotal) {
    const zone = deliveryZones[selectedDeliveryZone];
    if (subtotal >= zone.freeThreshold) {
        return 0;
    }
    return zone.fee;
}

function getAmountUntilFreeDelivery(subtotal) {
    const zone = deliveryZones[selectedDeliveryZone];
    if (subtotal >= zone.freeThreshold) {
        return 0;
    }
    return zone.freeThreshold - subtotal;
}

// ==========================================
// RENDERING
// ==========================================

function renderProducts(list) {
    const grid = document.getElementById("productsGrid");

    if (!list.length) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#999;padding:3rem;">No products found</p>`;
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
                onclick="loadProducts('${cat}')">
            ${cat}<br>
            <span class="arabic-text" style="font-size: 0.9rem; margin-top: 3px;">${categoryTranslations[cat]}</span>
        </button>
    `).join("");
}

function updateCategoryButtons() {
    document.querySelectorAll(".category-btn").forEach(btn => {
        const catText = btn.textContent.trim().split('\n')[0];
        btn.classList.toggle("active", catText === selectedCategory);
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
    const cartFooter = document.querySelector(".cart-footer");

    if (!cart.length) {
        cartItems.innerHTML = "<p style='text-align:center;padding:3rem;color:#999;font-size:1.1rem;'>Your cart is empty</p>";
        cartCount.textContent = 0;
        cartTotal.textContent = "0.00 AED";
        const deliverySection = document.getElementById("deliverySection");
        if (deliverySection) deliverySection.style.display = "none";
        return;
    }

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = calculateDeliveryFee(subtotal);
    const total = subtotal + deliveryFee;
    const amountUntilFree = getAmountUntilFreeDelivery(subtotal);
    const zone = deliveryZones[selectedDeliveryZone];

    cartCount.textContent = totalItems;

    cartItems.innerHTML = cart.map(i => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem; border-bottom:1px solid #eee;">
            <div style="flex:1;">
                <strong style="font-size:1.1rem; color:#2c4a5c;">${i.name}</strong><br>
                <span style="color:#888; font-size:1rem;">${i.price} AED × ${i.quantity}</span><br>
                <span style="color:#e07856; font-weight:600; font-size:1.1rem;">${(i.price * i.quantity).toFixed(2)} AED</span>
            </div>
            <div style="display:flex; gap:0.75rem; align-items:center;">
                <button onclick="updateQuantity(${i.id}, -1)" style="padding:0.5rem 1rem; background:#f0f0f0; border:none; border-radius:4px; cursor:pointer; font-size:1.1rem; font-weight:600;">-</button>
                <span style="font-size:1.1rem; font-weight:600; min-width:30px; text-align:center;">${i.quantity}</span>
                <button onclick="updateQuantity(${i.id}, 1)" style="padding:0.5rem 1rem; background:#f0f0f0; border:none; border-radius:4px; cursor:pointer; font-size:1.1rem; font-weight:600;">+</button>
                <button onclick="removeFromCart(${i.id})" style="padding:0.5rem 1rem; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; margin-left:0.5rem; font-size:1.1rem;">✕</button>
            </div>
        </div>
    `).join("");

    // Update cart footer with delivery section
    cartFooter.innerHTML = `
        <div id="deliverySection" class="delivery-section">
            <div class="delivery-header">
                <span class="delivery-icon">🚚</span>
                <span>Delivery Location / موقع التوصيل</span>
            </div>
            <select id="deliveryZoneSelect" class="delivery-select" onchange="changeDeliveryZone(this.value)">
                ${Object.entries(deliveryZones).map(([key, zone]) => `
                    <option value="${key}" ${key === selectedDeliveryZone ? 'selected' : ''}>
                        ${zone.name} / ${zone.nameAr}
                    </option>
                `).join('')}
            </select>
            ${amountUntilFree > 0 ? `
                <div class="free-delivery-hint">
                    Add <strong>${amountUntilFree.toFixed(2)} AED</strong> more for FREE delivery!<br>
                    <span style="font-family: 'Almarai', sans-serif; direction: rtl; display: block; margin-top: 5px;">
                        أضف <strong>${amountUntilFree.toFixed(2)} درهم</strong> للحصول على توصيل مجاني!
                    </span>
                </div>
            ` : `
                <div class="free-delivery-achieved">
                    ✓ You qualify for FREE delivery! / توصيل مجاني!
                </div>
            `}
            <div class="delivery-time">
                <span>Delivery: ${DELIVERY_TIME} / التوصيل: ${DELIVERY_TIME_AR}</span>
            </div>
        </div>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal / المجموع الفرعي:</span>
                <span>${subtotal.toFixed(2)} AED</span>
            </div>
            <div class="summary-row delivery-row">
                <span>Delivery / التوصيل (${zone.name} / ${zone.nameAr}):</span>
                <span class="${deliveryFee === 0 ? 'free-delivery' : ''}">${deliveryFee === 0 ? 'FREE / مجاني' : deliveryFee.toFixed(2) + ' AED'}</span>
            </div>
            <div class="cart-total">
                <span>Total / الإجمالي:</span>
                <span id="cartTotal">${total.toFixed(2)} AED</span>
            </div>
        </div>
        <button class="checkout-btn stripe-btn" id="stripeCheckoutBtn" onclick="checkoutWithStripe()">
            Pay with Card / الدفع بالبطاقة
        </button>
        <button class="checkout-btn whatsapp-btn" id="checkoutBtn" onclick="checkout()">
            Order via WhatsApp / اطلب عبر واتساب
        </button>
    `;
}

function changeDeliveryZone(zone) {
    selectedDeliveryZone = zone;
    saveDeliveryZone();
    updateCart();
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

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = calculateDeliveryFee(subtotal);
    const total = subtotal + deliveryFee;
    const zone = deliveryZones[selectedDeliveryZone];

    let message = "Hello ORLO, I'd like to order:%0A%0A";

    cart.forEach(i => {
        message += `• ${i.name} × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)} AED%0A`;
    });

    message += `%0A─────────────────%0A`;
    message += `Subtotal: ${subtotal.toFixed(2)} AED%0A`;
    message += `Delivery (${zone.name}): ${deliveryFee === 0 ? 'FREE' : deliveryFee.toFixed(2) + ' AED'}%0A`;
    message += `%0A*Total: ${total.toFixed(2)} AED*`;
    message += `%0A%0ADelivery Location: ${zone.name}`;
    message += `%0AEstimated Delivery: ${DELIVERY_TIME}`;
    message += `%0A%0APlease confirm my delivery address and payment method.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

// ==========================================
// CHECKOUT (STRIPE)
// ==========================================

async function checkoutWithStripe() {
    if (!cart.length) {
        alert("Your cart is empty!");
        return;
    }

    const stripeBtn = document.getElementById('stripeCheckoutBtn');
    if (stripeBtn) {
        stripeBtn.disabled = true;
        stripeBtn.textContent = 'Processing... / جارٍ المعالجة...';
    }

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    quantity: item.quantity
                })),
                deliveryZone: selectedDeliveryZone,
                successUrl: window.location.origin + '/?success=true',
                cancelUrl: window.location.origin + '/?canceled=true'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create checkout session');
        }

        if (data.url) {
            window.location.href = data.url;
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Checkout failed: ' + error.message);

        if (stripeBtn) {
            stripeBtn.disabled = false;
            stripeBtn.textContent = 'Pay with Card / الدفع بالبطاقة';
        }
    }
}

// ==========================================
// POLICY MODAL
// ==========================================

function openPolicy(type) {
    document.getElementById("policyText").innerHTML = policies[type];
    document.getElementById("policyModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closePolicy() {
    document.getElementById("policyModal").style.display = "none";
    document.body.style.overflow = "auto";
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function showNotification(message) {
