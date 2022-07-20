import nodemailer from 'nodemailer';

const emailConfirmar = async (datos) => {
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
        subject: 'Confirma tu cuenta en APV',
        text: 'Confirma tu cuenta en APV',
        html: `
            <p>Hola ${nombre} has creado tu cuenta en APV.</p>
            <p>Para confirmarla haz click en el siguiente enlace:</p>
            <a href="${process.env.URL_FRONTEND}/confirmar/${token}" style="margin: 1rem 0; padding: 1rem 2rem; background-color: rgb(55, 48, 163); color: white;">Confirmar Cuenta</a>
            <p>Si no solicitaste esta cuenta, puede ignorar el mensaje.</p>
        `
    });

    console.log('Mensaje enviado: %s', info.messageId);
};

export default emailConfirmar;