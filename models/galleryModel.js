import { Schema, model } from "mongoose";


const galleryModel = new Schema({
  pics: {type: [String], required: [true, "At least one picture must be uploaded."]},
  businessId: {type: String, required: [true, "The business Id is required."]},
},
{versionKey:false , timestamps: false}
);



export default model('FirebaseGallerie', galleryModel);