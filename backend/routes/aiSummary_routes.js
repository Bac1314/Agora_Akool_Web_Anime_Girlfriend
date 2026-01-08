const express = require('express');
const router = express.Router();
const { sumAndRateConversation } = require('../controllers/aiSummaryController');

router.post('/summarize-and-rate', sumAndRateConversation);

module.exports = router;