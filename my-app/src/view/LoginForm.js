import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './configAuth/AuthProv'; 
import backButtonIcon from '../util/icons/icon_back.png';

const LoginForm = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Obtiene la función de login del contexto

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cedula, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Almacena el token
            login({ cedula, token: data.token }); // Actualiza el contexto con la información del usuario
            alert('Login exitoso');
            navigate("/");
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleBackButtonClick = () => {
        navigate(-1);
    };

    return (
        <div className="main-block">
            <div className='main-block-ElementTogether'>
                <button className='main-block-button btnVolver' onClick={handleBackButtonClick}>
                    <img src={backButtonIcon} alt="Volver" />
                </button>
                <h1 className="main-block-title">Login</h1>
            </div>

            <hr />
            <form className='main-block-form' onSubmit={handleLogin}>
                <input
                    className="main-block-input"
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="Usuario"
                    required
                />
                <input
                    className="main-block-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button className='btn secondary' type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginForm;