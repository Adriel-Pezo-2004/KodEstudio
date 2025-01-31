import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Perfil.css';

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
            const response = await axios.put('/api/user', user, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage(response.data.message);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user data:', error);
            setMessage('Error updating profile');
        }
    };

    return (
        <div className="perfil-card">
            <div className="user-icon"></div>
            <h2 className="user-title">{username}</h2>
            <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancelar' : 'Editar'}
            </button>
            {message && <p>{message}</p>}
            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            )}
        </div>
    );
};

export default Perfil;