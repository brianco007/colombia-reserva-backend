import { Router } from "express";
import signupController from "../controllers/signupController.js"

const signupRouter = Router();

signupRouter.post('/', signupController.createNewUser);
signupRouter.get('/', signupController.getAllUsers);
signupRouter.get('/:id', signupController.getOneUser);
signupRouter.delete('/:id', signupController.deleteOneUser);
signupRouter.put('/:id/password', signupController.updatePassword);


export default signupRouter;