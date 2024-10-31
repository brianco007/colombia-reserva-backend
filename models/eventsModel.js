import { Schema, model } from "mongoose";


const eventsModel = new Schema({
  businessId: {type: String, required: [true, "The event ID is required."]}, 
  title: {type: String, required: [true, "The event title is required."]}, 
  email: {type: String, required: [true, "The email is required."]}, 
  start: {type: String, required: [true, "The event start is required."]}, 
  end: {type: String, required: [true, "The event end is required."]},
  confirmationNumber: {type: Number, required: [true, "The confirmation number is required."]},
  service: String
},
{versionKey:false , timestamps: false}
);



export default model('BusinessEvents', eventsModel);