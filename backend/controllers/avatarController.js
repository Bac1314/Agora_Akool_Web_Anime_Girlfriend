const getAvatarConfig = (req, res) => {
  try {
    const config = {
      enabled: !!process.env.AKOOL_API_KEY,
      avatarId: process.env.AKOOL_AVATAR_ID || 'default_avatar',
      sampleRate: 16000
    };

    res.json(config);
  } catch (error) {
    console.error('Avatar config error:', error);
    res.status(500).json({ error: 'Failed to get avatar configuration' });
  }
};

const validateAvatarSetup = (req, res) => {
  const missingKeys = [];
  
  if (!process.env.AKOOL_API_KEY) {
    missingKeys.push('AKOOL_API_KEY');
  }
  
  if (!process.env.AKOOL_AVATAR_ID) {
    missingKeys.push('AKOOL_AVATAR_ID');
  }

  const isValid = missingKeys.length === 0;

  res.json({
    valid: isValid,
    missingKeys,
    message: isValid 
      ? 'Avatar setup is complete' 
      : `Missing required environment variables: ${missingKeys.join(', ')}`
  });
};

module.exports = {
  getAvatarConfig,
  validateAvatarSetup
};