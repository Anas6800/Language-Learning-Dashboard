# PowerShell Deployment Script for Language Learning Dashboard

Write-Host "🚀 Deploying Language Learning Dashboard to Firebase Hosting..." -ForegroundColor Green

# Install Firebase CLI if not already installed
if (!(Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Deploy to Firebase Hosting
Write-Host "🌐 Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌍 Your app is now live at https://language-learning-dashboard.firebaseapp.com" -ForegroundColor Cyan
