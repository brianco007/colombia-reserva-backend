import { Schema, model } from "mongoose";

const scheduleModel = new Schema({
  day: {type: String, required: true},
  openTime: {type: String, required: [true, "Debe incluir la hora de apertura."]},
  closeTime: {type: String, required: [true, "Debe incluir la hora de cierre."]},
  breakStart: {type: String},
  breakFinish: {type: String},
}, {_id: false})

const businessInfoModel = new Schema({
  schedule: {type: [scheduleModel], _id: false, required: [true, "Debe subir el horario de al menos un día."]},

  sessionTime: {type: String},

  timeSlots: {type: [{day: String, timeSlots: [{value: String, display: String, _id: false}]}], _id: false},

  banner: {type: String },

  businessName: {type: String },
  address: {type: String },
  phone: {type: String },
  email: {type: String },
  aboutUs: {type: String },
  instagram: String,
  facebook: String,
  tiktok: String,
  youtube: String,
  linkedIn: String,
  needsReceipts: Boolean,
  bankAccounts: [{bank: String, number: String}]
},
{versionKey:false , timestamps: false}
);



export default model('BusinessInfo', businessInfoModel);