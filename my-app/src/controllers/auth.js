const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { cedula, nombre, password } = req.body; // Extraer datos del cuerpo de la solicitud

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne(cedula);
        if (existingUser) {
            return res.status(400).json({ error: 'La cédula ya está registrada' });
        }

        // Hash de la contraseña antes de almacenar
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create(cedula, nombre, hashedPassword);

        res.status(201).json({ message: 'Usuario creado' }); // Respuesta de exito
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' }); // Manejo de errores
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    const { cedula, password } = req.body; // Extraer datos del cuerpo de la solicitud

    if (!cedula || !password) {
        return res.status(400).json({ error: 'Cédula y contraseña son requeridos' });
    }

    try {
        // Buscar el usuario por cédula
        const user = await User.findOne(cedula);
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la almacenada
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token JWT para el usuario
        const token = jwt.sign({ cedula: user.cedula }, 'tu_secreto');
        res.json({ token }); // Enviar el token al cliente
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error en el servidor' }); // Manejo de errores
    }
});

module.exports = router;