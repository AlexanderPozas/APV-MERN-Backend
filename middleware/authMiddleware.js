import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    // console.log(req.headers); // Se pasa el token en el header del request (bearer token)
    // Verificar JWT
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Verificar token
            token = req.headers.authorization.split(' ')[1]; // Eliminar Bearer del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica el token

            // Buscar usuario con informacion del token y crear una sesión
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado'); // No consulta el password, token y confirmado

            return next(); // Salta al siguiente middleware        
        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json({ msg: e.message });
        }
    }
    
    // En caso que no haya un token
    if(!token) {
        const error = new Error('Token no válido o inexistente');
        return res.status(403).json({ msg: error.message });
    }
}

export default checkAuth;