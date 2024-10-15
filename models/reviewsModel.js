import { Schema, model } from "mongoose";


const reviewsModel = new Schema({
  businessId: {type: String, required: [true, "The business ID is required."]}, 
  comment: {type: String, required: [true, "The comment is required."]}, 
  stars: {type: Number, required: [true, "The number of stars is required."]}, 
},
{versionKey:false , timestamps: true}
);



export default model('BusinessReview', reviewsModel);