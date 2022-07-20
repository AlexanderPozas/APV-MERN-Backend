// Importar Express con ESM
import express from 'express';
// Importa dotenv
import {} from 'dotenv/config';
// Importar CORS policy
import cors from 'cors';
// Importa la conexion a la base de datos
import conectarDB from './config/db.js';
// Importar Routers
import VeterinarioRouter from './routes/VeterinarioRoutes.js';
import PacienteRouter from './routes/PacienteRouter.js';

// Configuracion del servidor
const app = express(); // aplicación de express

// Habilitar body parser para recibir datos 
app.use(express.json());

// console.log(process.env.MONGO_URI); // Muetra la uri a mongoDB como variable de entorno

// Invocar conexión a la base de datos
conectarDB();

// Configurar CORS
const dominiosPermitidos = [process.env.URL_FRONTEND];

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del request está permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}
app.use(cors(corsOptions));

// Router de prueba
// app.use("/", (req, res) => {
//     res.send('Hola Mundo');
// });

// Definir las rutas
app.use('/api/veterinarios', VeterinarioRouter);
app.use('/api/pacientes', PacienteRouter);

// Arrancar el servidor (port: 4000)
app.listen(4000, () => {
    console.log('Servidor funcionando en el puerto 4000');
});

