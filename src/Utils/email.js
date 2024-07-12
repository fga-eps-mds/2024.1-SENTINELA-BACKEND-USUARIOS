const nodemailer = require('nodemailer');

const {
    EMAIL_USER,
    EMAIL,
    PASSWORD
} = process.env;

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: EMAIL_USER,
        pass: PASSWORD
    },
    debug: true, // Ativa o modo de depuração
    logger: true // Ativa o modo de registro
});

const sendEmail = async (destiny, subject, bodyEmail) => {

    try {
        const info = await transporter.sendMail({
            from: EMAIL,
            to: destiny,
            subject: subject,
            html: bodyEmail
        });
        return 1
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return 0;
    }
        
};

module.exports = {
    sendEmail
}