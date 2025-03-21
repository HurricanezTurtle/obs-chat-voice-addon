/**
 * Test script for OBS WebSocket connection
 * This script tests the connection to OBS WebSocket server
 */

require('dotenv').config();
const OBSWebSocket = require('obs-websocket-js').default;

// Load config
const config = require('./config');

// Initialize OBS WebSocket
const obs = new OBSWebSocket();

// Test OBS connection
async function testOBSConnection() {
  console.log('=== OBS WebSocket Connection Test ===\n');
  
  console.log(`Attempting to connect to OBS WebSocket at ws://${config.obs.host}:${config.obs.port}...`);
  
  try {
    // Connect to OBS
    await obs.connect(`ws://${config.obs.host}:${config.obs.port}`, config.obs.password);
    
    console.log('\nConnection successful!');
    
    // Get OBS version
    const version = await obs.call('GetVersion');
    console.log(`\nOBS Version: ${version.obsVersion}`);
    console.log(`WebSocket Version: ${version.obsWebSocketVersion}`);
    
    // Get current scene
    const sceneInfo = await obs.call('GetCurrentProgramScene');
    console.log(`\nCurrent Scene: ${sceneInfo.currentProgramSceneName}`);
    
    // List available scenes
    const scenes = await obs.call('GetSceneList');
    console.log('\nAvailable Scenes:');
    scenes.scenes.forEach(scene => {
      console.log(`- ${scene.sceneName}`);
    });
    
    // List available sources
    const sources = await obs.call('GetSourcesList');
    console.log('\nAvailable Sources:');
    sources.sources.forEach(source => {
      console.log(`- ${source.name} (${source.typeId})`);
    });
    
    console.log('\nAll tests passed! OBS connection is working correctly.');
  } catch (error) {
    console.error('\nConnection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure OBS is running');
    console.log('2. Check that the WebSocket server is enabled in OBS (Tools > WebSocket Server Settings)');
    console.log('3. Verify the host, port, and password in config.js match your OBS WebSocket settings');
    console.log('4. Check if a firewall is blocking the connection');
    console.log('5. Try restarting OBS');
  } finally {
    // Disconnect from OBS
    try {
      await obs.disconnect();
    } catch (error) {
      // Ignore disconnect errors
    }
  }
}

// Run the test
testOBSConnection();
