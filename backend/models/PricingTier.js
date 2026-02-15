const mongoose = require('mongoose');

const pricingTierSchema = new mongoose.Schema({
  gradeLevel: {
    type: String,
    required: true,
    unique: true,
    enum: ['K-5 (Elementary)', '6-8 (Middle School)', '9-12 (High School)', 'College', 'AP', 'IB', 'IGCSE', 'GCSE']
  },
  rateOncePerWeek: {
    type: Number,
    required: true,
    min: 0
  },
  rateTwicePerWeek: {
    type: Number,
    required: true,
    min: 0
  },
  bulkRate: {
    type: String,
    default: 'Contact US'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pricingTierSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PricingTier', pricingTierSchema);
