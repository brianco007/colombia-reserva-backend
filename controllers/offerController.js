import offerModel from "../models/offerModel.js"


const offerController = {
  createOffer: async (req, res) => {
    try {
      const newOffer = new offerModel(req.body);     
      const createdOffer = await newOffer.save();
      res.status(201).json({ message: "Offer created successfully", createdOffer });
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Extract validation error messages
        const errorMessages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ message: "Validation failed", errors: errorMessages });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  },


  getAllOffers: async (req, res) => {
    try {
      const allOffers = await offerModel.find();
      res.status(200).json(allOffers);
    } catch (error) {
      res.json({
        message:
          "Error. Make sure your server is running and that the APIs url is typed correctly",
      });
    }
  },


  getOneOffer: async (req, res) => {
    try {
      const offer = await offerModel.findById(req.params.id);
      res.json(offer);
    } catch (error) {
      res.json({ message: "Error. Make sure the offer ID is correct" });
    }
  },


  updateOffer: async (req, res) => {
    try {
      const newInfo  = await offerModel.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.json({ message: "Offer info has been updated."});
    } catch (error) {
      res.json({
        message:
          "Error. Make sure the offer ID is correct and you include all the required fields.",
      });
    }
  },


  deleteOffer: async (req, res) => {
    try {
      const offerToBeDeleted = await offerModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Event has been removed." });
    } catch (error) {
      res.json({ message: "Error. Make sure the event ID is correct" });
    }
  },
};


export default offerController;
