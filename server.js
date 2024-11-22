// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración de las rutas
app.use('/api/users', userRoutes);

//Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Project Tracker');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log('Conectando a la base de datos con la URL:', process.env.DATABASE_URL);
});
