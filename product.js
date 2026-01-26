// Get product slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("product");

// Find product
const product = products.find(p => p.slug === slug);

if (!product) {
  document.body.innerHTML = "<h2 style='text-align:center;padding:3rem;'>Product not found</h2>";
  throw new Error("Product not found");
}

// Fill product data
document.getElementById("productTitle").innerText = product.name;
document.getElementById("productCategory").innerText = product.category;

// Build detailed description
let descriptionHTML = `
  <h3 style="margin-top:1.5rem;">Description</h3>
  <p>${product.detailedDescription || product.description}</p>
`;

console.log("Product detailedDescriptionAr:", product.detailedDescriptionAr); // Debug

if (product.detailedDescriptionAr) {
  descriptionHTML += `<p class="arabic-text" style="margin-top:1rem; font-family: 'Almarai', sans-serif; direction: rtl; text-align: right;">${product.detailedDescriptionAr}</p>`;
}

if (product.colors) {
  descriptionHTML += `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-top:1.5rem;">
      <div>
        <h3 style="margin:0 0 0.75rem 0;">Available Colors</h3>
        <p style="margin:0;">${product.colors}</p>
      </div>
      <div style="text-align:right;">
        <h3 style="margin:0 0 0.75rem 0; font-family: 'Almarai', sans-serif;">الألوان المتاحة</h3>
        <p style="margin:0; font-family: 'Almarai', sans-serif; direction: rtl;">${product.colorsAr || ''}</p>
      </div>
    </div>
  `;
}

if (product.packaging) {
  descriptionHTML += `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-top:1.5rem;">
      <div>
        <h3 style="margin:0 0 0.75rem 0;">Packaging</h3>
        <p style="margin:0;">${product.packaging}</p>
      </div>
      <div style="text-align:right;">
        <h3 style="margin:0 0 0.75rem 0; font-family: 'Almarai', sans-serif;">التعبئة والتغليف</h3>
        <p style="margin:0; font-family: 'Almarai', sans-serif; direction: rtl;">${product.packagingAr || ''}</p>
      </div>
    </div>
  `;
}

if (product.specifications && product.specifications.length > 0) {
  descriptionHTML += `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-top:1.5rem;">
      <div>
        <h3 style="margin:0 0 0.75rem 0;">Specifications</h3>
        <ul style="margin:0; padding-left:1.5rem; line-height:1.8;">
          ${product.specifications.map(spec => `<li>${spec}</li>`).join('')}
        </ul>
      </div>
      <div style="text-align:right;">
        <h3 style="margin:0 0 0.75rem 0; font-family: 'Almarai', sans-serif;">المواصفات</h3>
        ${product.specificationsAr ? `<ul style="margin:0; padding-right:1.5rem; line-height:1.8; font-family: 'Almarai', sans-serif; direction: rtl;">${product.specificationsAr.map(spec => `<li>${spec}</li>`).join('')}</ul>` : ''}
      </div>
    </div>
  `;
}

document.getElementById("productDescription").innerHTML = descriptionHTML;
document.getElementById("productPrice").innerText = product.price + " AED";

// Display images
const gallery = document.getElementById("gallery");
gallery.innerHTML = product.images
  .map(img => `<img src="${img}" alt="${product.name}" style="font-size:80px; text-align:center; display:block; margin:1rem auto;">`)
  .join("");

// Add to cart functionality (uses same cart logic as main page)
document.getElementById("addToCartBtn").onclick = () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find(i => i.id === product.id);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Update cart count if element exists
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    cartCount.textContent = totalItems;
  }
  
  alert(`${product.name} added to cart!`);
};

// Initialize cart count on page load
window.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    cartCount.textContent = totalItems;
  }
});
