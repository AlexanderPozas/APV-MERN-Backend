import nodemailer from 'nodemailer';

const emailReestablecerPassword = async (datos) => {
    // Transporter
    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    // Configuracion del email
    const info = await transporter.sendMail({
        from: '"APV App" <apv@company.com>',
        to: email,
        subject: 'Reestablece tu password APV',
        text: 'Reestablece tu password APV',
        html: `
            <p>Hola ${nombre}.</p>
            <p>Para reestablecer tu password haz click en el siguiente enlace:</p>
            <a href="${process.env.URL_FRONTEND}/olvido-password/${token}" style="margin: 1rem 0; padding: 1rem 2rem; background-color: rgb(55, 48, 163); color: white;">Reestablecer Password</a>
            <p>Si no solicitaste este cambio, puede ignorar el mensaje.</p>
        `
    });

    console.log('Mensaje enviado: %s', info.messageId);
};

export default emailReestablecerPassword;