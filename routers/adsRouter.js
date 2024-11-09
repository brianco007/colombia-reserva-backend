import { Router } from "express";
import adsController from "../controllers/adsController.js";
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })
const adsRouter = Router();

adsRouter.post('/', upload.single('adPicture'), adsController.createAd);
adsRouter.get('/', adsController.getAllAds);
adsRouter.get('/:id', adsController.getOneAd);
adsRouter.put('/:id', upload.single('adPicture'), adsController.updateAd);
adsRouter.delete('/:id', adsController.deleteAd);

export default adsRouter;