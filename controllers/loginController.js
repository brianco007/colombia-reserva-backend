import bcrypt from "bcrypt";
import signupModel from "../models/signupModel.js";
import employeesModel from "../models/employeesModel.js";
import { tokenGenerator } from "../tools/tokenGenerator.js";
import "dotenv/config";

const loginController = {
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userFound = await signupModel.findOne({ email }); //finds the user in Mongo DB

      //superadmin
      if (email === process.env.SUPERADMIN_EMAIL) {
        const isTheSame = await bcrypt.compare(password, userFound.password);
        if (isTheSame) {
          const token = await tokenGenerator({
            id: userFound._id,
            email: userFound.email,
            businessId: userFound.businessId,
            role: "superadmin",
          });
          res.json(token);
        } else {
          res.json({ message: "User or password is wrong." });
        }
      }
      // Other admins
      else {
        if (email) {
          // if the email exist in the database
          const employeeFound = await employeesModel.findOne({ email }); //finds if user is employee
          const isTheSame = await bcrypt.compare(password, userFound.password);

          if (isTheSame) {
            if (employeeFound) {
              const token = await tokenGenerator({
                id: employeeFound._id,
                email: employeeFound.email,
                businessId: employeeFound.businessId,
                role: "employee",
              });
              res.json(token);
            } else {
              const token = await tokenGenerator({
                id: userFound._id,
                email: userFound.email,
                businessId: userFound.businessId,
                role: "admin",
              });
              res.json(token);
            }
          } else {
            res.json({ message: "User or password is wrong." });
          }
        } else {
          res.json({ message: "User or password is wrong." });
        }
      }
    } catch (err) {
      res.json({ message: "An error ocurred", error: err.message });
    }
  },
};

export default loginController;
