/**
 * Test script for ElevenLabs API connection
 * This script tests the connection to ElevenLabs API and voice generation
 */

require('dotenv').config();
const { generateVoice, getVoices } = require('./elevenlabs');

// Test ElevenLabs connection
async function testElevenLabsConnection() {
  console.log('=== ElevenLabs API Connection Test ===\n');
  
  // Check for API key
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('Error: ELEVENLABS_API_KEY is not set in .env file');
    console.log('Please create a .env file with your API key (see .env.example)');
    return;
  }
  
  console.log('Testing ElevenLabs API connection...');
  
  try {
    // Get available voices
    console.log('\nFetching available voices...');
    const voices = await getVoices();
    
    if (voices && voices.length > 0) {
      console.log(`\nFound ${voices.length} voices:`);
      voices.forEach(voice => {
        console.log(`- ${voice.name} (ID: ${voice.voice_id})`);
      });
      
      // Generate a test voice
      console.log('\nGenerating test voice...');
      const testText = 'This is a test of the ElevenLabs voice generation. Hello, streamer!';
      
      // Use the first voice from the list
      const voiceConfig = {
        id: voices[0].voice_id,
        stability: 0.5,
        similarity_boost: 0.75
      };
      
      const audioPath = await generateVoice(testText, voiceConfig);
      console.log(`\nVoice generated successfully and saved to: ${audioPath}`);
      
      // Provide instructions to play the audio
      console.log('\nYou can play this audio file to verify the voice generation.');
      
      console.log('\nAll tests passed! ElevenLabs API connection is working correctly.');
    } else {
      console.error('\nNo voices found. This could indicate an issue with your API key or account.');
    }
  } catch (error) {
    console.error('\nConnection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify your ElevenLabs API key is correct in the .env file');
    console.log('2. Check that your ElevenLabs account is active and has available credits');
    console.log('3. Check your internet connection');
    console.log('4. Try generating a new API key in your ElevenLabs account settings');
  }
}

// Run the test
testElevenLabsConnection();
