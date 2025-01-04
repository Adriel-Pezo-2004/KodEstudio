from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from routes.api import api_bp
from routes.auth import auth_bp # type: ignore
from config import Config # type: ignore

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # Registrar blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

app = create_app()

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "¡Backend conectado correctamente!"}) # type: ignore

if __name__ == '__main__':
    app.run(debug=True, port=5000)