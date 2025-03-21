# OBS Chat Voice

An OBS addon that reads Twitch chat messages, consolidates them, and responds with a generated voice using AI. This creates an interactive experience where the chat "talks" to the streamer.

## Features

- Connects to Twitch chat and collects messages
- Consolidates 1-5 messages (configurable)
- Generates a natural-sounding response using AI
- Converts the response to speech using ElevenLabs
- Plays the audio in OBS as a media source
- Web interface for configuration and monitoring
- Compatible with Stream Elements (optional)
- Customizable voice personality/tone

## Requirements

- Node.js 14.x or higher
- OBS Studio 28.x or higher with WebSocket plugin enabled
- Twitch account for the bot
- ElevenLabs API key
- OpenAI API key (or Stream Elements API key)

## Installation

### Quick Setup

#### Windows
1. Clone this repository:
   ```
   git clone https://github.com/yourusername/obs-chat-voice.git
   cd obs-chat-voice
   ```
2. Run the setup script:
   ```
   setup.bat
   ```
3. Follow the on-screen instructions.

#### macOS/Linux
1. Clone this repository:
   ```
   git clone https://github.com/yourusername/obs-chat-voice.git
   cd obs-chat-voice
   ```
2. Make the setup script executable:
   ```
   chmod +x setup.sh
   ```
3. Run the setup script:
   ```
   ./setup.sh
   ```
4. Follow the on-screen instructions.

### Manual Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/obs-chat-voice.git
   cd obs-chat-voice
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the example environment file and edit it with your API keys:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your API keys.

4. Configure the application in `config.js`:
   - Update your Twitch username and OAuth token
   - Set your OBS WebSocket connection details
   - Adjust other settings as needed

5. Start the application:
   ```
   npm start
   ```

6. Open the web interface at `http://localhost:3000` to configure and monitor the addon.

### Testing

The project includes several test scripts to help you verify that everything is working correctly:

#### Test AI and Voice Generation

Test the AI response and voice generation without connecting to Twitch or OBS:

```
npm test
```

This will simulate chat messages, generate an AI response, and play the audio locally.

#### Test OBS Connection

Test the connection to OBS WebSocket:

```
npm run test:obs
```

This will attempt to connect to OBS using the settings in your config.js file and display information about your OBS setup if successful.

#### Test Twitch Connection

Test the connection to Twitch chat:

```
npm run test:twitch
```

This will attempt to connect to Twitch chat using the credentials in your config.js file and display incoming chat messages.

#### Test ElevenLabs Voice Generation

Test the connection to ElevenLabs API and voice generation:

```
npm run test:voice
```

This will fetch available voices from your ElevenLabs account, generate a test voice message, and save it as an audio file.

#### Test OpenAI API Connection

Test the connection to OpenAI API and response generation:

```
npm run test:ai
```

This will send a test prompt to the OpenAI API and display the generated response, confirming that your API key is working correctly.

#### Test All Components

Run all test scripts in sequence:

```
npm run test:all
```

This interactive script will guide you through testing all components one by one, allowing you to skip any tests you don't want to run. This is useful for verifying that all parts of the system are working correctly.

## OBS Setup

1. In OBS, go to Tools > WebSocket Server Settings
2. Enable the WebSocket server
3. Set a password if desired (make sure to update it in `config.js`)
4. Make sure the port matches what's in your `config.js` (default: 4455)

## Configuration

### Twitch Bot Setup

1. Create a Twitch account for your bot or use your existing account
2. Get an OAuth token from [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/)
3. Update the `twitch` section in `config.js` with your bot username, OAuth token, and channel name

### ElevenLabs Setup

1. Create an account at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from your profile settings
3. Add the API key to your `.env` file

### OpenAI Setup

1. Create an account at [OpenAI](https://openai.com/)
2. Get your API key from the API section
3. Add the API key to your `.env` file

## Usage

1. Start the application with `npm start`
2. Open the web interface at `http://localhost:3000`
3. Configure the number of messages to collect before generating a response (1-5)
4. Select the personality/tone for the AI responses
5. Choose a voice from ElevenLabs
6. Start your OBS and begin streaming
7. The addon will automatically collect chat messages and generate voice responses

### Web Interface

The web interface allows you to:
- Configure the number of messages to collect
- Set the personality/tone of the AI responses
- Select a voice from ElevenLabs
- View recent responses
- Clear the message queue
- Test the voice

## How It Works

1. The addon connects to Twitch chat using TMI.js
2. It collects messages from chat and stores them in a queue
3. When enough messages are collected (based on your configuration), it sends them to the AI service
4. The AI generates a natural-sounding response
5. The response is converted to speech using ElevenLabs
6. The audio is played in OBS through a media source

## Customization

### Personality/Tone

You can customize the personality/tone of the AI responses in the web interface. Some examples:
- Friendly and engaging
- Sarcastic and witty
- Helpful and informative
- Enthusiastic and energetic
- Calm and thoughtful
- Funny and playful

### Voice

You can select from various voices provided by ElevenLabs in the web interface. The addon will use the selected voice for all responses.

## Troubleshooting

### OBS Connection Issues

- Make sure OBS is running and the WebSocket server is enabled
- Check that the port and password in `config.js` match your OBS WebSocket settings
- Restart OBS and the addon if connection issues persist

### Twitch Connection Issues

- Verify your OAuth token is correct and has not expired
- Make sure your bot account has access to the channel
- Check your internet connection

### Voice Generation Issues

- Ensure your ElevenLabs API key is correct and has not expired
- Check that you have enough credits in your ElevenLabs account
- Try selecting a different voice

## Sharing on GitHub

This project includes scripts to help you share it on GitHub:

### For Windows Users
1. Run `setup-github.bat`
2. Follow the prompts to enter your GitHub username and repository name
3. Create a new repository on GitHub when prompted
4. The script will push the project to your GitHub repository

### For macOS/Linux Users
1. Run `chmod +x setup-github.sh` to make the script executable (or use `./make-scripts-executable.sh`)
2. Run `./setup-github.sh`
3. Follow the prompts to enter your GitHub username and repository name
4. Create a new repository on GitHub when prompted
5. The script will push the project to your GitHub repository

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMI.js](https://github.com/tmijs/tmi.js) for Twitch chat integration
- [OBS WebSocket](https://github.com/obsproject/obs-websocket) for OBS control
- [ElevenLabs](https://elevenlabs.io/) for voice generation
- [OpenAI](https://openai.com/) for AI response generation
