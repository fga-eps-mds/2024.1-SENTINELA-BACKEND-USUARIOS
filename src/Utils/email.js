const nodemailer = require("nodemailer");

const { EMAIL_USER, PASSWORD, HOST, MAIL_PORT } = process.env;

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
    host: HOST,
    port: MAIL_PORT,
    auth: {
        user: EMAIL_USER,
        pass: PASSWORD,
    },
    debug: true, // Ativa o modo de depuração
    logger: true, // Ativa o modo de registro
});

const sendEmail = async (destiny, subject, bodyEmail) => {
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to: destiny,
            subject: subject,
            html: bodyEmail,
        });

        return 1;
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return 0;
    }
};

module.exports = {
    sendEmail,
};
