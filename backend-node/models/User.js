const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashed_password: { type: String, required: true },
  full_name: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Transform to match existing FastAPI responses
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.hashed_password;
  }
});

module.exports = mongoose.model('User', userSchema);
