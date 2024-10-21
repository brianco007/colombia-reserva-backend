import signupModel from '../models/signupModel.js';
import bcrypt from 'bcrypt';

const signupController = {
  createNewUser: async (req, res) => {
    try {
      const { email, password, businessId } = req.body
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new signupModel({
        businessId,
        email,
        password: hashedPassword
      });

      const createdUser = await newUser.save();
      res.status(201).json({ message: "User created successfully", createdUser });
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Extract validation error messages
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
}

export default signupController