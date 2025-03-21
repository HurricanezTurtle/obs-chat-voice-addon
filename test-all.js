/**
 * Test script for all components
 * This script runs all test scripts in sequence
 */

const { spawn } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Test components in sequence
async function runTests() {
  console.log('=== OBS Chat Voice - Test All Components ===\n');
  
  const tests = [
    { name: 'OpenAI API', script: 'test-openai.js' },
    { name: 'ElevenLabs API', script: 'test-elevenlabs.js' },
    { name: 'OBS WebSocket', script: 'test-obs-connection.js' },
    { name: 'Twitch Chat', script: 'test-twitch-connection.js' }
  ];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    
    console.log(`\n[${i + 1}/${tests.length}] Testing ${test.name}...\n`);
    
    // Ask user if they want to run this test
    const answer = await askQuestion(`Run ${test.name} test? (y/n): `);
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      // Run the test
      await runScript(test.script);
      
      // Wait for user to continue
      if (i < tests.length - 1) {
        await askQuestion('\nPress Enter to continue to the next test...');
      }
    } else {
      console.log(`Skipping ${test.name} test.`);
    }
  }
  
  console.log('\n=== All tests completed ===');
  rl.close();
}

// Run a script and wait for it to complete
function runScript(script) {
  return new Promise((resolve) => {
    const child = spawn('node', [script], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code !== 0) {
        console.log(`\nTest exited with code ${code}`);
      }
      resolve();
    });
  });
}

// Ask a question and wait for user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nTests interrupted by user.');
  rl.close();
  process.exit(0);
});

// Run the tests
runTests();
