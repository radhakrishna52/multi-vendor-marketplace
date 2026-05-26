const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  brand: { type: String, default: 'Generic' },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  image_url: { type: String },
  variants: [{
    color: String,
    size: String,
    sku: String,
    stock: Number
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Product', productSchema);
