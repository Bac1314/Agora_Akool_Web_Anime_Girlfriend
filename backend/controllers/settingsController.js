// Settings controller for providing default configuration values
// System prompts are now stored client-side in localStorage (per-user)

const getDefaultSystemPrompt = (req, res) => {
  try {
    // Return the default system prompt from .env or hardcoded default
    const defaultPrompt = process.env.LLM_SYSTEM_PROMPT ||
      "You are a friendly AI anime girlfriend. Respond naturally in a caring, playful manner. Keep responses brief and conversational since this is voice-to-voice communication. Avoid long paragraphs and speak as if having a real conversation. Only output plain text responses, without any markdown, HTML tags, or emojis.";

    res.json({
      success: true,
      systemPrompt: defaultPrompt
    });
  } catch (error) {
    console.error('Get default system prompt error:', error);
    res.status(500).json({
      error: 'Failed to get default system prompt',
      details: error.message
    });
  }
};

module.exports = {
  getDefaultSystemPrompt
};
