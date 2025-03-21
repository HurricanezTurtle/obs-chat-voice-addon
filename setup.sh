#!/bin/bash

echo "==================================="
echo "OBS Chat Voice - Setup Script"
echo "==================================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 14 ]; then
    echo "Warning: Node.js version $node_version detected."
    echo "This application requires Node.js 14 or higher."
    echo "Please upgrade your Node.js installation."
    echo
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies."
    echo "Please check your internet connection and try again."
    echo
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo
    echo "Please edit the .env file with your API keys."
    echo
fi

# Make scripts executable
echo "Making scripts executable..."
chmod +x setup-github.sh
chmod +x make-scripts-executable.sh

echo
echo "Setup completed successfully!"
echo
echo "Next steps:"
echo "1. Edit the .env file with your API keys"
echo "2. Configure the application in config.js"
echo "3. Run 'npm start' to start the application"
echo "4. Open http://localhost:3000 in your browser"
echo
echo "You can also run 'npm test' to test the application without connecting to Twitch or OBS."
echo
