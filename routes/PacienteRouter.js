import express from 'express';
import * as PacienteController from '../controllers/PacienteController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(checkAuth, PacienteController.agregarPaciente)
    .get(checkAuth, PacienteController.obtenerPacientes);

router.route('/:id')
    .get(checkAuth, PacienteController.obtenerPaciente)
    .put(checkAuth, PacienteController.actualizarPaciente) // patch funciona de manera similar
    .delete(checkAuth, PacienteController.eliminarPaciente);

export default router;