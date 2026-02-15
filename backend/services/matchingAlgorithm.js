/**
 * LCC 360 Tutor-Student Matching Algorithm
 * 
 * This algorithm optimizes tutor-student matches based on:
 * 1. Profit Margin (default 25% weight)
 * 2. Expected Student Improvement (default 30% weight)
 * 3. Parent/Student Satisfaction (default 20% weight)
 * 4. Availability Match (default 15% weight)
 * 5. Subject Expertise (default 10% weight)
 * 
 * Weights are dynamically adjustable from the admin dashboard
 */

const SystemConfig = require('../models/SystemConfig');

class MatchingAlgorithm {
  constructor() {
    // Default weights (will be overridden by database values)
    this.weights = {
      profitMargin: 0.25,
      studentImprovement: 0.30,
      satisfaction: 0.20,
      availability: 0.15,
      subjectExpertise: 0.10
    };
    this.weightsCache = null;
    this.cacheExpiry = null;
  }

  /**
   * Load weights from database with caching
   */
  async loadWeights() {
    // Cache weights for 5 minutes to reduce database queries
    const now = Date.now();
    if (this.weightsCache && this.cacheExpiry && now < this.cacheExpiry) {
      return this.weightsCache;
    }

    try {
      let config = await SystemConfig.findOne({ configType: 'matching_weights' });
      
      if (!config) {
        // Create default config if it doesn't exist
        config = await SystemConfig.create({
          configType: 'matching_weights',
          weights: this.weights
        });
      }

      this.weightsCache = config.weights;
      this.cacheExpiry = now + (5 * 60 * 1000); // 5 minutes
      this.weights = config.weights;
      
      return config.weights;
    } catch (error) {
      console.error('Error loading weights, using defaults:', error);
      return this.weights;
    }
  }

  /**
   * Clear weights cache (call this when weights are updated)
   */
  clearCache() {
    this.weightsCache = null;
    this.cacheExpiry = null;
  }

  /**
   * Calculate the best tutor match for a student
   * @param {Object} student - Student object
   * @param {Array} tutors - Array of tutor objects
   * @param {String} subject - Subject to match
   * @param {Object} customWeights - Optional custom weights to use
   * @returns {Object} - Best match with score and breakdown
   */
  async findBestMatch(student, tutors, subject, customWeights = null) {
    // Load current weights from database
    const weights = customWeights || await this.loadWeights();
    
    const matches = tutors
      .filter(tutor => tutor.status === 'active')
      .map(tutor => {
        const score = this.calculateMatchScore(student, tutor, subject, weights);
        return {
          tutor,
          score: score.totalScore,
          breakdown: score.breakdown,
          projectedProfit: this.calculateProjectedProfit(student, tutor),
          compatibilityFactors: score.factors,
          weightsUsed: weights
        };
      })
      .sort((a, b) => b.score - a.score);

    return matches;
  }

