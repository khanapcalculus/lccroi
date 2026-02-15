const SystemConfig = require('../models/SystemConfig');

// Get current matching weights
exports.getMatchingWeights = async (req, res) => {
  try {
    let config = await SystemConfig.findOne({ configType: 'matching_weights' });
    
    // If no config exists, create default one
    if (!config) {
      config = await SystemConfig.create({
        configType: 'matching_weights',
        weights: {
          profitMargin: 0.25,
          studentImprovement: 0.30,
          satisfaction: 0.20,
          availability: 0.15,
          subjectExpertise: 0.10
        }
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weights',
      error: error.message
    });
  }
};

// Update matching weights
exports.updateMatchingWeights = async (req, res) => {
  try {
    const { weights, updatedBy } = req.body;

    // Validate weights sum to 1.0
    const sum = Object.values(weights).reduce((acc, val) => acc + val, 0);
    const tolerance = 0.001;
    
    if (Math.abs(sum - 1.0) > tolerance) {
      return res.status(400).json({
        success: false,
        message: `Weights must sum to 100% (currently: ${(sum * 100).toFixed(1)}%)`,
        currentSum: sum
      });
    }

    // Validate all weights are between 0 and 1
    for (const [key, value] of Object.entries(weights)) {
      if (value < 0 || value > 1) {
        return res.status(400).json({
          success: false,
          message: `${key} must be between 0 and 1 (0-100%)`,
          invalidValue: value
        });
      }
    }

    let config = await SystemConfig.findOne({ configType: 'matching_weights' });
    
    if (!config) {
      // Create new config
      config = await SystemConfig.create({
        configType: 'matching_weights',
        weights,
        updatedBy: updatedBy || 'admin'
      });
    } else {
      // Update existing config
      config.weights = weights;
      config.updatedBy = updatedBy || 'admin';
      await config.save();
    }

    res.json({
      success: true,
      message: 'Weights updated successfully',
      data: config
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating weights',
      error: error.message
    });
  }
};

// Reset weights to default
exports.resetWeightsToDefault = async (req, res) => {
  try {
    const defaultWeights = {
      profitMargin: 0.25,
      studentImprovement: 0.30,
      satisfaction: 0.20,
      availability: 0.15,
      subjectExpertise: 0.10
    };

    let config = await SystemConfig.findOne({ configType: 'matching_weights' });
    
    if (!config) {
      config = await SystemConfig.create({
        configType: 'matching_weights',
        weights: defaultWeights
      });
    } else {
      config.weights = defaultWeights;
      config.updatedBy = 'admin';
      await config.save();
    }

    res.json({
      success: true,
      message: 'Weights reset to default values',
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting weights',
      error: error.message
    });
  }
};

// Get weights history (future feature - would need to track changes)
exports.getWeightsHistory = async (req, res) => {
  try {
    // This is a placeholder for future implementation
    // Would require a separate collection to track weight changes over time
    res.json({
      success: true,
      message: 'History tracking not yet implemented',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message
    });
  }
};
