const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const router = express.Router();

// All routes here are strictly Admin-only
router.use(requireAdmin);

// 1. Dashboard Global Stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await User.countDocuments({ role: 'seller' });
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from all orders
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    const unverified_vendors = await User.find({ role: 'seller', is_active: false });

    res.json({
      total_revenue: totalRevenue,
      total_vendors: totalVendors,
      total_orders: totalOrders,
      total_users: totalUsers,
      unverified_vendors
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// 2. Users Management
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find().select('-hashed_password').sort({ createdAt: -1 }).skip(skip).limit(limit);

    // For seller accounts, attach their avg_rating
    const enriched = await Promise.all(users.map(async u => {
      const obj = u.toObject ? u.toObject() : u;
      obj.id = obj._id;
      if (obj.role === 'seller') {
        const products = await Product.find({ vendor_id: obj._id }).select('_id');
        const pIds = products.map(p => p._id);
        if (pIds.length > 0) {
          const agg = await Review.aggregate([
            { $match: { product_id: { $in: pIds } } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
          ]);
          obj.avg_rating = agg.length > 0 ? parseFloat(agg[0].avg.toFixed(2)) : null;
        }
      }
      return obj;
    }));

    res.json({
      data: enriched,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// 2b. User Deep Dive
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashed_password');
    if (!user) return res.status(404).json({ detail: 'User not found' });

    // Fetch everything associated with this user
    const orders = await Order.find({ user_id: req.params.id }).sort({ createdAt: -1 });
    const products = await Product.find({ vendor_id: req.params.id }).sort({ createdAt: -1 });

    // Seller rating aggregation
    const productIds = products.map(p => p._id);
    let seller_rating = null;
    if (user.role === 'seller' && productIds.length > 0) {
      const agg = await Review.aggregate([
        { $match: { product_id: { $in: productIds } } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 },
          five: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          four: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          three: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          two: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          one: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        }}
      ]);
      if (agg.length > 0) {
        seller_rating = {
          avg_rating: parseFloat(agg[0].avg.toFixed(2)),
          total_reviews: agg[0].count,
          breakdown: [
            { stars: 5, count: agg[0].five },
            { stars: 4, count: agg[0].four },
            { stars: 3, count: agg[0].three },
            { stars: 2, count: agg[0].two },
            { stars: 1, count: agg[0].one },
          ]
        };
      }
    }

    res.json({
      user,
      orders,
      products,
      total_spent: orders.reduce((sum, o) => sum + o.total_amount, 0),
      total_products: products.length,
      seller_rating
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// 2c. Update User Profile & Password
router.put('/users/:id', async (req, res) => {
  try {
    const { full_name, email, role, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ detail: 'User not found' });

    if (full_name !== undefined) user.full_name = full_name;
    if (email !== undefined) {
      const existing = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ detail: 'Email already in use' });
      user.email = email;
    }
    if (role !== undefined) user.role = role;
    if (password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.hashed_password = await bcrypt.hash(password, salt);
    }

    await user.save();
    
    const orders = await Order.find({ user_id: req.params.id }).sort({ createdAt: -1 });
    const products = await Product.find({ vendor_id: req.params.id }).sort({ createdAt: -1 });

    res.json({
      user,
      orders,
      products,
      total_spent: orders.reduce((sum, o) => sum + o.total_amount, 0),
      total_products: products.length
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// 3. Orders Ledger
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments();
    const orders = await Order.find().populate('user_id', 'full_name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    // Map user_id to user to maintain frontend compatibility
    const formattedOrders = orders.map(o => {
      const orderObj = o.toObject ? o.toObject() : o;
      return {
        ...orderObj,
        user: orderObj.user_id,
        id: orderObj._id
      };
    });

    res.json({
      data: formattedOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// 4. Coupons Management
router.get('/coupons', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Coupon.countDocuments();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    res.json({
      data: coupons,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const { code, discount_percentage, valid_days } = req.body;
    
    // Calculate valid_until based on days
    const valid_until = new Date();
    valid_until.setDate(valid_until.getDate() + parseInt(valid_days || 30));

    const coupon = new Coupon({
      code,
      discount_percentage,
      valid_until
    });
    
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ detail: 'Coupon code already exists' });
    res.status(500).json({ detail: err.message });
  }
});

// 5. Product Management (Add Product)
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    // Explicitly set seller_id if needed, or leave to model default
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
