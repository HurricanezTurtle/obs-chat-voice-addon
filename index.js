require('dotenv').config();
const tmi = require('tmi.js');
const OBSWebSocket = require('obs-websocket-js').default;
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const { generateVoice } = require('./elevenlabs');
const { processMessages } = require('./ai-service');
const fs = require('fs');
const path = require('path');

// Configuration
const config = require('./config');

// Initialize Express app for web interface
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Initialize OBS WebSocket
const obs = new OBSWebSocket();

// Initialize Twitch client
const twitchClient = new tmi.Client({
  options: { debug: config.debug },
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

// Message queue
let messageQueue = [];
let isProcessing = false;
let lastPlayedTime = 0;

// Connect to OBS
async function connectToOBS() {
  try {
    await obs.connect(`ws://${config.obs.host}:${config.obs.port}`, { password: config.obs.password });
    console.log('Connected to OBS');
    return true;
  } catch (error) {
    console.error('Failed to connect to OBS:', error.message);
    return false;
  }
}

// Play audio in OBS
async function playAudioInOBS(audioPath) {
  try {
    // Create a media source if it doesn't exist (OBS WebSocket 5.x uses inputs)
    const inputs = await obs.call('GetInputList');
    const mediaSourceExists = inputs.inputs.some(input => input.inputName === 'ChatVoiceAudio');
    
    if (!mediaSourceExists) {
      await obs.call('CreateInput', {
        sceneName: config.obs.scene,
        inputName: 'ChatVoiceAudio',
        inputKind: 'ffmpeg_source',
        inputSettings: {
          local_file: audioPath,
          looping: false
        },
        sceneItemEnabled: true
      });
    } else {
      // Update the media source with the new audio file
      await obs.call('SetInputSettings', {
        inputName: 'ChatVoiceAudio',
        inputSettings: {
          local_file: audioPath,
          looping: false
        },
        overlay: false
      });
    }
    
    // Play the media
    await obs.call('TriggerMediaInputAction', {
      inputName: 'ChatVoiceAudio',
      mediaAction: 'OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART'
    });
    
    console.log('Playing audio in OBS');
  } catch (error) {
    console.error('Failed to play audio in OBS:', error.message);
  }
}

// Process messages and generate voice
async function processMessageQueue() {
  if (isProcessing || messageQueue.length < config.messagesBeforeResponse) {
    return;
  }
  
  // Check cooldown
  const now = Date.now();
  if (now - lastPlayedTime < config.cooldownMs) {
    return;
  }
  
  isProcessing = true;
  
  try {
    // Get messages to process
    const messagesToProcess = messageQueue.slice(0, config.messagesBeforeResponse);
    messageQueue = messageQueue.slice(config.messagesBeforeResponse);
    
    console.log(`Processing ${messagesToProcess.length} messages`);
    
    // Generate AI response
    const response = await processMessages(messagesToProcess, config.personality);
    console.log('AI Response:', response);
    
    // Generate voice using ElevenLabs
    const audioPath = await generateVoice(response, config.voice);
    
    // Play audio in OBS
    await playAudioInOBS(audioPath);
    
    // Update last played time
    lastPlayedTime = Date.now();
    
    // Emit event to web interface
    io.emit('response', {
      messages: messagesToProcess,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing messages:', error.message);
  } finally {
    isProcessing = false;
    
    // Process more messages if available
    if (messageQueue.length >= config.messagesBeforeResponse) {
      setTimeout(processMessageQueue, 1000);
    }
  }
}

// Handle Twitch chat messages
twitchClient.on('message', (channel, tags, message, self) => {
  if (self) return; // Ignore messages from the bot
  
  // Add message to queue
  messageQueue.push({
    username: tags['display-name'] || tags.username,
    message: message,
    timestamp: new Date().toISOString()
  });
  
  // Process queue if enough messages
  processMessageQueue();
});

// Web interface routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/config', (req, res) => {
  // Send safe config (without sensitive data)
  const safeConfig = {
    messagesBeforeResponse: config.messagesBeforeResponse,
    personality: config.personality,
    voice: config.voice,
    cooldownMs: config.cooldownMs
  };
  res.json(safeConfig);
});

app.post('/api/config', (req, res) => {
  // Update config
  const newConfig = req.body;
  
  if (newConfig.messagesBeforeResponse) {
    config.messagesBeforeResponse = parseInt(newConfig.messagesBeforeResponse, 10);
  }
  
  if (newConfig.personality) {
    config.personality = newConfig.personality;
  }
  
  if (newConfig.voice) {
    config.voice = newConfig.voice;
  }
  
  if (newConfig.cooldownMs) {
    config.cooldownMs = parseInt(newConfig.cooldownMs, 10);
  }
  
  // Save config to file
  fs.writeFileSync(
    path.join(__dirname, 'config.js'),
    `module.exports = ${JSON.stringify(config, null, 2)};`
  );
  
  res.json({ success: true, config: config });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Web client connected');
  
  socket.on('disconnect', () => {
    console.log('Web client disconnected');
  });
  
  socket.on('clearQueue', () => {
    messageQueue = [];
    io.emit('queueCleared');
  });
});

// Start the server
async function start() {
  try {
    // Connect to Twitch
    await twitchClient.connect();
    console.log('Connected to Twitch chat');
    
    // Connect to OBS
    const obsConnected = await connectToOBS();
    if (!obsConnected) {
      console.log('Will try to reconnect to OBS later...');
    }
    
    // Start web server
    server.listen(config.port, () => {
      console.log(`Web interface running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start:', error.message);
  }
}

// Handle reconnection to OBS
setInterval(async () => {
  try {
    const connectionStatus = await obs.call('GetVersion');
  } catch (error) {
    console.log('Reconnecting to OBS...');
    connectToOBS();
  }
}, 30000);

// Start the application
start();

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await twitchClient.disconnect();
    await obs.disconnect();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});
