const express = require('express');
const Persona = require('../models/personas'); 

const router = express.Router();

// Obtener todas las personas
router.get('/', async (req, res) => {
    try {
        const listPersonas = await Persona.getAll();
        res.json(listPersonas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

// Obtener personas por departamento
router.get('/departamento/:departamento_id', async (req, res) => {
    const { departamento_id } = req.params;
    try {
        const listPersonas = await Persona.getByDepartamento(departamento_id);
        res.json(listPersonas);
    } catch (error) {
        console.error('Error al obtener las personas por departamento:', error);
        res.status(500).json({ error: 'Error al obtener las personas por departamento' });
    }
});

// Obtener una persona por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const persona = await Persona.find(id);
        if (!persona) {
            return res.status(404).json({ error: 'Elemento no encontrado' });
        }
        res.json(persona);
    } catch (error) {
        console.error('Error al obtener la persona:', error);
        res.status(500).json({ error: 'Error al obtener la persona' });
    }
});

// Crear una nueva persona
router.post('/create', async (req, res) => {
    try {
        const { cedula, nombre, email, departamento_id } = req.body;
        await Persona.create(cedula, nombre, email, departamento_id);
        res.status(201).json({ message: 'Persona creada' });
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Eliminar una persona
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const foundItems = await Persona.find(id); 

        if (foundItems) {
            const resp = await Persona.delete(id);
            if (resp) {
                res.status(200).json({ message: 'Persona eliminada' });
            } else {
                res.status(404).json({ error: 'No se eliminaron elementos' });
            }
        } else {
            res.status(400).json({ error: 'Ningún elemento encontrado para los IDs proporcionados' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

// Editar una persona
router.post('/edit', async (req, res) => {
    try {
        const { cedula, nombre, email, departamento_id } = req.body; 
        const existingItem = await Persona.find(cedula); 

        if (existingItem) {
            const resp = await Persona.update(cedula, nombre, email, departamento_id); 
            if (resp > 0) {
                res.status(200).json({ message: 'Persona editada' });
            } else {
                res.status(404).json({ error: 'No se editó ningún elemento con cédula: ' + cedula });
            }
        } else {
            res.status(400).json({ error: 'El elemento a editar no existe' });
        }
    } catch (error) {
        console.error('Error al editar la persona:', error);
        res.status(500).json({ error: 'Error al editar la persona' });
    }
});

module.exports = router;