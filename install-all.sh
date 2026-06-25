#!/bin/bash

set -e

echo ""
echo "============================================"
echo "HRP Monorepo - Complete Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    exit 1
fi

echo "[1/5] Installing root dependencies..."
npm install
echo ""

echo "[2/5] Installing React dependencies..."
npm --prefix hrp-react install
echo ""

echo "[3/5] Creating Python virtual environment..."
cd hrp-server
python3 -m venv venv
echo ""

echo "[4/5] Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate
echo ""

echo "[5/5] Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env created from .env.example"
else
    echo "✅ .env already exists"
fi
cd ..

echo ""
echo "============================================"
echo "✅ Setup Complete!"
echo "============================================"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "Services will run on:"
echo "  • React:  http://localhost:5173"
echo "  • Flask:  http://localhost:5000"
echo "  • API:    http://localhost:5000/api"
echo ""
echo "============================================"
echo ""
