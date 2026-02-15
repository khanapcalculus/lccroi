const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
  parentName: {
    type: String,
    required: true
  },
  parentEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  parentPhone: {
    type: String,
    required: true
  },
  gradeLevel: {
    type: String,
    required: true
  },
  subjectsNeeded: [{
    name: String,
    currentGrade: String,
    targetGrade: String,
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  }],
  learningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'kinesthetic', 'reading-writing', 'mixed'],
    default: 'mixed'
  },
  availability: [{
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,  // Format: "HH:MM"
    endTime: String     // Format: "HH:MM"
  }],
  budget: {
    maxHourlyRate: {
      type: Number,
      required: true,
      min: 0
    },
    sessionsPerWeek: {
      type: Number,
      default: 1
    }
  },
  performanceMetrics: {
    overallImprovement: {
      type: Number,
      default: 0
    },
    engagementScore: {
      type: Number,
      default: 5,
      min: 0,
      max: 10
    },
    parentSatisfactionScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated'],
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

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
