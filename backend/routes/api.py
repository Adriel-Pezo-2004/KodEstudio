from flask import Blueprint, jsonify # type: ignore

api_bp = Blueprint('api', __name__)

@api_bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "¡Backend conectado correctamente!"})