  /**
   * Calculate comprehensive match score
   * @param {Object} student - Student object
   * @param {Object} tutor - Tutor object
   * @param {String} subject - Subject name
   * @param {Object} weights - Weights to use for calculation
   */
  calculateMatchScore(student, tutor, subject, weights = null) {
    const activeWeights = weights || this.weights;
    
    const factors = {
      profitMargin: this.calculateProfitMarginScore(student, tutor),
      studentImprovement: this.calculateImprovementScore(tutor),
      satisfaction: this.calculateSatisfactionScore(tutor),
      availability: this.calculateAvailabilityScore(student, tutor),
      subjectExpertise: this.calculateSubjectExpertiseScore(tutor, subject)
    };

    const totalScore = Object.keys(factors).reduce((sum, key) => {
      return sum + (factors[key] * activeWeights[key]);
    }, 0);

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      breakdown: factors,
      factors: this.generateFactorExplanations(factors),
      weights: activeWeights
    };
  }

  /**
   * Calculate profit margin score (0-100)
   */
  calculateProfitMarginScore(student, tutor) {
    const tutorCost = tutor.hourlyRate;
    const studentBudget = student.budget.maxHourlyRate;
    
    // If tutor cost exceeds student budget, return 0
    if (tutorCost > studentBudget) {
      return 0;
    }

    // Calculate potential profit margin
    // Assume we charge 80-90% of student's max budget
    const studentCharge = studentBudget * 0.85;
    const profit = studentCharge - tutorCost;
    const profitMargin = (profit / studentCharge) * 100;

    // Score based on profit margin (higher is better)
    // 30%+ margin = 100 points, 20% = 75 points, 10% = 50 points
    let score = 0;
    if (profitMargin >= 30) score = 100;
    else if (profitMargin >= 20) score = 75 + ((profitMargin - 20) * 2.5);
    else if (profitMargin >= 10) score = 50 + ((profitMargin - 10) * 2.5);
    else if (profitMargin >= 0) score = profitMargin * 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate expected student improvement score (0-100)
   */
  calculateImprovementScore(tutor) {
    const avgImprovement = tutor.performanceMetrics.averageStudentImprovement || 0;
    const experience = tutor.experience || 0;
    const reliabilityScore = tutor.performanceMetrics.reliabilityScore || 5;
    const totalSessions = tutor.performanceMetrics.totalSessionsCompleted || 0;

    // Weight historical performance heavily
    const improvementScore = Math.min(100, avgImprovement * 10); // 0-10 scale to 0-100
    
    // Experience bonus (up to 20 points for 5+ years)
    const experienceBonus = Math.min(20, experience * 4);
    
    // Reliability bonus (up to 15 points)
    const reliabilityBonus = (reliabilityScore / 10) * 15;
    
    // Track record bonus (up to 15 points for 50+ sessions)
    const trackRecordBonus = Math.min(15, (totalSessions / 50) * 15);

    const totalScore = (improvementScore * 0.5) + experienceBonus + reliabilityBonus + trackRecordBonus;
    
    return Math.min(100, Math.max(0, totalScore));
  }

  /**
   * Calculate satisfaction score (0-100)
   */
  calculateSatisfactionScore(tutor) {
    const parentRating = tutor.performanceMetrics.averageParentRating || 0;
    const reliabilityScore = tutor.performanceMetrics.reliabilityScore || 5;

    // Parent rating out of 5, convert to 0-100
    const ratingScore = (parentRating / 5) * 70;
    
    // Reliability contributes 30 points
    const reliabilityPoints = (reliabilityScore / 10) * 30;

    return Math.min(100, ratingScore + reliabilityPoints);
  }

  /**
   * Calculate availability match score (0-100)
   */
  calculateAvailabilityScore(student, tutor) {
    const studentAvail = student.availability || [];
    const tutorAvail = tutor.availability || [];

    if (studentAvail.length === 0 || tutorAvail.length === 0) {
      return 50; // Neutral score if no availability data
    }

    let matchingSlots = 0;
    let totalStudentSlots = studentAvail.length;

    studentAvail.forEach(studentSlot => {
      tutorAvail.forEach(tutorSlot => {
        if (this.timeSlotsOverlap(studentSlot, tutorSlot)) {
          matchingSlots++;
        }
      });
    });

    // Calculate percentage of student slots that have tutor availability
    const matchPercentage = (matchingSlots / totalStudentSlots) * 100;
    
    return Math.min(100, matchPercentage);
  }

  /**
   * Calculate subject expertise score (0-100)
   */
  calculateSubjectExpertiseScore(tutor, subject) {
    const tutorSubjects = tutor.subjects || [];
    const matchingSubject = tutorSubjects.find(s => 
      s.name.toLowerCase() === subject.toLowerCase()
    );

    if (!matchingSubject) {
      return 0; // No expertise in this subject
    }

    // Proficiency level is 1-10, convert to 0-100
    const proficiencyScore = (matchingSubject.proficiencyLevel / 10) * 100;
    
    return proficiencyScore;
  }

  /**
   * Check if two time slots overlap
   */
  timeSlotsOverlap(slot1, slot2) {
    if (slot1.dayOfWeek !== slot2.dayOfWeek) {
      return false;
    }

    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return (start1 < end2 && end1 > start2);
  }

  /**
   * Convert time string to minutes
   */
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Calculate projected profit for a match
   */
  calculateProjectedProfit(student, tutor) {
    const tutorCost = tutor.hourlyRate;
    const studentBudget = student.budget.maxHourlyRate;
    const sessionsPerWeek = student.budget.sessionsPerWeek || 1;

    if (tutorCost > studentBudget) {
      return {
        perSession: 0,
        perWeek: 0,
        perMonth: 0,
        profitMargin: 0
      };
    }

    // Charge 85% of student's max budget
    const chargePerSession = studentBudget * 0.85;
    const profitPerSession = chargePerSession - tutorCost;
    const profitMargin = (profitPerSession / chargePerSession) * 100;

    return {
      perSession: Math.round(profitPerSession * 100) / 100,
      perWeek: Math.round(profitPerSession * sessionsPerWeek * 100) / 100,
      perMonth: Math.round(profitPerSession * sessionsPerWeek * 4 * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      tutorCost,
      studentCharge: Math.round(chargePerSession * 100) / 100
    };
  }

  /**
   * Generate human-readable explanations for scores
   */
  generateFactorExplanations(factors) {
    return {
      profitMargin: this.explainScore(factors.profitMargin, 'profit margin'),
      studentImprovement: this.explainScore(factors.studentImprovement, 'improvement potential'),
      satisfaction: this.explainScore(factors.satisfaction, 'satisfaction rating'),
      availability: this.explainScore(factors.availability, 'schedule compatibility'),
      subjectExpertise: this.explainScore(factors.subjectExpertise, 'subject expertise')
    };
  }

  /**
   * Explain individual score
   */
  explainScore(score, factor) {
    if (score >= 80) return `Excellent ${factor}`;
    if (score >= 60) return `Good ${factor}`;
    if (score >= 40) return `Fair ${factor}`;
    if (score >= 20) return `Low ${factor}`;
    return `Poor ${factor}`;
  }
}

module.exports = new MatchingAlgorithm();
