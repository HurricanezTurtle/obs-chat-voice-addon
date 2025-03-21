const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Ensure audio directory exists
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Generate voice using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @param {object} voiceConfig - Voice configuration
 * @returns {Promise<string>} - Path to the generated audio file
 */
async function generateVoice(text, voiceConfig) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set in environment variables');
    }

    const voiceId = voiceConfig.id || 'EXAVITQu4vr4xnSDxMaL'; // Default voice ID
    
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const response = await axios({
      method: 'post',
      url: url,
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: voiceConfig.stability || 0.5,
          similarity_boost: voiceConfig.similarity_boost || 0.75
        }
      },
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `voice_${timestamp}.mp3`;
    const filePath = path.join(audioDir, filename);
    
    // Save the audio file
    await writeFileAsync(filePath, response.data);
    
    console.log(`Voice generated and saved to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error generating voice:', error.message);
    if (error.response) {
      console.error('ElevenLabs API error:', error.response.status, error.response.data);
    }
    throw error;
  }
}

/**
 * Get available voices from ElevenLabs
 * @returns {Promise<Array>} - List of available voices
 */
async function getVoices() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set in environment variables');
    }
    
    const response = await axios({
      method: 'get',
      url: 'https://api.elevenlabs.io/v1/voices',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.voices;
  } catch (error) {
    console.error('Error getting voices:', error.message);
    if (error.response) {
      console.error('ElevenLabs API error:', error.response.status, error.response.data);
    }
    return [];
  }
}

/**
 * Clean up old audio files to save disk space
 * @param {number} maxAgeMs - Maximum age of files to keep in milliseconds
 */
async function cleanupOldAudioFiles(maxAgeMs = 24 * 60 * 60 * 1000) { // Default: 24 hours
  try {
    const files = fs.readdirSync(audioDir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(audioDir, file);
      const stats = fs.statSync(filePath);
      const fileAgeMs = now - stats.mtimeMs;
      
      if (fileAgeMs > maxAgeMs) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old audio file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up audio files:', error.message);
  }
}

// Run cleanup every hour
setInterval(() => {
  cleanupOldAudioFiles();
}, 60 * 60 * 1000);

module.exports = {
  generateVoice,
  getVoices
};
