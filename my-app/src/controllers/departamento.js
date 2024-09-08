const express = require('express');
const Dep = require('../models/departamentos');

const router = express.Router();

// Obtener todos los departamentos
router.get('/', async (req, res) => {
    try {
        const listDepartamentos = await Dep.getAll();
        res.json(listDepartamentos);
    } catch (error) {
        console.error('Error al obtener los departamentos:', error);
        res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
});

// Obtener un departamento por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const departamento = await Dep.find(id);
        if (!departamento) {
            return res.status(404).json({ error: 'Elemento no encontrado' });
        }
        res.json(departamento);
    } catch (error) {
        console.error('Error al obtener el elemento del menu:', error);
        res.status(500).json({ error: 'Error al obtener el elemento del menu' });
    }
});

// Crear un nuevo departamento
router.post('/create', async (req, res) => {
    try {
        const { nombre, descripcion, fecha_creacion } = req.body;
        await Dep.create(nombre, descripcion, fecha_creacion);
        res.status(201).json({ message: 'Departamento creado' });
    } catch (error) {
        console.error('Error al crear el departamento:', error);
        res.status(500).json({ error: 'Error al crear el departamento' });
    }
});

// Eliminar un departamento
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const foundItems = await Dep.find(id);

        if (foundItems) {
            const resp = await Dep.delete(id);
            if (resp) {
                res.status(200).json({ message: 'Departamento eliminado' });
            } else {
                res.status(404).json({ error: 'No se eliminaron elementos' });
            }
        } else {
            res.status(400).json({ error: 'Ningun elemento encontrado para los IDs proporcionados' });
        }
    } catch (error) {
        console.error('Error al eliminar el departamento:', error);
        res.status(500).json({ error: 'Error al eliminar el departamento' });
    }
});

// Editar un departamento
router.post('/edit', async (req, res) => {
    try {
        const { id, nombre, descripcion, fecha_creacion } = req.body;
        const existingItem = await Dep.find(id);

        if (existingItem) {
            const resp = await Dep.update(id, nombre, descripcion, fecha_creacion);
            if (resp > 0) {
                res.status(200).json({ message: 'Elemento de menu editado' });
            } else {
                res.status(404).json({ error: 'No se edito ningun elemento con ID: ' + resp });
            }
        } else {
            res.status(400).json({ error: 'El elemento a editar no existe' });
        }
    } catch (error) {
        console.error('Error al editar el departamento:', error);
        res.status(500).json({ error: 'Error al editar el departamento' });
    }
});

module.exports = router;