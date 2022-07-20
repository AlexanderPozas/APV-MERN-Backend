// Código para generar un JSON Web token

import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}

export default generarJWT;