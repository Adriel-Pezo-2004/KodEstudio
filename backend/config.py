import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-default-secret-key'
    DEBUG = True
    
    # MongoDB configuration
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017'
    MONGO_DB_NAME = 'KodEstudio'
    
