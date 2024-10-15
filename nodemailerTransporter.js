import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar esto según tu proveedor de correo
  auth: {
    user: 'briancormin@gmail.com', // Tu correo
    pass: 'fdfeyevwgmvfwssd', // Contraseña o App Password si usas Gmail con 2FA
  },
});

export default transporter;