import { Schema, model } from "mongoose";


const adsModel = new Schema({
  adPicture: {type: String, required: [true, "The ad picture is required."]}, 
  activate: {type: Boolean, required: [true, "Must set the activate property to true or false"]}, 
  businessId: {type: String, required: [true, "The businessId is required."]}
},
{versionKey:false , timestamps: false}
);



export default model('BusinessAds', adsModel);