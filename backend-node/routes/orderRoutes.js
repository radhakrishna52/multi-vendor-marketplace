const express = require('express');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ detail: 'Not authenticated' });
  
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ detail: 'Invalid token' });
  }
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    
    // Fetch products to get real prices
    const Product = require('../models/Product');
    const productIds = items.map(i => i.product_id);
    const products = await Product.find({ _id: { $in: productIds } });
    
    const productMap = {};
    products.forEach(p => productMap[p._id.toString()] = p.price);

    let total_amount = 0;
    const orderItems = items.map(i => {
      const price = productMap[i.product_id] || 0;
      total_amount += (price * i.quantity);
      return {
        product_id: i.product_id,
        quantity: i.quantity,
        price: price
      };
    });

    const order = new Order({
      user_id: req.user.id,
      items: orderItems,
      shipping_address,
      total_amount
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    
    // Mock items array to match frontend expectations (product_name, etc)
    const formattedOrders = orders.map(order => {
      const o = order.toJSON();
      o.items = o.items.map(i => ({
        product_id: i.product_id,
        product_name: "Luxury Item (Node.js)",
        quantity: i.quantity,
        price: i.price,
        image_url: ""
      }));
      return o;
    });

    res.json({ orders: formattedOrders });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
