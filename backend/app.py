from flask import Flask, request, jsonify
from flask_cors import CORS
from database import DatabaseManager
import logging
from datetime import datetime, timedelta
from bson.errors import InvalidId
from bson import ObjectId
import jwt
from functools import wraps

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Cambia esto por una clave secreta segura

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize database manager
db_manager = DatabaseManager()

# Error handler for invalid ObjectId
@app.errorhandler(InvalidId)
def handle_invalid_id(error):
    return jsonify({'error': 'Invalid requirement ID format'}), 400

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 403
        try:
            token = token.split(" ")[1]  # Remove 'Bearer' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db_manager.get_user_by_id(data['user_id'])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid!'}), 403
        except Exception as e:
            logger.error(f"Token error: {str(e)}")
            return jsonify({'error': 'Token is invalid!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    try:
        auth = request.json
        print("Received login request with data:", {
            'username': auth.get('username'),
            'password': '***'  # No imprimimos la contraseña por seguridad
        })

        if not auth or not auth.get('username') or not auth.get('password'):
            print("Missing credentials")
            return jsonify({'error': 'Missing username or password'}), 401

        user = db_manager.get_user_by_username(auth.get('username'))
        print("Found user:", {
            '_id': str(user['_id']) if user and '_id' in user else None,
            'username': user['username'] if user else None
        })

        if not user:
            print("User not found")
            return jsonify({'error': 'User not found'}), 401

        if not db_manager.verify_password(user['password'], auth.get('password')):
            print("Invalid password")
            return jsonify({'error': 'Invalid password'}), 401

        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        response_data = {
            'token': token,
            'username': user['username']
        }
        print("Sending response:", response_data)
        
        return jsonify(response_data)

    except Exception as e:
        print("Login error:", str(e))
        return jsonify({'error': 'Authentication failed'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    # En un sistema basado en JWT, el logout se maneja en el frontend
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/submit-requirements', methods=['POST'])
def submit_requirements():
    try:
        data = request.json
        requirement_id = db_manager.insert_project_requirement(data)
        return jsonify({
            'message': 'Requirement created successfully',
            'requirement_id': requirement_id
        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error creating requirement: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/requirements', methods=['GET'])
@token_required
def get_requirements(current_user):
    try:
        # Parse query parameters with defaults
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Build filters dictionary
        filters = {}
        for field in ['status', 'priority', 'department']:
            if request.args.get(field):
                filters[field] = request.args.get(field)
        
        # Parse sorting
        sort_by = {}
        if request.args.get('sort_field'):
            sort_by[request.args.get('sort_field')] = int(request.args.get('sort_direction', 1))
        
        result = db_manager.get_all_project_requirements(
            filters=filters,
            sort_by=sort_by,
            page=page,
            per_page=per_page
        )
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error retrieving requirements: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/requirements/<requirement_id>', methods=['GET'])
def get_requirement(requirement_id):
    try:
        requirement = db_manager.get_project_requirement(requirement_id)
        if requirement:
            return jsonify(requirement), 200
        return jsonify({'error': 'Requirement not found'}), 404
    except Exception as e:
        logger.error(f"Error retrieving requirement: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/requirements/<requirement_id>', methods=['PUT'])
def update_requirement(requirement_id):
    try:
        data = request.json
        success = db_manager.update_project_requirement(requirement_id, data)
        if success:
            return jsonify({'message': 'Solicitud actualizada'}), 200
        return jsonify({'error': 'Solicitud no encontrada'}), 404
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({'error': 'Unexpected error occurred'}), 500

@app.route('/api/requirements/<requirement_id>', methods=['DELETE'])
def delete_requirement(requirement_id):
    try:
        success = db_manager.delete_project_requirement(requirement_id)
        if success:
            return jsonify({'message': 'Requirement deleted successfully'}), 200
        return jsonify({'error': 'Requirement not found'}), 404
    except Exception as e:
        logger.error(f"Error deleting requirement: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/requirements/search', methods=['GET'])
def search_requirements():
    try:
        search_term = request.args.get('q', '')
        if not search_term:
            return jsonify({'error': 'Search term is required'}), 400
        
        results = db_manager.search_requirements(search_term)
        return jsonify({'results': results}), 200
    except Exception as e:
        logger.error(f"Error searching requirements: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/requirements/stats', methods=['GET'])
def get_stats():
    try:
        stats = db_manager.get_requirements_stats()
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Error retrieving stats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)