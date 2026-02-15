const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

router.post('/find-match', matchingController.findBestMatch);
router.get('/recommendations', matchingController.getAllMatchRecommendations);
router.get('/projected-revenue', matchingController.calculateProjectedRevenue);

module.exports = router;
