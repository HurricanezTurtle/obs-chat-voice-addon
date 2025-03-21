/**
 * Test script for Twitch chat connection
 * This script tests the connection to Twitch chat using TMI.js
 */

require('dotenv').config();
const tmi = require('tmi.js');

// Load config
const config = require('./config');

// Initialize Twitch client
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: config.twitch.username,
    password: config.twitch.oauth
  },
  channels: [config.twitch.channel]
});

// Test Twitch connection
async function testTwitchConnection() {
  console.log('=== Twitch Chat Connection Test ===\n');
  
  console.log(`Attempting to connect to Twitch chat as ${config.twitch.username}...`);
  console.log(`Target channel: ${config.twitch.channel}`);
  
  // Set up event handlers
  twitchClient.on('connected', (address, port) => {
    console.log(`\nConnection successful! Connected to ${address}:${port}`);
    console.log('\nListening for chat messages...');
    console.log('(Press Ctrl+C to exit)');
    
    // Send a test message to the console (not to chat)
    console.log('\nTest message received: (This is a simulated message, not sent to chat)');
    console.log(`${config.twitch.username}: Test message from OBS Chat Voice`);
  });
  
  twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot
    
    // Display received messages
    console.log(`${tags['display-name'] || tags.username}: ${message}`);
  });
  
  twitchClient.on('disconnected', (reason) => {
    console.log(`\nDisconnected: ${reason}`);
    process.exit(0);
  });
  
  // Handle connection errors
  try {
    await twitchClient.connect();
  } catch (error) {
    console.error('\nConnection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your Twitch username is correct in config.js');
    console.log('2. Verify your OAuth token is valid and has not expired');
    console.log('3. Make sure the channel name is correct');
    console.log('4. Check your internet connection');
    console.log('5. Try generating a new OAuth token at https://twitchapps.com/tmi/');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nDisconnecting from Twitch...');
  await twitchClient.disconnect();
  console.log('Disconnected. Test complete.');
  process.exit(0);
});

// Run the test
testTwitchConnection();
