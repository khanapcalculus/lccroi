const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  configType: {
    type: String,
    required: true,
    unique: true,
    default: 'matching_weights'
  },
  weights: {
    profitMargin: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.25
    },
    studentImprovement: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.30
    },
    satisfaction: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.20
    },
    availability: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.15
    },
    subjectExpertise: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.10
    }
  },
  chargePercentage: {
    type: Number,
    required: true,
    min: 50,
    max: 100,
    default: 85
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
});

// Validate that weights sum to 1.0
systemConfigSchema.pre('save', function(next) {
  const sum = Object.values(this.weights).reduce((acc, val) => acc + val, 0);
  const tolerance = 0.001; // Allow small floating point differences
  
  if (Math.abs(sum - 1.0) > tolerance) {
    return next(new Error(`Weights must sum to 1.0 (currently: ${sum})`));
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
