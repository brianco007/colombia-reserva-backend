import nodemailer from "nodemailer"
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar esto según tu proveedor de correo
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.NODEMAILER_USER, 
    pass: process.env.NODEMAILER_PASS, // Contraseña o App Password si usas Gmail con 2FA
  },
});

export default transporter;