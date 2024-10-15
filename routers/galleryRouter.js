import { Router } from "express";
import galleryController from "../controllers/galleryController.js";
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })


const galleryRouter = Router();

galleryRouter.post('/', upload.array("banners", 5), galleryController.uploadNewGallery);
galleryRouter.get('/',  galleryController.getAllGalleries);
galleryRouter.get('/:id',  galleryController.getOneGallery);
galleryRouter.delete('/:id',  galleryController.deleteGallery);



export default galleryRouter;