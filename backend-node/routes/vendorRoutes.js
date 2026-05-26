const express = require('express');
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

const router = express.Router();

const requireSeller = [requireAuth, (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ detail: 'Access denied: Seller only.' });
  }
  next();
}];

// GET /api/vendors/me/dashboard
router.get('/me/dashboard', requireSeller, async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Fetch vendor products
    const products = await Product.find({ vendor_id: vendorId }).sort({ createdAt: -1 });
    const productIds = products.map(p => p._id);

    // Fetch orders containing vendor's products
    // We search for any order that has an item with product_id in productIds
    const orders = await Order.find({ 'items.product_id': { $in: productIds } });

    // Calculate revenue (only from the vendor's specific products in those orders)
    let totalRevenue = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productIds.some(pid => pid.equals(item.product_id))) {
          totalRevenue += (item.price * item.quantity);
        }
      });
    });

    const user = await User.findById(vendorId);

    // Calculate seller's average rating across all products
    const ratingAgg = await Review.aggregate([
      { $match: { product_id: { $in: productIds } } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const avg_rating = ratingAgg.length > 0 ? parseFloat(ratingAgg[0].avg.toFixed(2)) : 0;
    const total_reviews = ratingAgg.length > 0 ? ratingAgg[0].count : 0;

    // Recent reviews on vendor products
    const recent_reviews = await Review.find({ product_id: { $in: productIds } })
      .populate('user_id', 'full_name')
      .populate('product_id', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      business_name: user.full_name,
      total_revenue: totalRevenue,
      orders_count: orders.length,
      products_count: products.length,
      products: products,
      avg_rating,
      total_reviews,
      recent_reviews: recent_reviews.map(r => ({
        id: r._id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.createdAt,
        reviewer_name: r.user_id?.full_name || 'Anonymous',
        product_name: r.product_id?.name || 'Unknown Product'
      }))
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/vendors/products
router.post('/products', requireSeller, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      vendor_id: req.user._id
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
