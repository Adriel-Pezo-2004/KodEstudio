from flask import Blueprint, request, jsonify
from database import (
    insert_project_requirement,
    get_project_requirement,
    get_all_project_requirements,
    update_project_requirement
)

api_bp = Blueprint('api', __name__)

@api_bp.route('/submit-requirements', methods=['POST'])
def submit_requirements():
    try:
        form_data = request.json
        
        # Validate required fields
        required_fields = [
            'date', 'projectTitle', 'requestorName', 'requestorPhone',
            'requestorEmail', 'department', 'sponsorName', 'sponsorPhone',
            'sponsorEmail', 'description', 'dependencies', 'requestedEndDate',
            'estimatedBudget'
        ]
        
        for field in required_fields:
            if field not in form_data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Insert the form data into MongoDB
        requirement_id = insert_project_requirement(form_data)
        
        return jsonify({
            'message': 'Project requirements submitted successfully',
            'requirement_id': requirement_id
        }), 201
        
    except Exception as e:
        return jsonify({
            'error': f'Error submitting requirements: {str(e)}'
        }), 500

@api_bp.route('/requirements', methods=['GET'])
def get_requirements():
    try:
        requirements = get_all_project_requirements()
        # Convert ObjectId to string for JSON serialization
        for req in requirements:
            req['_id'] = str(req['_id'])
        
        return jsonify(requirements), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error retrieving requirements: {str(e)}'
        }), 500

@api_bp.route('/requirements/<requirement_id>', methods=['GET'])
def get_requirement(requirement_id):
    try:
        requirement = get_project_requirement(requirement_id)
        if requirement:
            requirement['_id'] = str(requirement['_id'])
            return jsonify(requirement), 200
        else:
            return jsonify({
                'error': 'Requirement not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'error': f'Error retrieving requirement: {str(e)}'
        }), 500

@api_bp.route('/requirements/<requirement_id>', methods=['PUT'])
def update_requirement(requirement_id):
    try:
        update_data = request.json
        success = update_project_requirement(requirement_id, update_data)
        
        if success:
            return jsonify({
                'message': 'Requirement updated successfully'
            }), 200
        else:
            return jsonify({
                'error': 'Requirement not found or no changes made'
            }), 404
            
    except Exception as e:
        return jsonify({
            'error': f'Error updating requirement: {str(e)}'
        }), 500
