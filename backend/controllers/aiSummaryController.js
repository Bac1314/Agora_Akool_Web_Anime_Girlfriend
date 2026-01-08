// After the conversation, 
// 1 - Feature - send the transcript to LLM to give them rating of 1 to 5 and summarize the conversation 

const axios = require('axios');

const sumAndRateConversation = async (req, res) => {
    // Summarize the conversation and provide a rating of 1 to 5
    // The format should be { summary: "...", rating: X }
    
};


module.exports = {
  sumAndRateConversation
};