import signupModel from '../models/signupModel.js';
import bcrypt from 'bcrypt';

const signupController = {
  createNewUser: async (req, res) => {
    try {
      const { email, password, businessId } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new signupModel({
        businessId,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
  
      const createdUser = await newUser.save();
      res.status(201).json({ message: "User created successfully", createdUser });
    } catch (error) {
      if (error.code === 11000) { 
        // Código 11000 indica un error de duplicado en MongoDB
        res.status(400).json({ message: "The email is already registered." });
      } else if (error.name === 'ValidationError') {
        // Extraer mensajes de validación
        const errorMessages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ message: "Validation failed", errors: errorMessages });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const allUsers = await signupModel.find();
      res.status(200).json(allUsers);
    } catch (error) {
      res.json({
        message:
          "Error. Make sure your server is running and that the APIs url is typed correctly",
      });
    }
  },

  getOneUser: async (req, res) => {
    try {
      const user = await signupModel.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.json({ message: "Error. Make sure the user ID is correct" });
    }
  },

  deleteOneUser: async (req, res) => {
    try {
      const user = await signupModel.findByIdAndDelete(req.params.id);
      res.status(200).json({message: "User was deleted"});
    } catch (error) {
      res.json({ message: "Error. Make sure the user ID is correct" });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { id } = req.params; // ID del usuario desde los parámetros de la URL
      const { oldPassword, newPassword } = req.body; // Contraseña antigua y nueva desde el cuerpo de la solicitud
  
      // Validar que ambas contraseñas se hayan proporcionado
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required." });
      }
  
      if (newPassword.trim().length < 4) {
        return res.status(400).json({ message: "The new password must be at least 4 characters long." });
      }
  
      // Buscar al usuario por su ID
      const user = await signupModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Verificar que la contraseña antigua sea correcta
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "The old password is incorrect." });
      }
  
      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Actualizar la contraseña del usuario
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred.", error });
    }
  },
  
  
}

export default signupController