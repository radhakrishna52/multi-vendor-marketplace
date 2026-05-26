const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    res.json({
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.post('/', async (req, res) => {
  // Normally requires auth
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ detail: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// Shortcut: GET /api/products/:id/reviews → proxied from reviewRoutes
router.get('/:id/reviews', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find({ product_id: req.params.id })
      .populate('user_id', 'full_name')
      .sort({ createdAt: -1 });
    const formatted = reviews.map(r => ({
      id: r._id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.createdAt,
      reviewer_name: r.user_id?.full_name || 'Anonymous'
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
