#!/bin/bash
# ReBreath — start both frontend and backend
# Usage: ./run.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting ReBreath..."
echo ""

# Start backend
echo "[Backend] Starting FastAPI on :8000..."
cd "$PROJECT_DIR/backend"
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start frontend
echo "[Frontend] Starting Next.js on :3000..."
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "ReBreath running:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both."

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
