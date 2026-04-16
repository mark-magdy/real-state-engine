import os
from flask import Flask
from flask_cors import CORS
from mongoengine import connect
from controllers.property_controller import property_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Connect to MongoDB via MongoEngine
    mongo_uri = os.environ.get('MONGO_URI', 'mongodb+srv://johnemile2002_db_user:9bnihTnbvNc5u2BO@real-estate.ml220id.mongodb.net/')
    connect(host=mongo_uri)

    # Register blueprints (controllers)
    app.register_blueprint(property_bp, url_prefix='/api/properties')

    @app.route('/')
    def index():
        return {"message": "Welcome to the Property API"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', debug=True, port=5000)
