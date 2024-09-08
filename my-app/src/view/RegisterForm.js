import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backButtonIcon from '../util/icons/icon_back.png';

const RegisterForm = () => {
    const [cedula, setCedula] = useState(''); // Estado para la cedula
    const [nombre, setNombre] = useState(''); // Estado para el nombre
    const [password, setPassword] = useState(''); // Estado para la contraseña
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cedula, nombre, password }), // Enviar datos al servidor
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error); // Manejar errores del servidor
            }

            const data = await response.json();
            alert(data.message); // Mostrar mensaje de exito
            navigate('/login'); // Redirigir a la pagina de inicio de sesion
        } catch (error) {
            alert(`Error: ${error.message}`); // Mostrar mensaje de error
        }
    };

    const handleBackButtonClick = () => {
        navigate(-1); // Volver a la pagina anterior
    };

    return (
        <div className="main-block">
            <div className='main-block-ElementTogether'>
                <button className='main-block-button btnVolver' onClick={handleBackButtonClick}>
                    <img src={backButtonIcon} alt="Volver" />
                </button>
                <h1 className="main-block-title">Registro</h1>
            </div>
            <hr />
            <form className='main-block-form' onSubmit={handleRegister}>
                <input
                    className="main-block-input"
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)} // Manejar cambio en cedula
                    placeholder="Cedula"
                    required
                />
                <input
                    className="main-block-input"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)} // Manejar cambio en nombre
                    placeholder="Nombre"
                    required
                />
                <input
                    className="main-block-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Manejar cambio en contraseña
                    placeholder="Contraseña"
                    required
                />
                <button className='main-block-input' type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default RegisterForm;