#!/bin/bash

echo "Starting HRP Development Environment..."
echo "=========================================="
echo ""
echo "Starting React app (http://localhost:5173)..."
echo "Starting Flask server (http://localhost:5000)..."
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Start both services in parallel
cd "$(dirname "$0")"

npm install

cd hrp-react
npm install &
cd ../hrp-server
python -m venv venv
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt > /dev/null 2>&1 &

wait

echo ""
echo "All dependencies installed. Starting services..."
npm --prefix hrp-react run dev &
cd hrp-server && source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null && python wsgi.py &

wait
