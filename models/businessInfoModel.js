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

  sessionTime: {type: String, trim: true},

  timeSlots: {type: [{day: String, timeSlots: [{value: String, display: String, _id: false}]}], _id: false},

  banner: {type: String, trim: true },

  businessName: {type: String, trim: true },
  address: {type: String, trim: true },
  phone: {type: String, trim: true },
  email: {type: String, trim: true },
  aboutUs: {type: String, trim: true },
  instagram: {type: String, trim: true },
  facebook: {type: String, trim: true },
  tiktok: {type: String, trim: true },
  youtube: {type: String, trim: true },
  linkedIn: {type: String, trim: true },
  needsReceipts: Boolean,
  receiptInfo: {type: String, trim: true },
  bankAccounts: [{bank: String, number: String}],
  type: {type: String},
},
{versionKey:false , timestamps: false}
);



export default model('BusinessInfo', businessInfoModel);