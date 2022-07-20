import Veterinario from "../models/Veterinario.js"; // importar modelo
import generarJWT from "../helpers/generarJWT.js"; // importa funcion para generar JWT
import generarToken from "../helpers/generarToken.js";
import emailConfirmar from "../helpers/emailConfirmar.js";
import emailReestablecerPassword from "../helpers/emailReestablecer.js";

const registrar = async (req, res) => {

    // Leer datos enviados con postman
    const { email, nombre } = req.body;

    // Prevenir registro de usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email }); // Object enhancenment
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message }); // retorna un error con un mensaje de error y un código 400 (Bad Syntax)
    }

    try {
        // Crear un nuevo registro
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar email de confirmacion de cuenta
        emailConfirmar({ email, nombre, token: veterinarioGuardado.token });

        // Respuesta con el objeto insertado en la bd
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

// Funcion confirmar cuenta vía token
const confirmar = async (req, res) => {
    // Leer parámetros vía url dinámica /:
    const { token } = req.params;

    // Buscar usuario en bd con token
    const usuario = await Veterinario.findOne({ token }); // object enhancenment
    if (!usuario) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    // Confirmar usuario
    try {
        usuario.token = null;
        usuario.confirmado = true;
        await usuario.save();
        res.json({ msg: 'Cuenta confirmada correctamente' });
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    // Extraer datos del form
    const { email, password } = req.body;

    // Verificar existencia del usuario
    const usuario = await Veterinario.findOne({ email }); // object enhancenment
    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    // Verificar que este el usuario esté confirmado
    if (!usuario.confirmado) {
        const error = new Error('El usuario no está confirmado');
        return res.status(403).json({ msg: error.message });
    }

    // Verificar password
    if (await usuario.comprobarPassword(password)) {
        // Autenticar al usuario y retornar todos sus datos
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error('La contraseña es incorrecta');
        return res.status(403).json({ msg: error.message });
    }
};

// Función olvidé password
const olvidePassword = async (req, res) => {
    const { email } = req.body;

    // Verificar que veterinario existe
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        const error = new Error('Usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Generar nuevo token
        usuario.token = generarToken();
        //Almacenarlo en la bd
        await usuario.save();

        // Enviar email
        emailReestablecerPassword({
            email,
            nombre: usuario.nombre,
            token: usuario.token
        });

        res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.log(error);
    }
}

// Funcion leer token nuevo
const comprobarToken = async (req, res) => {
    // Leer token de la url
    const { token } = req.params;

    // Verificar que existe token
    const existeToken = await Veterinario.findOne({ token });
    if (existeToken) {
        // Mostrar form para la contraseña nueva
        res.json({ msg: 'Token válido, existe usuario' });
    } else {
        // Mostrar token no valido
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }
};

// Funcion cambiar password
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Validar usuario
    const usuario = await Veterinario.findOne({ token });

    if (!usuario) {
        const error = new Error('Hubo un error en la petición');
        return res.status(400).json({ msg: error.message });
    }

    // Registrar contraseña nueva
    try {
        // Reset token
        usuario.token = null;
        usuario.password = password;
        // Registrar cambios
        await usuario.save();

        res.json({ msg: "Password modificado correctamente" });

    } catch (error) {
        console.log(error);
    }

};


const perfil = (req, res) => {
    // Extraer los datos de la sesion
    const { veterinario } = req;
    res.json(veterinario);
}

const actualizarPerfil = async (req, res) => {

    const { id } = req.params;
    const { email, nombre, web, telefono } = req.body;

    // Obtener usuario con id
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error('Hubo un error al realizar la petición');
        return res.status(400).json({ msg: error.message });
    }

    // Verificar que el usuario no modifique por un email existente diferente
    if (veterinario.email !== email) {
        const emailExiste = await Veterinario.findOne({ email });
        if (emailExiste) {
            const error = new Error('Email ya en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    // Acutalizar usuario
    try {
        // Editar propiedades
        veterinario.nombre = nombre;
        veterinario.email = email;
        veterinario.telefono = telefono;
        veterinario.web = web;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }

}

const actualizarPassword = async (req, res) => {
    // Leer datos request
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    // Verificar usuario
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error al realizar la petición');
        return res.status(400).json({ msg: error.message });
    }

    // Verificar password actual
    if (await veterinario.comprobarPassword(pwd_actual)) {
        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({ msg: 'Password actualizado correctamente' });
    } else {
        const error = new Error('El password actual es incorrecto');
        res.status(400).json({ msg: error.message });
    }
}


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};