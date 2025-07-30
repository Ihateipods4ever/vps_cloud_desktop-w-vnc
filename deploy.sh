#!/bin/bash

# VPS Desktop Deployment Script
# This script sets up and runs the VPS desktop application

echo "🚀 Starting VPS Desktop Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Start the application
echo "🌟 Starting the VPS Desktop application..."
echo "📍 Application will be available at: http://localhost:3000"
echo "🔧 Use Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev