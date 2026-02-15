const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  subjects: [{
    name: String,
    proficiencyLevel: {
      type: Number,
      min: 1,
      max: 10
    }
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  availability: [{
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,  // Format: "HH:MM"
    endTime: String     // Format: "HH:MM"
  }],
  performanceMetrics: {
    averageStudentImprovement: {
      type: Number,
      default: 0
    },
    averageParentRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalSessionsCompleted: {
      type: Number,
      default: 0
    },
    reliabilityScore: {
      type: Number,
      default: 5,
      min: 0,
      max: 10
    }
  },
  experience: {
    type: Number,
    default: 0  // Years of experience
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
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

tutorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tutor', tutorSchema);
