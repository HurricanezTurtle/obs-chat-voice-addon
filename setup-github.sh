#!/bin/bash

# Initialize Git repository and push to GitHub
# This script helps you set up a GitHub repository for your OBS Chat Voice project

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    echo "Git repository initialized."
else
    echo "Git repository already initialized."
fi

# Add all files to Git
echo "Adding files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit"

# Ask for GitHub username and repository name
read -p "Enter your GitHub username: " github_username
read -p "Enter repository name (default: obs-chat-voice): " repo_name
repo_name=${repo_name:-obs-chat-voice}

# Create GitHub repository
echo "Creating GitHub repository: $github_username/$repo_name"
echo "Please create a new repository on GitHub:"
echo "https://github.com/new"
echo "Repository name: $repo_name"
echo "Description: OBS addon that reads chat messages and responds with a generated voice using AI"
echo "Make it Public or Private as you prefer"
echo "Do NOT initialize with README, .gitignore, or license (we already have these)"
read -p "Press Enter when you've created the repository on GitHub..."

# Add GitHub remote
echo "Adding GitHub remote..."
git remote add origin "https://github.com/$github_username/$repo_name.git"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo "Setup complete! Your OBS Chat Voice project is now on GitHub at:"
echo "https://github.com/$github_username/$repo_name"
