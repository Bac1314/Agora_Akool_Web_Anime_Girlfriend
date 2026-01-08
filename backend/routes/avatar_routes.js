const express = require('express');
const router = express.Router();
const { getAvatarConfig, validateAvatarSetup } = require('../controllers/avatarController');

router.get('/config', getAvatarConfig);
router.get('/validate', validateAvatarSetup);

module.exports = router;