import mongoose from "mongoose";
import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    // Crear nuevo paciente
    const paciente = new Paciente(req.body);
    try {
        // Asignar veterinario a paciente
        paciente.veterinario = req.veterinario._id;
        // Registrar paciente en la bd
        const pacienteAlmacenado = await paciente.save();

        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    // Listar pacientes
    const pacientes = await Paciente.find()
        .where("veterinario")
        .equals(req.veterinario);
    res.json(pacientes);
}

// funcion para obtener un paciente en especifico
const obtenerPaciente = async (req, res) => {
    const { id } = req.params;

    // Obtener el paciente
    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(404).json({ msg: 'No encontrado' });
    }
    // Verificar que el proyecto sea del usuario que inicio sesion, se debe convertir a string el objectID
    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Acción inválida' });
    }
    res.json(paciente);
};

// Funcion para actualizar paciente
const actualizarPaciente = async (req, res) => {
    const { id } = req.params;

    // Verifica si el id es un objectID BJSON válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(403).json({ msg: error.message });
    }

    // Obtener el paciente
    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(404).json({ msg: 'No encontrado' });
    }
    // Verificar que el proyecto sea del usuario que inicio sesion, se debe convertir a string el objectID
    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Acción inválida' });
    }

    // Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
};

// funcion para eliminar un paciente
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    // Verifica si el id es un objectID BJSON válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(403).json({ msg: error.message });
    }

    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    // Verificar que el paciente pertenece al veterinario que inicio sesion
    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
        return res.status(400).json({ msg: 'Acción inválida' });
    }

    // Eliminar Paciente
    try {
        await paciente.deleteOne();
        res.json({ msg: 'Paciente eliminado correctamente' });
    } catch (error) {
        console.log(error);
    }
};

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};