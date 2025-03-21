/**
 * Test script for OBS Chat Voice
 * This script simulates chat messages and tests the AI response and voice generation
 * without requiring a connection to Twitch or OBS
 */

require('dotenv').config();
const { processMessages } = require('./ai-service');
const { generateVoice } = require('./elevenlabs');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Load config
const config = require('./config');

// Sample chat messages for testing
const sampleMessages = [
  {
    username: 'User1',
    message: 'Hey everyone, how\'s the stream going today?',
    timestamp: new Date().toISOString()
  },
  {
    username: 'User2',
    message: 'I love this game! What difficulty are you playing on?',
    timestamp: new Date().toISOString()
  },
  {
    username: 'User3',
    message: 'That was an amazing play! How did you do that?',
    timestamp: new Date().toISOString()
  }
];

// Test AI response generation
async function testAIResponse() {
  console.log('Testing AI response generation...');
  console.log('Sample messages:');
  sampleMessages.forEach(msg => {
    console.log(`${msg.username}: ${msg.message}`);
  });
  
  try {
    const response = await processMessages(sampleMessages, config.personality);
    console.log('\nAI Response:');
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error generating AI response:', error.message);
    return null;
  }
}

// Test voice generation
async function testVoiceGeneration(text) {
  if (!text) {
    console.error('No text provided for voice generation');
    return null;
  }
  
  console.log('\nTesting voice generation...');
  try {
    const audioPath = await generateVoice(text, config.voice);
    console.log(`Voice generated and saved to: ${audioPath}`);
    return audioPath;
  } catch (error) {
    console.error('Error generating voice:', error.message);
    return null;
  }
}

// Play audio file (platform-specific)
function playAudio(audioPath) {
  if (!audioPath) {
    console.error('No audio path provided');
    return;
  }
  
  console.log('\nPlaying audio...');
  
  // Determine platform and play audio accordingly
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Windows
    exec(`start "" "${audioPath}"`, (error) => {
      if (error) {
        console.error('Error playing audio:', error.message);
      }
    });
  } else if (platform === 'darwin') {
    // macOS
    exec(`afplay "${audioPath}"`, (error) => {
      if (error) {
        console.error('Error playing audio:', error.message);
      }
    });
  } else if (platform === 'linux') {
    // Linux (requires mplayer or similar)
    exec(`mplayer "${audioPath}"`, (error) => {
      if (error) {
        console.error('Error playing audio:', error.message);
        console.log('You may need to install mplayer or another audio player');
      }
    });
  } else {
    console.log(`Audio file saved to: ${audioPath}`);
    console.log('Please play it manually as automatic playback is not supported on this platform');
  }
}

// Run the test
async function runTest() {
  console.log('=== OBS Chat Voice Test ===\n');
  
  // Check for required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set in .env file');
    console.log('Please create a .env file with your API keys (see .env.example)');
    return;
  }
  
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('Error: ELEVENLABS_API_KEY is not set in .env file');
    console.log('Please create a .env file with your API keys (see .env.example)');
    return;
  }
  
  // Test AI response
  const response = await testAIResponse();
  
  if (response) {
    // Test voice generation
    const audioPath = await testVoiceGeneration(response);
    
    if (audioPath) {
      // Play the audio
      playAudio(audioPath);
    }
  }
  
  console.log('\n=== Test Complete ===');
}

// Run the test
runTest();
