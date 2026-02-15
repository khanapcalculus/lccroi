const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');

router.route('/')
  .get(tutorController.getAllTutors)
  .post(tutorController.createTutor);

router.route('/active')
  .get(tutorController.getActiveTutors);

router.route('/:id')
  .get(tutorController.getTutor)
  .put(tutorController.updateTutor)
  .delete(tutorController.deleteTutor);

module.exports = router;
