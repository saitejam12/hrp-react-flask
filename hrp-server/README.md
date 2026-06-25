# HRP Server

Flask backend for the HRP monorepo with multiple project module support.

## Project Structure

```
hrp-server/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration management
│   ├── projects/            # Project modules
│   │   ├── __init__.py
│   │   └── api.py           # Main API blueprint
│   └── utils/               # Utility functions
│       ├── __init__.py
│       └── helpers.py
├── venv/                    # Virtual environment
├── wsgi.py                  # Entry point
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Run development server:**
   ```bash
   python wsgi.py
   ```

   Server will be available at `http://localhost:5000`

## Adding New Project Modules

To add a new project module:

1. Create a new folder under `app/projects/<module_name>/`
2. Add `__init__.py` and relevant files
3. Create a Blueprint in your module
4. Import and register in `app/__init__.py`'s `register_projects()` function

Example:

```python
# app/projects/users/__init__.py
from flask import Blueprint

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/', methods=['GET'])
def get_users():
    return {'users': []}, 200
```

Then register in `app/__init__.py`:

```python
def register_projects(app):
    from app.projects import api, users
    app.register_blueprint(api.bp)
    app.register_blueprint(users.bp)
```

## API Endpoints

- `GET /api/health` - Health check endpoint

## Environment Variables

See `.env.example` for available configuration options.
