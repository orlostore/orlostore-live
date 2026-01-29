// Google Sheets CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPRs_Wd4lFMv_WF6qfxHffAauQ8DoWvrPAIgs0vmz4m1lwBvIwqe0pLcsQc2PcA4xo96IsP5J0v50L/pub?output=csv';

// Products array - will be populated from Google Sheets
let products = [];

// Category translations
const categoryTranslations = {
  "All Products": "جميع المنتجات",
  "Workspace": "مساحة العمل",
  "Home": "المنزل",
  "Phone Accessories": "إكسسوارات الهاتف",
  "Car Accessories": "إكسسوارات السيارة",
  "LED Lights": "إضاءة LED"
};

// Parse CSV to array of objects
function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Handle CSV with quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    data.push(obj);
  }
  return data;
}

// Convert sheet row to product object
function rowToProduct(row, index) {
  // Build images array
  const images = [];
  if (row.mainImage) images.push(row.mainImage);
  if (row.image2) images.push(row.image2);
  if (row.image3) images.push(row.image3);
  if (row.image4) images.push(row.image4);
  if (row.image5) images.push(row.image5);
  
  // If no images, use placeholder emoji
  if (images.length === 0) {
    images.push('📦');
  }
  
  // Parse specifications (split by |)
  const specs = row.specifications ? row.specifications.split('|').map(s => s.trim()).filter(s => s) : [];
  const specsAr = row.specificationsAr ? row.specificationsAr.split('|').map(s => s.trim()).filter(s => s) : [];
  
  return {
    id: index + 1,
    name: row.name || '',
    nameAr: row.nameAR || row.nameAr || '',
    slug: row.slug || '',
    description: row.description || '',
    descriptionAr: row.descriptionAr || '',
    detailedDescription: row.description || '',
    detailedDescriptionAr: row.descriptionAr || '',
    price: parseFloat(row.price) || 0,
    category: row.category || 'Workspace',
    featured: row.featured === '1' || row.featured === 'true' || row.featured === 'TRUE',
    image: images[0],
    images: images,
    colors: row.colors || '',
    colorsAr: row.colorsAR || row.colorsAr || '',
    packaging: row.packaging || '',
    packagingAr: row.packagingAr || '',
    specifications: specs,
    specificationsAr: specsAr,
    quantity: parseInt(row.quantity) || 0
  };
}

// Fetch products from Google Sheets
async function fetchProducts() {
  try {
    const response = await fetch(SHEET_URL);
    const csv = await response.text();
    const rows = parseCSV(csv);
    
    products = rows
      .filter(row => row.name && row.name.trim()) // Only rows with names
      .map((row, index) => rowToProduct(row, index));
    
    console.log('✅ Loaded', products.length, 'products from Google Sheets');
    return products;
  } catch (error) {
    console.error('❌ Error loading products:', error);
    // Return empty array on error
    return [];
  }
}

// Initialize products on page load
async function initProducts() {
  await fetchProducts();
  
  // Trigger page update if functions exist
  if (typeof createCategoryFilters === 'function') {
    createCategoryFilters();
  }
  if (typeof loadProducts === 'function') {
    loadProducts();
  }
  if (typeof updateCart === 'function') {
    updateCart();
  }
}

// Auto-init when script loads
initProducts();
