import { Router } from "express";
import employeesController from "../controllers/employeesController.js";
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })
const employeesRouter = Router();

employeesRouter.post('/', upload.single('picture'), employeesController.createEmployee);
employeesRouter.get('/', employeesController.getAllEmployees);
employeesRouter.get('/:id', employeesController.getOneEmployee);
employeesRouter.put('/:id', upload.single('picture'), employeesController.updateEmployee);
employeesRouter.delete('/:id', employeesController.deleteEmployee);

export default employeesRouter;