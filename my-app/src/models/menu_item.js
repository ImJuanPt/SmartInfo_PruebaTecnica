const { pool } = require('../config/db');

const menu_item = {
    // Encontrar un elemento del menú por id
    async findOne(id) {
        const [rows] = await pool.execute('SELECT * FROM menu_items WHERE id = ?', [id]);
        return rows[0]; // Retorna el primer resultado encontrado
    },

    // Encontrar un elemento del menu que no tenga padre
    async findOneExplicitItem(id) {
        const [rows] = await pool.execute('SELECT * FROM menu_items WHERE id = ? AND parent_id IS NULL', [id]);
        return rows[0]; // Retorna el primer resultado encontrado
    },

    // Encontrar un elemento del menu por nombre
    async findOneByname(name) {
        const [rows] = await pool.execute('SELECT * FROM menu_items WHERE nombre = ?', [name]);
        return rows[0]; // Retorna el primer resultado encontrado
    },

    // Crear un nuevo elemento del menú
    async create(nombre, url, orden, selectedParentId) {
        const [rows] = await pool.execute(
            'INSERT INTO menu_items (nombre, url, parent_id, orden) VALUES (?, ?, ?, ?)', 
            [nombre, url, selectedParentId, orden]
        );
        return rows.insertId; // Retorna el ID del nuevo elemento creado
    },

    // Actualizar un elemento del menu
    async update(id, nombre, url, orden, selectedParentId) {
        const [result] = await pool.execute(
            'UPDATE menu_items SET nombre = ?, url = ?, parent_id = ?, orden = ? WHERE id = ?',
            [nombre, url, selectedParentId, orden, id]
        );
        return result.affectedRows; // Retorna el numero de filas afectadas
    },

    // Eliminar elementos del menu por ids
    async delete(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error('Se debe proporcionar un array de IDs valido.');
        }
    
        const placeholders = ids.map(() => '?').join(', '); // Crear placeholders para la consulta
        const query = `DELETE FROM menu_items WHERE ID IN (${placeholders})`;
    
        const [result] = await pool.execute(query, ids);
        return result.affectedRows; // Retorna el numero de filas afectadas
    },

    // Obtener todos los elementos del menu
    async getAll() {
        const [rows] = await pool.execute('SELECT * FROM menu_items ORDER BY orden');
        return rows; // Retorna todos los elementos ordenados
    },

    // Obtener elementos del menu por id de padre
    async getByParentId(parentId) {
        const [rows] = await pool.execute('SELECT * FROM menu_items WHERE parent_id = ? ORDER BY orden', [parentId]);
        return rows; // Retorna los elementos hijos ordenados
    },
};

module.exports = menu_item;