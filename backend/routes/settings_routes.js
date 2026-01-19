const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Get default system prompt (used for initial load or reset)
router.get('/system-prompt/default', settingsController.getDefaultSystemPrompt);

module.exports = router;
