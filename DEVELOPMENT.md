# Development Guide - HRP React Flask Monorepo

## Installation

### Complete Setup (Recommended - One Command!)

Install all dependencies for both React and Python from the root folder:

**Windows:**
```bash
install-all.bat
```

**macOS/Linux:**
```bash
bash install-all.sh
```

**Or cross-platform using Node.js:**
```bash
npm run setup
```

This will:
1. ✅ Install root npm dependencies
2. ✅ Install React dependencies
3. ✅ Create Python virtual environment
4. ✅ Install Python dependencies
5. ✅ Create .env file from template

### Individual Installation Commands

**Install only React dependencies:**
```bash
npm run install:react
```

**Install only Python dependencies:**
```bash
npm run install:server
```

**Install both (after root npm install):**
```bash
npm run install:all
```

## Quick Start

### Option 1: Using Root Scripts (Recommended)

After setup, start both apps:

**Windows:**
```bash
dev.bat
```

**macOS/Linux:**
```bash
./dev.sh
```

### Option 2: Using npm Commands

From the root directory:
```bash
npm run dev
```

### Option 3: Start Apps Separately

**Terminal 1 - React App:**
```bash
npm run dev:react
```

**Terminal 2 - Flask Server:**
```bash
npm run dev:server
```

### Option 4: Manual Setup (If scripts fail)

**Terminal 1 - React App:**
```bash
cd hrp-react
npm run dev
```

**Terminal 2 - Flask Server:**
```bash
cd hrp-server
source venv/bin/activate  # Windows: venv\Scripts\activate
python wsgi.py
```

## Development Endpoints

- **React App**: http://localhost:5173
- **Flask Server**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
hrp-react-flask/
├── hrp-react/                     # React Frontend
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts            # API client service
│   │   ├── hooks/
│   │   │   └── useApi.ts         # React hook for API calls
│   │   ├── App.tsx               # Main app component (with API examples)
│   │   └── main.tsx
│   ├── vite.config.ts            # Vite config with API proxy
│   └── package.json
│
├── hrp-server/                    # Flask Backend
│   ├── app/
│   │   ├── __init__.py           # App factory
│   │   ├── config.py             # Configuration
│   │   ├── projects/
│   │   │   └── api.py            # Main API blueprint (with mock endpoints)
│   │   └── utils/
│   ├── wsgi.py                   # Entry point
│   ├── requirements.txt
│   ├── .env                      # Environment variables
│   └── README.md
│
├── dev.bat                        # Windows startup script
├── dev.sh                         # Unix/Linux/macOS startup script
├── package.json                   # Root npm configuration
└── DEVELOPMENT.md                 # This file
```

## API Integration

### React → Flask Communication

The React app is configured to proxy API requests to Flask through Vite's development server:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

### Using the API Client

The `services/api.ts` provides a typed API client:

```typescript
import { api } from '@/services/api'

// GET request
const response = await api.get('/projects')

// POST request
const response = await api.post('/projects', { name: 'New Project' })

// DELETE request
const response = await api.delete('/projects/1')
```

### Using the useApi Hook

For React components:

```typescript
import { useApi } from '@/hooks/useApi'

function ProjectsList() {
  const { data, loading, error, status } = useApi<any[]>('/projects')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {data?.map(project => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

## Mock API Endpoints

Available mock endpoints for development:

- `GET /api/health` - Server health check
- `GET /api/projects` - Get all projects
- `GET /api/projects/<id>` - Get specific project
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/<project_id>` - Get tasks for a project

### Example Responses

**GET /api/projects**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Project Alpha",
      "status": "active",
      "progress": 75
    }
  ]
}
```

**GET /api/tasks/1**
```json
{
  "tasks": [
    {
      "id": 1,
      "project_id": 1,
      "title": "Setup infrastructure",
      "status": "completed"
    }
  ]
}
```

## Adding New API Endpoints

### Backend (Flask)

1. Add endpoint to `hrp-server/app/projects/api.py`:

```python
@bp.route('/users', methods=['GET'])
def get_users():
    return jsonify({'users': []}), 200
```

2. Or create a new module:

```python
# hrp-server/app/projects/users.py
from flask import Blueprint, jsonify

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/', methods=['GET'])
def get_users():
    return jsonify({'users': []}), 200
```

3. Register in `hrp-server/app/__init__.py`:

```python
def register_projects(app):
    from app.projects import api, users
    app.register_blueprint(api.bp)
    app.register_blueprint(users.bp)
```

### Frontend (React)

1. Add method to `hrp-react/src/services/api.ts`:

```typescript
export const api = {
  users: () => makeRequest('/users'),
  // ...
}
```

2. Use in components:

```typescript
const response = await api.users()
```

## Environment Variables

### Flask Server (.env)

```
FLASK_ENV=development      # development or production
DEBUG=True                 # Enable debug mode
PORT=5000                  # Server port
```

### React (.env)

No .env file needed for development. The proxy in `vite.config.ts` handles API routing.

## Troubleshooting

### Port Already in Use

If ports 5000 or 5173 are already in use:

**Flask (5000):**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Unix/Linux:
lsof -ti:5000 | xargs kill -9
```

**React (5173):**
Set a different port in `venv.config.ts`:
```typescript
server: {
  port: 5174  // or any available port
}
```

### CORS Issues

Ensure Flask-CORS is properly imported in `app/__init__.py`:
```python
from flask_cors import CORS
CORS(app)
```

### Proxy Not Working

Make sure:
1. Flask server is running on http://localhost:5000
2. Vite proxy config is correct
3. Clear browser cache and restart dev servers

## Scripts

**Root package.json scripts:**
- `npm run dev` - Start both React and Flask
- `npm run dev:react` - Start only React
- `npm run dev:server` - Start only Flask
- `npm run build` - Build React for production
- `npm run lint` - Lint React code

**React-specific scripts:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Next Steps

1. ✅ Both apps are running
2. ✅ APIs are connected
3. Add real database/models (SQLAlchemy)
4. Add authentication
5. Add more complex endpoints
6. Deploy to production

## More Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
