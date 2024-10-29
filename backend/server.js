const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configurar Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Configurar la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Endpoint para agregar un nuevo interno
app.post('/internos', upload.single('foto'), async (req, res) => {
  const { nombre, dni, fechaIngreso, prontuario, causa, situacionProcesal, fechaEgreso, registrarHuella } = req.body;
  const foto = req.file ? req.file.path.replace(/\\/g, '/') : null; // Asegurarte de que sea una ruta de URL válida

  console.log(req.body);

  try {
    const result = await pool.query(
      'INSERT INTO internos (nombre, dni, fecha_ingreso, prontuario, causa, situacion_procesal, foto, fecha_egreso, registrar_huella) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [nombre, dni, fechaIngreso, prontuario, causa, situacionProcesal, foto, fechaEgreso, registrarHuella]
    );
    res.status(201).json({ message: 'Interno agregado', result });
  } catch (error) {
    console.error('Error al agregar interno:', error);
    res.status(500).json({ error: 'Error al agregar interno' });
  }
});


app.get('/internos', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM internos');
      const internos = result.rows.map(interno => ({
          ...interno,
          foto: interno.foto.replace(/\\/g, '/') // Asegúrate de que la foto tenga la ruta correcta
      }));
      res.status(200).json(internos);
  } catch (error) {
      console.error('Error al obtener internos:', error);
      res.status(500).json({ error: 'Error al obtener internos' });
  }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
