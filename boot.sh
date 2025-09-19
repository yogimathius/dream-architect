#!/bin/bash

# Boot script for Dream Architect (SvelteKit)
set -e

echo "🌙 Booting Dream Architect..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Start development server
echo "🚀 Starting development server..."
echo "   Available at: http://localhost:5173"
pnpm dev