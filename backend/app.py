from flask import Flask, request, jsonify
from flask_cors import CORS
from database import DatabaseManager
import logging
from datetime import datetime
from bson.errors import InvalidId
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize database manager
db_manager = DatabaseManager()

# Error handler for invalid ObjectId
@app.errorhandler(InvalidId)
def handle_invalid_id(error):
    return jsonify({'error': 'Invalid requirement ID format'}), 400

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
def get_requirements():
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
            return jsonify({'message': 'Requirement updated successfully'}), 200
        return jsonify({'error': 'Requirement not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error updating requirement: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

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