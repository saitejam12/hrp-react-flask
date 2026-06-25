# HRP React Flask - Monorepo

A full-stack monorepo with React frontend and Flask backend, supporting multiple project modules with connected APIs.

## Installation & Quick Start

### Step 1: Complete Setup (Install All Dependencies)

Choose your platform:

**Windows:**
```bash
install-all.bat
```

**macOS/Linux:**
```bash
bash install-all.sh
```

**Or use Node.js (all platforms):**
```bash
npm run setup
```

### Step 2: Start Development

**Windows:**
```bash
dev.bat
```

**macOS/Linux:**
```bash
./dev.sh
```

**Or use npm:**
```bash
npm run dev
```

Both apps will start automatically:
- **React**: http://localhost:5173
- **Flask**: http://localhost:5000

## Architecture

```
┌─────────────────────────────────────────────┐
│           React App (Vite)                  │
│        http://localhost:5173                │
│  ┌──────────────────────────────────────┐   │
│  │  src/                                │   │
│  │  ├── services/api.ts (API client)    │   │
│  │  ├── hooks/useApi.ts (React hooks)   │   │
│  │  └── App.tsx (example with API)      │   │
│  └──────────────────────────────────────┘   │
└────────────────┬────────────────────────────┘
                 │ /api proxy
                 ▼
┌─────────────────────────────────────────────┐
│      Flask Server with Blueprints           │
│        http://localhost:5000                │
│  ┌──────────────────────────────────────┐   │
│  │  app/                                │   │
│  │  ├── projects/api.py (endpoints)     │   │
│  │  ├── config.py (configuration)       │   │
│  │  └── utils/ (shared utilities)       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Features

✅ **React + Vite Frontend**
- TypeScript support
- Hot Module Replacement (HMR)
- API proxy to Flask backend
- ESLint configured

✅ **Flask Backend**
- Modular blueprint architecture
- Multiple project support
- Environment configuration
- CORS enabled
- Mock API endpoints included

✅ **API Integration**
- Typed API client (`services/api.ts`)
- React hooks for API calls (`useApi.ts`)
- Development proxy configuration
- Mock endpoints for testing

✅ **Development Tools**
- Concurrent app runner (`npm run dev`)
- Platform-specific startup scripts (Windows/Unix)
- Environment configuration files

## Project Structure

```
hrp-react-flask/
├── hrp-react/                          # React Frontend
│   ├── src/
│   │   ├── services/api.ts            # API client
│   │   ├── hooks/useApi.ts            # React hooks
│   │   ├── config/environment.ts      # Environment config
│   │   └── App.tsx                    # Example with API usage
│   ├── vite.config.ts                 # API proxy config
│   └── package.json
│
├── hrp-server/                         # Flask Backend
│   ├── app/
│   │   ├── __init__.py                # App factory
│   │   ├── config.py                  # Config management
│   │   ├── projects/
│   │   │   └── api.py                 # Main API (with mock endpoints)
│   │   └── utils/
│   ├── wsgi.py                        # Entry point
│   ├── requirements.txt
│   ├── .env                           # Environment variables
│   └── README.md
│
├── dev.bat / dev.sh                    # Startup scripts
├── package.json                        # Root npm config
├── DEVELOPMENT.md                      # Detailed dev guide
└── README.md                           # This file
```

## API Endpoints (Mock)

- `GET /api/health` - Server status
- `GET /api/projects` - List all projects
- `GET /api/projects/<id>` - Get project details
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/<project_id>` - Get project tasks

## Development

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md)

**Common Commands:**
```bash
# Start both apps
npm run dev

# Start only React
npm run dev:react

# Start only Flask
npm run dev:server

# Build for production
npm run build
```

## Adding Features

**New API Endpoint:**
1. Add to `hrp-server/app/projects/api.py`
2. Use in React via `api.get('/endpoint')`

**New Project Module:**
1. Create `hrp-server/app/projects/<module>/`
2. Register in `hrp-server/app/__init__.py`
3. See `hrp-server/README.md` for details

## Advanced Features ✨

### Frontend (React)
- **RBAC Integration**: Complete role-based access control (Admin, Manager, Employee)
- **TanStack Query**: Advanced data fetching, caching, and mutation management
- **TanStack Table**: Sortable, filterable, paginated data tables
- **Three.js 3D**: Interactive 3D visualizations for dashboards
- **Authentication**: Full login system with protected routes
- **TypeScript**: Complete type safety

### Backend (Flask)
- **RESTful API**: Full CRUD endpoints
- **Authentication**: Login endpoint with JWT support
- **Mock Data**: Realistic demo data

## Demo Accounts

Login with any of these demo accounts:

```
Admin:    admin@example.com / password123
Manager:  manager@example.com / password123
Employee: employee@example.com / password123
```

## Documentation

- **[REACT_SETUP.md](./REACT_SETUP.md)** - Complete React app guide
- **[FEATURES.md](./FEATURES.md)** - Feature overview and tech stack
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow
- **[COMMANDS.md](./COMMANDS.md)** - Command reference
- **[Frontend README](./hrp-react/README.md)** - React app details
- **[Backend README](./hrp-server/README.md)** - Flask app details