import { Router } from "express";
import signupController from "../controllers/signupController.js"

const signupRputer = Router();

signupRputer.post('/', signupController.createNewUser);
signupRputer.get('/', signupController.getAllUsers);
signupRputer.get('/:id', signupController.getOneUser);
signupRputer.delete('/:id', signupController.deleteOneUser);

export default signupRputer;