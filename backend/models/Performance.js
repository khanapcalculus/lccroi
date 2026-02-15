const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  averageEngagement: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  gradeImprovement: {
    startingGrade: Number,
    currentGrade: Number,
    improvementPercentage: Number
  },
  parentSatisfaction: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  compatibility: {
    communicationScore: {
      type: Number,
      default: 5,
      min: 0,
      max: 10
    },
    teachingStyleMatch: {
      type: Number,
      default: 5,
      min: 0,
      max: 10
    }
  },
  revenueGenerated: {
    totalRevenue: {
      type: Number,
      default: 0
    },
    totalProfit: {
      type: Number,
      default: 0
    },
    averageProfitMargin: {
      type: Number,
      default: 0
    }
  },
  lastSessionDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

performanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for faster queries
performanceSchema.index({ student: 1, tutor: 1, subject: 1 });

module.exports = mongoose.model('Performance', performanceSchema);
