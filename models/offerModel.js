import { Schema, model } from "mongoose";


const offerModel = new Schema({
  businessId: {type: String, required: [true, "The business ID is required."]}, 
  service: {type: String, required: [true, "The title is required."]}, 
  description: String, 
  price: Number, 
},
{versionKey:false , timestamps: true}
);



export default model('BusinessOffer', offerModel);