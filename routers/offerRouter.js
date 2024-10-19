import { Router } from "express";
import offerController from "../controllers/offerController.js";

const offerRouter = Router();

offerRouter.post('/', offerController.createOffer);
offerRouter.get('/', offerController.getAllOffers);
offerRouter.get('/:id', offerController.getOneOffer);
offerRouter.put('/:id', offerController.updateOffer);
offerRouter.delete('/:id', offerController.deleteOffer);

export default offerRouter;