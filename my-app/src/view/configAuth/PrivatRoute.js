// PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProv'; // Importar el hook de autenticación

const PrivateRoute = () => {
    const { user } = useAuth(); // Obtener el usuario del contexto de autenticación

    // Verificar si el usuario está autenticado
    return user ? <Outlet /> : <Navigate to="/login" />; 
    // Si esta autenticado, renderiza los componentes hijos, de lo contrario, redirige a la página de login
};

export default PrivateRoute;