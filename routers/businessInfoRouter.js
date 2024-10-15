import { Router } from "express";
import businessInfoController from "../controllers/businessInfoController.js";

const businessInfoRouter = Router();

businessInfoRouter.get('/', businessInfoController.getAllBusinesses);
businessInfoRouter.post('/', businessInfoController.createBusiness);
businessInfoRouter.get('/:id', businessInfoController.getOneBusiness);
businessInfoRouter.put('/:id', businessInfoController.updateBusiness);
businessInfoRouter.delete('/:id', businessInfoController.deleteBusiness);

export default businessInfoRouter;