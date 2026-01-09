// After the conversation,
// 1 - Feature - send the transcript to LLM to give them rating of 1 to 5 and summarize the conversation

const axios = require('axios');

const sumAndRateConversation = async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
            return res.status(400).json({
                error: 'Invalid transcript. Please provide an array of conversation messages.'
            });
        }

        // Format conversation transcript for LLM
        const conversationText = transcript
            .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`)
            .join('\n');

        // Prepare the LLM request
        const llmUrl = process.env.LLM_URL || 'https://api.openai.com/v1/chat/completions';
        const llmApiKey = process.env.LLM_API_KEY;
        const llmModel = process.env.LLM_MODEL || 'gpt-4o-mini';

        if (!llmApiKey) {
            return res.status(500).json({
                error: 'LLM API key not configured'
            });
        }

        const prompt = `You are analyzing a conversation between a user and an AI anime girlfriend assistant.

Please provide:
1. A brief summary of the conversation (2-3 sentences)
2. A rating from 1-5 on how well the user engaged with the AI girlfriend, based on:
   - Conversation depth and quality
   - Emotional engagement
   - Respect and kindness
   - Overall interaction quality

Rating descriptions:
1 = Poor - Minimal engagement, rude or inappropriate behavior
2 = Below Average - Limited engagement, somewhat dismissive
3 = Average - Decent conversation, polite but basic interaction
4 = Good - Engaging conversation, friendly and interested
5 = Excellent - Deep, meaningful conversation with great emotional connection

Conversation:
${conversationText}

Respond ONLY with a valid JSON object in this exact format:
{
  "summary": "Brief summary here",
  "rating": 3,
  "ratingDescription": "Average - Decent conversation, polite but basic interaction"
}`;

        // Call the LLM
        const llmResponse = await axios.post(
            llmUrl,
            {
                model: llmModel,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            },
            {
                headers: {
                    'Authorization': `Bearer ${llmApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Parse LLM response
        const llmContent = llmResponse.data.choices[0].message.content.trim();

        // Extract JSON from response (handle markdown code blocks if present)
        let jsonMatch = llmContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not parse LLM response as JSON');
        }

        const result = JSON.parse(jsonMatch[0]);

        // Validate the result
        if (!result.summary || !result.rating || !result.ratingDescription) {
            throw new Error('Invalid response format from LLM');
        }

        // Ensure rating is between 1-5
        result.rating = Math.max(1, Math.min(5, parseInt(result.rating)));

        return res.json(result);

    } catch (error) {
        console.error('Error in sumAndRateConversation:', error);
        return res.status(500).json({
            error: 'Failed to generate conversation summary',
            details: error.message
        });
    }
};


module.exports = {
  sumAndRateConversation
};