const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const matchingAlgorithm = require('../services/matchingAlgorithm');

// Find best match for a student and subject
exports.findBestMatch = async (req, res) => {
  try {
    const { studentId, subject } = req.body;

    if (!studentId || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and subject are required'
      });
    }

    // Get student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all active tutors
    const tutors = await Tutor.find({ status: 'active' });

    if (tutors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active tutors available'
      });
    }

    // Find matches (now async)
    const matches = await matchingAlgorithm.findBestMatch(student, tutors, subject);

    res.json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        gradeLevel: student.gradeLevel,
        sessionsPerWeek: student.sessionsPerWeek
      },
      subject,
      totalMatches: matches.length,
      matches: matches.slice(0, 10).map(match => ({
        tutor: {
          id: match.tutor._id,
          name: match.tutor.name,
          email: match.tutor.email,
          hourlyRate: match.tutor.hourlyRate,
          experience: match.tutor.experience,
          subjects: match.tutor.subjects
        },
        matchScore: match.score,
        scoreBreakdown: match.breakdown,
        compatibilityFactors: match.compatibilityFactors,
        projectedProfit: match.projectedProfit,
        recommendation: this.getMatchRecommendation(match.score)
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding match',
      error: error.message
    });
  }
};

// Get match recommendations for all students
exports.getAllMatchRecommendations = async (req, res) => {
  try {
    const students = await Student.find({ status: 'active' });
    const tutors = await Tutor.find({ status: 'active' });

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active students found'
      });
    }

    if (tutors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active tutors found'
      });
    }

    const recommendations = [];

    // Process all matches asynchronously
    for (const student of students) {
      for (const subjectInfo of student.subjectsNeeded) {
        const matches = await matchingAlgorithm.findBestMatch(student, tutors, subjectInfo.name);
        
        if (matches.length > 0) {
          const bestMatch = matches[0];
          recommendations.push({
            student: {
              id: student._id,
              name: student.name
            },
            subject: subjectInfo.name,
            priority: subjectInfo.priority,
            bestMatch: {
              tutor: {
                id: bestMatch.tutor._id,
                name: bestMatch.tutor.name,
                hourlyRate: bestMatch.tutor.hourlyRate
              },
              matchScore: bestMatch.score,
              projectedProfit: bestMatch.projectedProfit
            }
          });
        }
      }
    }

    // Sort by match score
    recommendations.sort((a, b) => b.bestMatch.matchScore - a.bestMatch.matchScore);

    res.json({
      success: true,
      totalRecommendations: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
};

// Helper method to get recommendation text
exports.getMatchRecommendation = (score) => {
  if (score >= 80) return 'Highly Recommended - Excellent match across all factors';
  if (score >= 65) return 'Recommended - Strong match with good compatibility';
  if (score >= 50) return 'Acceptable - Decent match but may have some limitations';
  if (score >= 35) return 'Not Ideal - Consider only if no better options available';
  return 'Not Recommended - Poor match, seek alternatives';
};

// Calculate projected revenue for all potential matches
exports.calculateProjectedRevenue = async (req, res) => {
  try {
    const students = await Student.find({ status: 'active' });
    const tutors = await Tutor.find({ status: 'active' });

    let totalProjectedRevenue = 0;
    let totalProjectedProfit = 0;
    let matchCount = 0;

    // Calculate projected revenue asynchronously
    for (const student of students) {
      for (const subjectInfo of student.subjectsNeeded) {
        const matches = await matchingAlgorithm.findBestMatch(student, tutors, subjectInfo.name);
        
        if (matches.length > 0 && matches[0].score >= 50) {
          const bestMatch = matches[0];
          
          // Use projectedProfit which already has the correct calculations
          totalProjectedRevenue += bestMatch.projectedProfit.studentCharge * (student.sessionsPerWeek || 1) * 4;
          totalProjectedProfit += bestMatch.projectedProfit.perMonth;
          matchCount++;
        }
      }
    }

    res.json({
      success: true,
      projections: {
        monthlyRevenue: Math.round(totalProjectedRevenue * 100) / 100,
        monthlyProfit: Math.round(totalProjectedProfit * 100) / 100,
        averageProfitMargin: totalProjectedRevenue > 0 
          ? Math.round((totalProjectedProfit / totalProjectedRevenue) * 100 * 100) / 100 
          : 0,
        potentialMatches: matchCount,
        activeStudents: students.length,
        activeTutors: tutors.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating projected revenue',
      error: error.message
    });
  }
};
