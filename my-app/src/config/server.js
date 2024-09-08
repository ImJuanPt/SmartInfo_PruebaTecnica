const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('../controllers/auth');
const menuRoutes = require('../controllers/menu');
const departamentoRoutes = require('../controllers/departamento');
const personaRoutes = require('../controllers/persona');
const { validateConnection } = require('./db'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/menu/itemvalid', menuRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/personas', personaRoutes);
validateConnection();

app.listen(3001, () => {
    console.log('Servidor escuchando en el puerto 3001');
});