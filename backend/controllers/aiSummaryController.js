// After the conversation,
// 1 - Feature - send the transcript to LLM to give them rating of 1 to 5 and summarize the conversation

const axios = require('axios');

const sumAndRateConversation = async (req, res) => {
    try {
        const { transcript, coachRatingPrompt } = req.body;

        if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
            return res.status(400).json({
                error: 'Invalid transcript. Please provide an array of conversation messages.'
            });
        }

        // Format conversation transcript for LLM
        const conversationText = transcript
            .map(msg => `${msg.sender === 'user' ? 'User' : 'AI girlfriend'}: ${msg.content}`)
            .join('\n');

        console.log('Bacs conversation', conversationText);

        // Prepare the LLM request
        const llmUrl = process.env.LLM_URL || 'https://api.openai.com/v1/chat/completions';
        const llmApiKey = process.env.LLM_API_KEY;
        const llmModel = process.env.LLM_MODEL || 'gpt-4o-mini';

        if (!llmApiKey) {
            return res.status(500).json({
                error: 'LLM API key not configured'
            });
        }

        const prompt = `${coachRatingPrompt || process.env.LLM_AI_SUMMARY_RATING_PROMPT}

        The conversaion follows the pattern User: message. AI girlfriend: message. 
        
        Conversation:
        ${conversationText}

        Respond ONLY with a valid JSON object in this exact format:
        {
        "summary": "Brief coaching feedback here focusing on strengths and growth areas",
        "rating": 3,
        "ratingDescription": "Good Foundation - Polite and friendly, asks some questions, shows basic conversational skills"
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