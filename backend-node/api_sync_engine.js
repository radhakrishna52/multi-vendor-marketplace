const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const TARGET_CATEGORIES = [
  "Women Fashion", "Men Fashion", "Kids Fashion", "Beauty & Care", "Home & Living", "Accessories"
];

// Curated high-fidelity manual products to guarantee luxury assets in all key categories
const MANUAL_PRODUCTS = [
  // WOMEN FASHION
  { name: "Biba Floral Print Kurta Set", brand: "Biba", category: "Women Fashion", price: 45, image_url: "https://images.unsplash.com/photo-1583391733958-67524ce900a3?q=80&w=600", description: "Bespoke traditional floral prints on high-grade organic Indian cotton. Includes complete matching dupatta set." },
  { name: "Vero Moda Slip Dress", brand: "Vero Moda", category: "Women Fashion", price: 65, image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600", description: "Minimalist satin silhouette with premium slip strap aesthetics. Designed for evening transitions." },
  { name: "Levi's 711 Skinny Jeans", brand: "Levi's", category: "Women Fashion", price: 55, image_url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600", description: "Classic mid-rise shape with high elastic retention denim contours. Signature double stitch detailing." },
  { name: "H&M Oversized Denim Jacket", brand: "H&M", category: "Women Fashion", price: 40, image_url: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=600", description: "Urban oversized design constructed from heavy-grade recycled rigid indigo denim." },
  { name: "Prada Cleo Shoulder Bag", brand: "Prada", category: "Women Fashion", price: 1850, image_url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600", description: "Iconic brushed leather structure featuring curved base margins and enameled triangle logo." },
  { name: "Chanel Classic Double Flap", brand: "Chanel", category: "Women Fashion", price: 6500, image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600", description: "Quilted caviar skin leather coupled with polished gold-tone hardware links." },

  // MEN FASHION
  { name: "HRX Active Running T-Shirt", brand: "HRX", category: "Men Fashion", price: 20, image_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600", description: "Ultra-breathable rapid-dry performance fibers with targeted mesh ventilation panels." },
  { name: "Puma Suede Classic Sneakers", brand: "Puma", category: "Men Fashion", price: 80, image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600", description: "Authentic retro suede texture with cushioned ortholite soles and signature Puma stripe." },
  { name: "Wrogn Slim Fit Casual Shirt", brand: "Wrogn", category: "Men Fashion", price: 35, image_url: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=600", description: "100% fine thread count combed cotton with custom mandarin collar contours." },
  { name: "Roadster Men's Cargo Pants", brand: "Roadster", category: "Men Fashion", price: 40, image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600", description: "Heavy combat-inspired twill cotton featuring reinforced double utility pockets." },
  { name: "Moncler Quilted Down Jacket", brand: "Moncler", category: "Men Fashion", price: 1450, image_url: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600", description: "Signature high-shine lacquered nylon insulation filled with direct-injected goose feathers." },

  // KIDS FASHION
  { name: "Mothercare Cotton Onesie", brand: "Mothercare", category: "Kids Fashion", price: 15, image_url: "https://images.unsplash.com/photo-1522771930-78848d926053?q=80&w=600", description: "Hypoallergenic combed organic cotton with snap button diaper access seams." },
  { name: "GAP Kids Graphic Hoodie", brand: "GAP", category: "Kids Fashion", price: 30, image_url: "https://images.unsplash.com/photo-1560859253-3b10b00c92c5?q=80&w=600", description: "Cozy brushed fleece lining featuring the classic arching embroidered GAP signature." },
  { name: "Allen Solly Junior Boys Shirt", brand: "Allen Solly", category: "Kids Fashion", price: 25, image_url: "https://images.unsplash.com/photo-1519238263530-99dd6731a4e1?q=80&w=600", description: "Sophisticated miniature houndstooth cotton weave suitable for formal settings." },
  { name: "Disney Girls Frozen Dress", brand: "Disney", category: "Kids Fashion", price: 35, image_url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600", description: "Magical sparkling tulle overlay dress styled after Princess Elsa with back tie sash." },
  { name: "Ralph Lauren Kids Polo", brand: "Polo Ralph Lauren", category: "Kids Fashion", price: 45, image_url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600", description: "Combed cotton mesh piqué featuring signature multicolor pony embroidery." },

  // BEAUTY & CARE
  { name: "Lakme Absolute Matte Lipstick", brand: "Lakme", category: "Beauty & Care", price: 12, image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600", description: "12-hour high-pigment matte finish enriched with protective Argan oil extracts." },
  { name: "Mamaearth Onion Hair Oil", brand: "Mamaearth", category: "Beauty & Care", price: 8, image_url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600", description: "Organic Red Onion seed extracts combined with Black Seed Oil for active root reinforcement." },
  { name: "The Face Shop Vitamin C Serum", brand: "The Face Shop", category: "Beauty & Care", price: 22, image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600", description: "Active ascorbic acid complex for deep epidermal skin brightening and spot reduction." },
  { name: "Plum Green Tea Face Wash", brand: "Plum", category: "Beauty & Care", price: 10, image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600", description: "Soap-free foaming gel containing natural green tea extracts to control sebum production." },
  { name: "Estée Lauder Advanced Night Repair", brand: "Estée Lauder", category: "Beauty & Care", price: 105, image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600", description: "Patented cell-renewal synchronization serum to dramatically reduce visible aging." },

  // HOME & LIVING
  { name: "Home Centre Ceramic Vase", brand: "Home Centre", category: "Home & Living", price: 18, image_url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600", description: "Bespoke terracotta clay molded and hand-glazed with luxury neutral beige tones." },
  { name: "Bombay Dyeing Cotton Bedsheet", brand: "Bombay Dyeing", category: "Home & Living", price: 25, image_url: "https://images.unsplash.com/photo-1522771731478-4ea7b6a12b4e?q=80&w=600", description: "High 300 thread count percale weave cotton sheet set with double envelope pillows." },
  { name: "Chumbak Quirky Coffee Mug", brand: "Chumbak", category: "Home & Living", price: 8, image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600", description: "Joyful hand-painted original graphics on dense, insulating porcelain material." },
  { name: "IKEA Floor Reading Lamp", brand: "IKEA", category: "Home & Living", price: 45, image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600", description: "Sleek powder-coated steel chassis with adjustable visual light angle nodes." },
  { name: "Eames Lounge Chair & Ottoman", brand: "Herman Miller", category: "Home & Living", price: 6995, image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600", description: "Molded palisander veneer shell combined with premium black grain leather cushions." },

  // ACCESSORIES
  { name: "Fastrack Analog Watch", brand: "Fastrack", category: "Accessories", price: 35, image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600", description: "Youthful sporty metal case holding precise quartz calibration movement blocks." },
  { name: "Ray-Ban Classic Aviators", brand: "Ray-Ban", category: "Accessories", price: 120, image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600", description: "Iconic teardrop metal frames holding green-tinted G-15 high UV protection glass lenses." },
  { name: "Caprese Faux Leather Tote", brand: "Caprese", category: "Accessories", price: 40, image_url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600", description: "Spacious multi-compartment structured hand tote made from dense textured vegan leather." },
  { name: "Titan Gold Plated Chain", brand: "Titan", category: "Accessories", price: 55, image_url: "https://images.unsplash.com/photo-1599643478514-4a888e6e5eb6?q=80&w=600", description: "Bespoke 22k gold plated link weave chain with heavy interlocking security clasp." },
  { name: "Rolex Submariner Date", brand: "Rolex", category: "Accessories", price: 12500, image_url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600", description: "Oystersteel casing containing perpetual calibre 3235 movement and ceramic Cerachrom bezel." }
];

async function fetchExternalData() {
  console.log('Fetching external product data from DummyJSON API...');
  try {
    const res = await fetch('https://dummyjson.com/products?limit=150');
    const data = await res.json();
    return data.products;
  } catch (err) {
    console.error('Failed to fetch from DummyJSON. Using manual mock fallback.');
    return [];
  }
}

function mapCategory(dummyCat) {
  // Map DummyJSON category strings directly to our 6 active UI categories
  const map = {
    // Beauty & Skincare
    'fragrances': 'Beauty & Care',
    'skincare': 'Beauty & Care',
    'beauty': 'Beauty & Care',
    
    // Home & Decor
    'home-decoration': 'Home & Living',
    'furniture': 'Home & Living',
    'lighting': 'Home & Living',
    'kitchen-accessories': 'Home & Living',
    'groceries': 'Home & Living',
    
    // Women Fashion
    'tops': 'Women Fashion',
    'womens-dresses': 'Women Fashion',
    'womens-shoes': 'Women Fashion',
    'womens-bags': 'Women Fashion',
    
    // Men Fashion
    'mens-shirts': 'Men Fashion',
    'mens-shoes': 'Men Fashion',
    'mens-watches': 'Men Fashion',
    'mens-jackets': 'Men Fashion',
    
    // Accessories
    'smartphones': 'Accessories',
    'laptops': 'Accessories',
    'watches': 'Accessories',
    'womens-watches': 'Accessories',
    'womens-jewellery': 'Accessories',
    'sunglasses': 'Accessories',
    'automotive': 'Home & Living',
    'motorcycle': 'Home & Living'
  };
  return map[dummyCat] || 'Accessories';
}

async function runSync() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Wiping all current product listings for sync reload...');
    await Product.deleteMany({});
    
    // Retrieve or establish verified merchant account
    let sellers = await User.find({ role: 'seller' });
    if (sellers.length === 0) {
      console.log('Creating demo luxury seller account...');
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash('Password123!', salt);
      const seller = new User({
        email: 'apiseller@dreamcart.com',
        hashed_password: defaultPassword,
        full_name: 'Min Myntra Premium Vendor',
        role: 'seller',
        is_active: true
      });
      await seller.save();
      sellers = [seller];
    }
    const targetSeller = sellers[0];

    const rawProducts = await fetchExternalData();
    console.log(`Ingested ${rawProducts.length} API products. Aligning categories...`);

    const normalizedProducts = [];

    // 1. Ingest manual products to guarantee premium Unsplash imagery
    MANUAL_PRODUCTS.forEach(p => {
      const variants = [
        { color: 'Classic Black', size: 'M', sku: `SKU-MAN-${p.name.replace(/\s+/g, '-').substring(0, 8)}-M`, stock: 25 },
        { color: 'Royal Amber', size: 'L', sku: `SKU-MAN-${p.name.replace(/\s+/g, '-').substring(0, 8)}-L`, stock: 15 }
      ];
      normalizedProducts.push({
        name: p.name,
        brand: p.brand,
        description: p.description,
        price: Math.round(p.price * 85), // Convert to Indian Rupees (INR)
        stock: 50,
        category: p.category,
        image_url: p.image_url,
        variants: variants,
        ratings: {
          average: (Math.random() * 0.8 + 4.2).toFixed(1), // Premium 4.2 - 5.0
          count: Math.floor(Math.random() * 200) + 40
        },
        vendor_id: targetSeller._id
      });
    });

    // 2. Ingest API products mapped to 6 categories
    rawProducts.forEach(p => {
      // Avoid duplicate names with manually curated items
      const isDuplicate = MANUAL_PRODUCTS.some(m => m.name.toLowerCase() === p.title.toLowerCase());
      if (isDuplicate) return;

      const mappedCat = mapCategory(p.category);
      
      const variants = [
        { color: 'Standard Gray', size: 'Free', sku: `SKU-API-${p.id}-A`, stock: Math.floor(Math.random() * 40) + 10 },
        { color: 'Signature Elite', size: 'Free', sku: `SKU-API-${p.id}-B`, stock: Math.floor(Math.random() * 20) + 5 }
      ];

      normalizedProducts.push({
        name: p.title,
        brand: p.brand || 'Generic Luxury',
        description: p.description,
        price: Math.round(p.price * 85), // Convert to Indian Rupees (INR)
        stock: p.stock || 45,
        category: mappedCat,
        image_url: p.thumbnail || p.images[0] || 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600',
        variants: variants,
        ratings: {
          average: p.rating || (Math.random() * 1.5 + 3.3).toFixed(1),
          count: Math.floor(Math.random() * 300) + 30
        },
        vendor_id: targetSeller._id
      });
    });

    await Product.insertMany(normalizedProducts);
    console.log(`Successfully seeded ${normalizedProducts.length} premium products directly mapped to the 6 core categories!`);

    process.exit(0);
  } catch (err) {
    console.error('API Sync & Seeding failed:', err);
    process.exit(1);
  }
}

runSync();
