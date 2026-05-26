/**
 * seed_reviews.js
 * Seeds realistic fake reviews for all existing products and sellers.
 * Run once: node seed_reviews.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');
const Product = require('./models/Product');
const User = require('./models/User');

const reviewComments = [
  "Absolutely stunning quality! The fabric feels premium and the stitching is immaculate.",
  "Exceeded my expectations. Arrived quickly and the packaging was beautiful.",
  "Great product, but the sizing runs slightly small. Order one size up.",
  "Incredible value for money. This is easily the best purchase I've made this season.",
  "Beautiful craftsmanship. My friends keep asking where I bought it.",
  "The color is even more vibrant in person. Very happy with this purchase.",
  "Good quality overall, though delivery took a bit longer than expected.",
  "Perfect fit! The material is breathable and comfortable for all-day wear.",
  "Luxury feel at an accessible price point. Highly recommend this seller.",
  "Minor stitching issue but the seller resolved it immediately. 5 stars for service.",
  "Gorgeous piece! I wore it to a wedding and received so many compliments.",
  "Exactly as described. Photos are accurate to the actual product.",
  "The detailing is exquisite. You can tell this is made with care.",
  "I've bought from this vendor before and the quality is always consistent.",
  "Lovely product but the color faded slightly after the first wash.",
  "Exceptional quality. Would buy from this seller again without hesitation.",
  "The fit is perfect and the material feels very luxurious against the skin.",
  "Great product! Fast shipping and well-packaged to prevent damage.",
  "Slightly disappointed with the quality for this price point.",
  "Absolutely love it! Buying another one in a different color.",
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Luxora');

  // Fetch all products and buyer accounts
  const products = await Product.find({}).limit(60);
  const buyers = await User.find({ role: 'buyer' });

  if (products.length === 0) {
    console.log('⚠️  No products found. Please run your product sync first.');
    process.exit(1);
  }
  if (buyers.length === 0) {
    console.log('⚠️  No buyer accounts found. Creating a fake buyer for seeding.');
    // Create a mock buyer if none exist
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const fakeBuyer = new User({
      email: 'reviewer@dreamcart.com',
      full_name: 'DreamCart Reviewer',
      hashed_password: await bcrypt.hash('Password123!', salt),
      role: 'buyer'
    });
    await fakeBuyer.save();
    buyers.push(fakeBuyer);
  }

  // Clear existing reviews to avoid duplicates
  await Review.deleteMany({});
  console.log('🗑️  Cleared old reviews.');

  const reviewDocs = [];
  const ratingDistribution = [5, 5, 5, 4, 4, 4, 4, 3, 3, 2, 1]; // Skewed positive

  for (const product of products) {
    // Each product gets 3–8 reviews
    const numReviews = Math.floor(Math.random() * 6) + 3;
    const usedBuyers = new Set();

    for (let i = 0; i < numReviews; i++) {
      // Pick a random buyer (ensure uniqueness per product where possible)
      let buyer = buyers[Math.floor(Math.random() * buyers.length)];
      let attempts = 0;
      while (usedBuyers.has(buyer._id.toString()) && attempts < 10) {
        buyer = buyers[Math.floor(Math.random() * buyers.length)];
        attempts++;
      }
      usedBuyers.add(buyer._id.toString());

      const rating = ratingDistribution[Math.floor(Math.random() * ratingDistribution.length)];
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

      // Spread reviews over the past 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      reviewDocs.push({
        user_id: buyer._id,
        product_id: product._id,
        rating,
        comment,
        is_verified_purchase: Math.random() > 0.3,
        createdAt,
        updatedAt: createdAt
      });
    }
  }

  // Insert all reviews
  const inserted = await Review.insertMany(reviewDocs);
  console.log(`✅ Seeded ${inserted.length} reviews across ${products.length} products.`);

  // Recalculate average rating for each product
  console.log('🔄 Recalculating product average ratings...');
  for (const product of products) {
    const agg = await Review.aggregate([
      { $match: { product_id: product._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (agg.length > 0) {
      await Product.findByIdAndUpdate(product._id, {
        rating: parseFloat(agg[0].avg.toFixed(1)),
        reviews_count: agg[0].count
      });
    }
  }
  console.log('✅ Product ratings updated.');

  // Summary by seller
  const sellers = await User.find({ role: 'seller' });
  console.log('\n📊 Seller Rating Summary:');
  for (const seller of sellers) {
    const sellerProducts = await Product.find({ vendor_id: seller._id });
    const pIds = sellerProducts.map(p => p._id);
    const agg = await Review.aggregate([
      { $match: { product_id: { $in: pIds } } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (agg.length > 0) {
      console.log(`  ${seller.full_name} (${seller.email}): ⭐ ${agg[0].avg.toFixed(2)} avg (${agg[0].count} reviews)`);
    } else {
      console.log(`  ${seller.full_name}: No reviews yet`);
    }
  }

  await mongoose.disconnect();
  console.log('\n🎉 Seeding complete!');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
