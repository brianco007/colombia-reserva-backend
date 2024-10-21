import { Router } from "express";
import loginController from '../controllers/loginController.js'

const loginRouter = Router();

loginRouter.post('/', loginController.userLogin);


export default loginRouter;