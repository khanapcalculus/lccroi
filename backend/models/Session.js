const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,  // Duration in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  cost: {
    tutorPay: {
      type: Number,
      required: true
    },
    studentCharge: {
      type: Number,
      required: true
    },
    profit: {
      type: Number,
      required: true
    },
    profitMargin: {
      type: Number,
      required: true  // Percentage
    }
  },
  feedback: {
    tutorNotes: String,
    studentEngagement: {
      type: Number,
      min: 0,
      max: 10
    },
    parentRating: {
      type: Number,
      min: 0,
      max: 5
    },
    parentComments: String
  },
  performance: {
    topicsCovered: [String],
    studentUnderstanding: {
      type: Number,
      min: 0,
      max: 10
    },
    homeworkCompleted: Boolean,
    testScoreBefore: Number,
    testScoreAfter: Number,
    improvement: Number
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

sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
