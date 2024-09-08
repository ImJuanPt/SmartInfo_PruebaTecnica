const express = require('express');
const Menu = require('../models/menu_item');

const router = express.Router();

// Obtener todos los elementos del menú
router.get('/', async (req, res) => {
    try {
        const menuItems = await Menu.getAll();
        res.json(menuItems);
    } catch (error) {
        console.error('Error al obtener el menu:', error);
        res.status(500).json({ error: 'Error al obtener el menu' });
    }
});

// Obtener un elemento del menú por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const menuItem = await Menu.findOne(id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Elemento no encontrado' });
        }
        res.json(menuItem);
    } catch (error) {
        console.error('Error al obtener el elemento del menu:', error);
        res.status(500).json({ error: 'Error al obtener el elemento del menu' });
    }
});

// Verificar un elemento valido por ID
router.get('/itemvalid/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const itemValid = await Menu.findOneExplicitItem(id);

        if (!itemValid) {
            return res.status(404).json({ error: 'Elemento con padre' });
        }

        const menuItems = await Menu.getAll();
        res.json(menuItems);
    } catch (error) {
        console.error('Error al obtener el elemento del menu:', error);
        res.status(500).json({ error: 'Error al obtener el elemento del menu', id });
    }
});

// Crear un nuevo elemento del menú
router.post('/create', async (req, res) => {
    try {
        const { nombre, url, orden, selectedParentId } = req.body;

        if (!nombre || !url || !orden) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const parentId = selectedParentId === "" ? null : selectedParentId;
        const existingItem = await Menu.findOneByname(nombre);

        if (existingItem) {
            return res.status(400).json({ error: 'El elemento ya existe en el menu' });
        }

        const ordenValue = parseInt(orden, 10);
        if (isNaN(ordenValue)) {
            return res.status(400).json({ error: 'El campo orden debe ser un numero' });
        }

        await Menu.create(nombre, url, ordenValue, parentId);
        res.status(201).json({ message: 'Elemento de menu creado' });
    } catch (error) {
        console.error('Error al crear el elemento de menu:', error);
        res.status(500).json({ error: 'Error al crear el elemento de menu' });
    }
});

// Eliminar elementos del menú
router.delete('/delete', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.some(id => id === undefined || id === null)) {
            return res.status(400).json({ error: 'IDs no validos' });
        }

        const existingItems = await Promise.all(ids.map(id => Menu.findOne(id)));
        const foundItems = existingItems.filter(item => item !== null);

        if (foundItems.length > 0) {
            const resp = await Menu.delete(ids);
            if (resp > 0) {
                res.status(200).json({ message: 'Elementos de menu eliminados' });
            } else {
                res.status(404).json({ error: 'No se eliminaron elementos' });
            }
        } else {
            res.status(400).json({ error: 'Ningun elemento encontrado para los IDs proporcionados' });
        }
    } catch (error) {
        console.error('Error al eliminar el elemento de menu:', error);
        res.status(500).json({ error: 'Error al eliminar el elemento de menu' });
    }
});

// Editar un elemento del menú
router.post('/edit', async (req, res) => {
    try {
        const { id, nombre, url, orden, selectedParentId } = req.body;
        const existingItem = await Menu.findOne(id);

        if (existingItem) {
            const resp = await Menu.update(id, nombre, url, orden, selectedParentId);
            if (resp > 0) {
                res.status(200).json({ message: 'Elemento de menu editado' });
            } else {
                res.status(404).json({ error: 'No se edito ningun elemento con ID: ' + resp });
            }
        } else {
            res.status(400).json({ error: 'El elemento a editar no existe' });
        }
    } catch (error) {
        console.error('Error al editar el elemento de menu:', error);
        res.status(500).json({ error: 'Error al editar el elemento de menu' });
    }
});

module.exports = router;