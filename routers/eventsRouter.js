import { Router } from "express";
import eventsController from "../controllers/eventsController.js";

const eventsRouter = Router();

eventsRouter.get('/', eventsController.getAllEvents);
eventsRouter.post('/', eventsController.createEvent);
eventsRouter.get('/:id', eventsController.getOneEvent);
eventsRouter.put('/:id', eventsController.updateEvent);
eventsRouter.delete('/:id', eventsController.deleteEvent);

export default eventsRouter;