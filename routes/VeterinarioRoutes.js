import express from 'express';
import * as VeterinarioController from '../controllers/VeterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js'; // Middleware para comprobar JWT

// Definir el router para veterinarios
const router = express.Router();

router.post('/', VeterinarioController.registrar); // Crea un usuario
router.get('/confirmar/:token', VeterinarioController.confirmar); // Confirma cuenta vía token
router.post('/login', VeterinarioController.autenticar); // Autenticar usuario
router.post('/olvido-password', VeterinarioController.olvidePassword); // Recuperar contraseña
// router.get('/olvide-password/:token', VeterinarioController.comprobarToken); // Verificar nuevo token
// router.post('olvide-password/:token', VeterinarioController.nuevoPassword); // Cambiar contraseña
// Otra forma de codificar con chaining
router.route('/olvido-password/:token').get(VeterinarioController.comprobarToken).post(VeterinarioController.nuevoPassword);

// Rutas protegidas
router.get('/perfil', checkAuth, VeterinarioController.perfil);
router.put('/perfil/:id', checkAuth, VeterinarioController.actualizarPerfil);
router.put('/actualizar-password', checkAuth, VeterinarioController.actualizarPassword);



export default router;