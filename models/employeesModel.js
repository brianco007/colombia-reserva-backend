import { Schema, model } from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const scheduleModel = new Schema({
  day: {type: String, required: true},
  openTime: {type: String, required: [true, "Debe incluir la hora de apertura."]},
  closeTime: {type: String, required: [true, "Debe incluir la hora de cierre."]},
  breakStart: {type: String},
  breakFinish: {type: String},
}, {_id: false})

const employeesModel = new Schema({
  businessId: {type: String, required: [true, "The businessId is required."]},
  picture: {type: String, required: [true, "The employee picture is required."]}, 
  fullName: {type: String, required: [true, "The employee's name is required."]}, 
  services: {type: [String], required: [true, "The employee's services are required."]},
  schedule: {type: [scheduleModel], _id: false, required: [true, "Debe subir el horario de al menos un día."]},
  timeSlots: {type: [{day: String, timeSlots: [{value: String, display: String, _id: false}]}], _id: false},
  sessionTime: {type: String},
  phone: {type: String, trim: true, required: [true, "The employee's phone number is required."]},
  email: { 
    type: String, 
    required: [true, "The employee's email is required."],
    trim: true,
    validate: {
      validator: function(value){
        return emailRegex.test(value)
      },
      message: "Email is not valid"
    }

  },
  active: {type: Boolean, required: [true, "The employee's status (active) is required."]}
},
{versionKey:false , timestamps: false}
);



export default model('BusinessEmployees', employeesModel);