import { Router } from "express";
import eventsController from "../controllers/eventsController.js";
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

const eventsRouter = Router();

eventsRouter.get('/', eventsController.getAllEvents);
eventsRouter.post('/', upload.single('receipt'), eventsController.createEvent);
eventsRouter.get('/:id', eventsController.getOneEvent);
eventsRouter.put('/:id', eventsController.updateEvent);
eventsRouter.delete('/:id', eventsController.deleteEvent);

export default eventsRouter;