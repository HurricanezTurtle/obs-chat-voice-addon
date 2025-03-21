const axios = require('axios');

/**
 * Process chat messages and generate a response using AI
 * @param {Array} messages - Array of chat messages
 * @param {string} personality - Personality/tone for the AI response
 * @returns {Promise<string>} - Generated response
 */
async function processMessages(messages, personality) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    // Format messages for the prompt
    const formattedMessages = messages.map(msg => 
      `${msg.username}: ${msg.message}`
    ).join('\n');
    
    // Create system prompt with personality
    const systemPrompt = `You are a helpful assistant that summarizes Twitch chat messages and responds as if you're part of the conversation. 
    Respond in a ${personality || 'friendly and engaging'} tone. 
    Keep your response concise (1-3 sentences) and conversational, as if you're speaking directly to the streamer.
    Make your response sound natural and engaging, like you're part of the chat.
    Don't use phrases like "Based on the messages" or "It seems that" - just respond naturally.`;
    
    // Create the API request
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Here are some recent chat messages:\n\n${formattedMessages}\n\nGenerate a brief, conversational response to these messages as if you're talking directly to the streamer.`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }
    });
    
    // Extract and return the response text
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error processing messages with AI:', error.message);
    if (error.response) {
      console.error('OpenAI API error:', error.response.status, error.response.data);
    }
    
    // Return a fallback response
    return "Sorry, I couldn't process the chat messages at this time.";
  }
}

/**
 * Alternative implementation using Stream Elements API if available
 * @param {Array} messages - Array of chat messages
 * @param {string} personality - Personality/tone for the AI response
 * @returns {Promise<string>} - Generated response
 */
async function processMessagesWithStreamElements(messages, personality) {
  try {
    const apiKey = process.env.STREAMELEMENTS_API_KEY;
    if (!apiKey) {
      // Fall back to OpenAI if Stream Elements API key is not available
      return processMessages(messages, personality);
    }
    
    // Format messages for the prompt
    const formattedMessages = messages.map(msg => 
      `${msg.username}: ${msg.message}`
    ).join('\n');
    
    // This is a placeholder for Stream Elements API integration
    // You would need to implement this based on their actual API
    // For now, we'll just fall back to OpenAI
    console.log('Stream Elements API integration not implemented yet, falling back to OpenAI');
    return processMessages(messages, personality);
  } catch (error) {
    console.error('Error processing messages with Stream Elements:', error.message);
    // Fall back to OpenAI
    return processMessages(messages, personality);
  }
}

module.exports = {
  processMessages,
  processMessagesWithStreamElements
};
