import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarToken from "../helpers/generarToken.js";

// Crear Modelo para MongoDB
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarToken()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// Middleware de MongoDB
veterinarioSchema.pre('save', async function(next) {
    // Utiliza this, hace referencia al objeto mismo, no arrow function
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Método del modelo
veterinarioSchema.methods.comprobarPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password); // true or false
};


// Especificar modelo en Mongo Atlas
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;