import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para almacenar la informacion del usuario

    // Efecto para cargar el token del localStorage al iniciar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token }); // Establecer el usuario si hay un token
        }
    }, []);

    // Funcion para iniciar sesión
    const login = (userData) => {
        setUser(userData); // Establecer el usuario en el estado
        localStorage.setItem('token', userData.token); // Guardar el token en localStorage
    };

    // Funcion para cerrar sesión
    const logout = () => {
        setUser(null); // Limpiar el estado del usuario
        localStorage.removeItem('token'); // Eliminar el token de localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children} 
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto de autenticacion
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider'); // Error si se usa fuera del proveedor
    }
    return context; // Retornar el contexto
};