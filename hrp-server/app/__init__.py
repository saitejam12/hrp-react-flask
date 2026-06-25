from flask import Flask
from flask_cors import CORS


def create_app(config=None):
    app = Flask(__name__)

    if config:
        app.config.from_object(config)
    else:
        app.config.from_object('app.config.DevelopmentConfig')

    CORS(app)

    register_projects(app)

    return app


def register_projects(app):
    """Register all project modules."""
    from app.projects import api

    app.register_blueprint(api.bp)
