const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  business_name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'suspended'], default: 'pending' }
}, { timestamps: true });

vendorSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
