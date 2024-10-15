import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";

const reviewsRouter = Router();

reviewsRouter.get('/', reviewsController.getAllReviews);
reviewsRouter.post('/', reviewsController.createReview);
reviewsRouter.get('/:id', reviewsController.getOneReview);
reviewsRouter.put('/:id', reviewsController.updateReview);
reviewsRouter.delete('/:id', reviewsController.deleteReview);

export default reviewsRouter;