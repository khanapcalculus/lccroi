const Tutor = require('../models/Tutor');

// Get all tutors
exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.json({
      success: true,
      count: tutors.length,
      data: tutors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tutors',
      error: error.message
    });
  }
};

// Get single tutor
exports.getTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    res.json({
      success: true,
      data: tutor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tutor',
      error: error.message
    });
  }
};

// Create tutor
exports.createTutor = async (req, res) => {
  try {
    const tutor = await Tutor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tutor created successfully',
      data: tutor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating tutor',
      error: error.message
    });
  }
};

// Update tutor
exports.updateTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    res.json({
      success: true,
      message: 'Tutor updated successfully',
      data: tutor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating tutor',
      error: error.message
    });
  }
};

// Delete tutor
exports.deleteTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findByIdAndDelete(req.params.id);

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    res.json({
      success: true,
      message: 'Tutor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tutor',
      error: error.message
    });
  }
};

// Get active tutors
exports.getActiveTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ status: 'active' });
    res.json({
      success: true,
      count: tutors.length,
      data: tutors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active tutors',
      error: error.message
    });
  }
};
