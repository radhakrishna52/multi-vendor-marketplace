const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');
const router = express.Router();

// POST /api/reviews — buyer submits a rating + comment for a product
router.post('/', requireAuth, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    if (!product_id || !rating) {
      return res.status(400).json({ detail: 'product_id and rating are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ detail: 'Rating must be between 1 and 5.' });
    }

    // Prevent duplicate reviews from same user on same product
    const existing = await Review.findOne({ user_id: req.user.id, product_id });
    if (existing) {
      // Update if already exists
      existing.rating = rating;
      existing.comment = comment || existing.comment;
      await existing.save();

      // Recalculate product average rating
      await recalcProductRating(product_id);
      return res.json({ review: existing, updated: true });
    }

    const review = new Review({
      user_id: req.user.id,
      product_id,
      rating,
      comment: comment || '',
      is_verified_purchase: false
    });
    await review.save();

    // Update product's cached average rating
    await recalcProductRating(product_id);

    res.status(201).json({ review, updated: false });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/reviews/product/:productId — all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.productId })
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

// GET /api/reviews/seller/:sellerId — aggregate seller rating across all their products
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const products = await Product.find({ vendor_id: req.params.sellerId });
    const productIds = products.map(p => p._id);

    if (productIds.length === 0) {
      return res.json({ avg_rating: 0, total_reviews: 0, breakdown: [], products_rated: 0 });
    }

    const agg = await Review.aggregate([
      { $match: { product_id: { $in: productIds } } },
      {
        $group: {
          _id: null,
          avg_rating: { $avg: '$rating' },
          total_reviews: { $sum: 1 },
          five_star: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          four_star: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          three_star: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          two_star: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          one_star: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        }
      }
    ]);

    const recent = await Review.find({ product_id: { $in: productIds } })
      .populate('user_id', 'full_name')
      .populate('product_id', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    if (agg.length === 0) {
      return res.json({ avg_rating: 0, total_reviews: 0, breakdown: [], recent_reviews: [], products_rated: 0 });
    }

    const { avg_rating, total_reviews, five_star, four_star, three_star, two_star, one_star } = agg[0];

    res.json({
      avg_rating: parseFloat(avg_rating.toFixed(2)),
      total_reviews,
      products_rated: productIds.length,
      breakdown: [
        { stars: 5, count: five_star },
        { stars: 4, count: four_star },
        { stars: 3, count: three_star },
        { stars: 2, count: two_star },
        { stars: 1, count: one_star },
      ],
      recent_reviews: recent.map(r => ({
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

// Helper: recalculate and store average rating on the Product document
async function recalcProductRating(productId) {
  const agg = await Review.aggregate([
    { $match: { product_id: require('mongoose').Types.ObjectId.createFromHexString(productId.toString()) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (agg.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(agg[0].avg.toFixed(1)),
      reviews_count: agg[0].count
    });
  }
}

module.exports = router;
