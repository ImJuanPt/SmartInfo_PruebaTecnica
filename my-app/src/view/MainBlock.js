import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './configAuth/AuthProv'; // Ajustar la ruta según sea necesario

const MainBlock = () => {
    const { user, logout } = useAuth(); // Obtener el usuario y la funcion de logout
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Ejecutar el logout
        navigate("/login"); // Redirigir a la pagina de login
    };

    return (
        <div className="main-block">
            <h1 className="main-block-title">SmartInfo</h1>
            <hr />
            {user ? ( // Verificar si hay un usuario autenticado
                <>
                    <Link to="/menu" className="main-block-element">Menú</Link>
                    <a onClick={handleLogout} className="main-block-element" href=''>
                        Cerrar Sesión
                    </a>
                </>
            ) : (
                <>
                    <Link to="/login" className="main-block-element">Iniciar Sesión</Link>
                    <Link to="/register" className="main-block-element">Registrarse</Link>
                </>
            )}
        </div>
    );
};

export default MainBlock;