const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount_percentage: { type: Number, required: true, min: 1, max: 100 },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null implies site-wide admin coupon
  is_active: { type: Boolean, default: true },
  expiry_date: { type: Date }
}, { timestamps: true });

couponSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Coupon', couponSchema);
