import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Perfil.css';

const UserIcon = () => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M256 256c52.805 0 96-43.201 96-96s-43.195-96-96-96-96 43.201-96 96 43.195 96 96 96zm0 48c-63.598 0-192 32.402-192 96v48h384v-48c0-63.598-128.402-96-192-96z"/>
    </svg>
);

const Perfil = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing!');
    }
    const [user, setUser] = useState({
        username: '',
        password: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const username = localStorage.getItem('username');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/user', user, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Actualizar el username en localStorage
            localStorage.setItem('username', user.username);
            setMessage('Usuario Actualizado');
            setIsEditing(false);
            // Forzar la recarga del componente
            window.location.reload();
        } catch (error) {
            console.error('Error updating user data:', error);
            setMessage('Error al actualizar usuario');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-form">
                <div className="profile-picture">
                    <div className="user-icon">
                        <UserIcon />
                    </div>
                </div>
                <h1 className="user-title">{username}</h1>
                {message && <p className="message">{message}</p>}
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre de Usuario:</label>
                            <input
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button className="update-btn" type="submit">Actualizar Información</button>
                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </form>
                ) : (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>Editar</button>
                )}
            </div>
        </div>
    );
};

export default Perfil;