import { Schema, model } from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const loginModel = new Schema(
  {
    email: { 
      type: String, 
      required: [true, "The email is required."],
      trim: true,
      validate: {
        validator: function(value){
          return emailRegex.test(value)
        },
        message: "Email is not valid"
      }

    },

    password: { 
      type: String, 
      required: [true, "Password is required"],
      trim: true,
    },

    businessId: {
      type: String, 
      required: [true, "Business ID is required"],
    }
  },
  { versionKey: false, timestamps: true }
);

export default model("BusinessSignup", loginModel);