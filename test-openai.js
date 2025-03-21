/**
 * Test script for OpenAI API connection
 * This script tests the connection to OpenAI API and response generation
 */

require('dotenv').config();
const axios = require('axios');

// Test OpenAI connection
async function testOpenAIConnection() {
  console.log('=== OpenAI API Connection Test ===\n');
  
  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY is not set in .env file');
    console.log('Please create a .env file with your API key (see .env.example)');
    return;
  }
  
  console.log('Testing OpenAI API connection...');
  
  try {
    // Create a simple test prompt
    const testPrompt = 'Generate a short greeting for a Twitch streamer from chat.';
    
    // Make API request
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
            content: 'You are a helpful assistant that generates short, friendly messages for Twitch streamers.'
          },
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      }
    });
    
    // Extract and display the response
    const aiResponse = response.data.choices[0].message.content.trim();
    console.log('\nAPI Response:');
    console.log(aiResponse);
    
    // Display model information
    console.log('\nModel used:', response.data.model);
    console.log('Tokens used:', response.data.usage.total_tokens);
    
    console.log('\nAll tests passed! OpenAI API connection is working correctly.');
  } catch (error) {
    console.error('\nConnection failed:', error.message);
    if (error.response) {
      console.error('OpenAI API error:', error.response.status, error.response.data);
    }
    
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify your OpenAI API key is correct in the .env file');
    console.log('2. Check that your OpenAI account is active and has available credits');
    console.log('3. Check your internet connection');
    console.log('4. Try generating a new API key in your OpenAI account settings');
  }
}

// Run the test
testOpenAIConnection();
