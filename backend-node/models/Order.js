const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  payment_status: { type: String, default: 'completed' },
  shipping_address: { type: String, required: true },
  items: [orderItemSchema]
}, { timestamps: true });

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.created_at = ret.createdAt;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Order', orderSchema);
