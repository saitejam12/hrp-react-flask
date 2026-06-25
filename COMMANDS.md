# Available Commands - HRP Monorepo

## Setup & Installation

### Complete Setup (All in One)

```bash
# Windows - Interactive setup script
install-all.bat

# macOS/Linux - Bash setup script
bash install-all.sh

# Cross-platform - Node.js setup
npm run setup
```

**What it does:**
- ✅ Installs root dependencies
- ✅ Installs React dependencies
- ✅ Creates Python virtual environment
- ✅ Installs Python dependencies
- ✅ Creates .env file from template

### Individual Installation

```bash
# Install root npm dependencies
npm install

# Install React dependencies only
npm run install:react

# Install Python dependencies only
npm run install:server

# Install both React + Python
npm run install:all
```

## Development

### Run Both Apps

```bash
# Using npm (recommended)
npm run dev

# Using Windows batch script
dev.bat

# Using bash script (macOS/Linux)
./dev.sh
```

**Starts:**
- React dev server: http://localhost:5173
- Flask server: http://localhost:5000
- API proxy: http://localhost:5173/api → http://localhost:5000/api

### Run Individual Apps

```bash
# React app only (Vite dev server)
npm run dev:react

# Flask server only
npm run dev:server
```

## Building

```bash
# Build React for production
npm run build

# Runs: tsc -b && vite build
```

## Code Quality

```bash
# Lint React code
npm run lint

# Runs: eslint .
```

## Monorepo Structure Commands

### Install Everything from Root

```bash
# One-line setup from root folder
npm run setup
```

This installs:
- Root `package.json` dependencies → `/node_modules`
- React `package.json` dependencies → `/hrp-react/node_modules`
- Python `requirements.txt` → `/hrp-server/venv`
- Environment configuration → `/hrp-server/.env`

### Install by Scope

```bash
# Root dependencies
npm install

# React workspace only (via postinstall)
npm run install:react

# Python workspace only
npm run install:server

# Both workspaces
npm run install:all
```

## Working with Prefix Commands

npm's `--prefix` flag runs commands in specified directories:

```bash
# Run React scripts from root
npm --prefix hrp-react run dev
npm --prefix hrp-react run build
npm --prefix hrp-react run lint

# Equivalent to:
cd hrp-react && npm run dev
cd hrp-react && npm run build
cd hrp-react && npm run lint
```

## Python Virtual Environment

### Activate Virtual Environment

**Windows:**
```bash
hrp-server\venv\Scripts\activate
```

**macOS/Linux:**
```bash
source hrp-server/venv/bin/activate
```

### Deactivate Virtual Environment

```bash
deactivate
```

### Install Python Packages Directly

```bash
# Activate venv first
source hrp-server/venv/bin/activate  # or venv\Scripts\activate on Windows

# Install from requirements.txt
pip install -r requirements.txt

# Add new package
pip install flask-sqlalchemy
pip freeze > requirements.txt
```

## API Development

### Test API Endpoints

```bash
# Check Flask server health
curl http://localhost:5000/api/health

# Get projects (via React proxy)
curl http://localhost:5173/api/projects

# Get projects directly from Flask
curl http://localhost:5000/api/projects
```

## Environment Variables

### Flask Server (.env)

```env
FLASK_ENV=development    # development or production
DEBUG=True              # Enable debug mode
PORT=5000               # Server port
```

**Location:** `hrp-server/.env`

### React Environment

No .env needed. Uses Vite's environment based on mode:
- Development: `import.meta.env.MODE === 'development'`
- Production: `import.meta.env.MODE === 'production'`

## Troubleshooting Commands

### Check Node.js and npm versions

```bash
node --version      # Should be v18+
npm --version       # Should be v9+
```

### Check Python version

```bash
python --version    # Should be 3.8+
# or
python3 --version
```

### Clear dependencies and reinstall

```bash
# Remove and reinstall everything
rm -rf node_modules hrp-react/node_modules hrp-server/venv
npm run setup
```

### Kill processes on ports

**Windows - Kill port 5000:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Windows - Kill port 5173:**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**macOS/Linux - Kill port 5000:**
```bash
lsof -ti:5000 | xargs kill -9
```

**macOS/Linux - Kill port 5173:**
```bash
lsof -ti:5173 | xargs kill -9
```

## Package.json Scripts Reference

All available npm scripts from root:

```json
{
  "postinstall": "npm run install:react",
  "install:react": "npm --prefix hrp-react install",
  "install:server": "pip install -r requirements.txt",
  "install:all": "npm install && npm run install:react && npm run install:server",
  "setup": "node setup.js",
  "setup:windows": "install-all.bat",
  "setup:unix": "bash install-all.sh",
  "dev": "concurrently \"npm --prefix hrp-react run dev\" \"cd hrp-server && python wsgi.py\"",
  "dev:react": "npm --prefix hrp-react run dev",
  "dev:server": "cd hrp-server && python wsgi.py",
  "build": "npm --prefix hrp-react run build",
  "lint": "npm --prefix hrp-react run lint"
}
```

## Quick Reference

| Task | Command |
|------|---------|
| **First Time Setup** | `npm run setup` or `install-all.bat` |
| **Start Development** | `npm run dev` or `dev.bat` |
| **Install React deps** | `npm run install:react` |
| **Install Python deps** | `npm run install:server` |
| **Build for production** | `npm run build` |
| **Lint code** | `npm run lint` |
| **Start React only** | `npm run dev:react` |
| **Start Flask only** | `npm run dev:server` |

## Notes

- All commands should be run from the **root folder** of the monorepo
- Python venv is created in `hrp-server/venv/`
- npm modules are installed in respective node_modules folders
- The `.gitignore` excludes `venv/` and `node_modules/` from git
