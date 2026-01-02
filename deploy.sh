#!/bin/bash

echo "🚀 Deploying Language Learning Dashboard to Firebase Hosting..."

# Install Firebase CLI if not already installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase (uncomment if not already logged in)
# firebase login

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo "🌍 Your app is now live at https://language-learning-dashboard.firebaseapp.com"
