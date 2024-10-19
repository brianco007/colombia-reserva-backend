import { Router } from "express";
import businessInfoController from "../controllers/businessInfoController.js";
import multer from "multer"
const upload = multer({ storage: multer.memoryStorage() })

const businessInfoRouter = Router();

businessInfoRouter.get('/', businessInfoController.getAllBusinesses);
businessInfoRouter.post('/', businessInfoController.createBusiness);
businessInfoRouter.get('/:id', businessInfoController.getOneBusiness);
businessInfoRouter.put('/:id', upload.single("banner"), businessInfoController.updateBusiness);
businessInfoRouter.delete('/:id', businessInfoController.deleteBusiness);

export default businessInfoRouter;