import reviewsModel from "../models/reviewsModel.js"


const reviewsController = {
  createReview: async (req, res) => {
    try {
      const newReview = new reviewsModel(req.body);     
      const createdReview = await newReview.save();
      res.status(201).json({ message: "Review created successfully", createdReview });
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


  getAllReviews: async (req, res) => {
    try {
      const allReviews = await reviewsModel.find();
      res.status(200).json(allReviews);
    } catch (error) {
      res.json({
        message:
          "Error. Make sure your server is running and that the APIs url is typed correctly",
      });
    }
  },


  getOneReview: async (req, res) => {
    try {
      const review = await reviewsModel.findById(req.params.id);
      res.json(review);
    } catch (error) {
      res.json({ message: "Error. Make sure the review ID is correct" });
    }
  },


  updateReview: async (req, res) => {
    try {
      const newInfo  = await reviewsModel.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.json({ message: "Review info has been updated."});
    } catch (error) {
      res.json({
        message:
          "Error. Make sure the review ID is correct and you include all the required fields.",
      });
    }
  },


  deleteReview: async (req, res) => {
    try {
      const reviewToBeDeleted = await reviewsModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Event has been removed." });
    } catch (error) {
      res.json({ message: "Error. Make sure the event ID is correct" });
    }
  },
};


export default reviewsController;
