import { Schema, model } from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const signupModel = new Schema(
  {
    email: { 
      type: String, 
      required: [true, "The email is required."],
      trim: true,
      unique: true,
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
    },

    role: {
      type: String,
      enum: ["admin", "employee", "superadmin"], // Restricts the values to these options
      default: "admin", // Sets the default value
      required: [true, "Role is required"], // Ensures the field is required
    },
  },
  { versionKey: false, timestamps: true }
);

export default model("BusinessSignup", signupModel);