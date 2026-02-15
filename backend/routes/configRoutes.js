const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/weights', configController.getMatchingWeights);
router.put('/weights', configController.updateMatchingWeights);
router.post('/weights/reset', configController.resetWeightsToDefault);
router.get('/weights/history', configController.getWeightsHistory);

module.exports = router;
