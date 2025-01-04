from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import insert_user, get_user_by_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Verifica si el usuario ya existe
    if get_user_by_email(data['email']):
        return jsonify({"error": "Email ya registrado"}), 400
    
    # Hashea la contraseña
    hashed_password = generate_password_hash(data['password'])
    
    # Prepara los datos del usuario
    user_data = {
        "email": data['email'],
        "password": hashed_password,
        "name": data.get('name', ''),
        # Agrega cualquier otro campo que quieras almacenar
    }
    
    # Inserta el usuario en la base de datos
    user_id = insert_user(user_data)
    
    return jsonify({"message": "Usuario registrado exitosamente", "user_id": user_id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = get_user_by_email(data['email'])
    
    if user and check_password_hash(user['password'], data['password']):
        # Aquí normalmente crearías una sesión o un token JWT
        return jsonify({"message": "Inicio de sesión exitoso"}), 200
    else:
        return jsonify({"error": "Email o contraseña inválidos"}), 401

