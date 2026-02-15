const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.route('/')
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

router.route('/active')
  .get(studentController.getActiveStudents);

router.route('/:id')
  .get(studentController.getStudent)
  .put(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;
