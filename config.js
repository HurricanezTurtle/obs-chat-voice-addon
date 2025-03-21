module.exports = {
  // Debug mode
  debug: false,
  
  // Number of messages to collect before generating a response (1-5)
  messagesBeforeResponse: 3,
  
  // Cooldown between responses in milliseconds (default: 30 seconds)
  cooldownMs: 30000,
  
  // Web interface port
  port: 3000,
  
  // Twitch connection settings
  twitch: {
    // Your Twitch bot username
    username: "YourBotUsername",
    
    // OAuth token for your bot (get from https://twitchapps.com/tmi/)
    // DO NOT share this token with anyone
    oauth: "oauth:your_oauth_token_here",
    
    // Channel to connect to (usually your Twitch username)
    channel: "YourChannel"
  },
  
  // OBS connection settings
  obs: {
    // OBS WebSocket host (usually localhost)
    host: "localhost",
    
    // OBS WebSocket port (default: 4455)
    port: 4455,
    
    // OBS WebSocket password (if set in OBS)
    password: "",
    
    // Scene name where the audio source will be added
    scene: "Main"
  },
  
  // Voice settings for ElevenLabs
  voice: {
    // Voice ID from ElevenLabs
    // You can find voice IDs at https://api.elevenlabs.io/v1/voices
    id: "EXAVITQu4vr4xnSDxMaL", // Default voice ID
    
    // Voice stability (0.0 to 1.0)
    // Higher values make the voice more stable and less expressive
    stability: 0.5,
    
    // Similarity boost (0.0 to 1.0)
    // Higher values make the voice more similar to the original
    similarity_boost: 0.75
  },
  
  // Personality/tone for AI responses
  // Examples: "friendly and casual", "sarcastic and witty", "helpful and informative"
  personality: "friendly and engaging"
};
