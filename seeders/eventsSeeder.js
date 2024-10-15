import eventsModel from "../models/eventsModel.js";
import connectDB from "../src/config.js";  
import mongoose from "mongoose";

async function seedDataBase() {
  const data = [
    {
      businessId: "1", 
      title: "Felipe Mingán - 301245789", 
      email: "felipe@gmail.com", 
      start: "2024-09-28T08:00:00", 
      end: "2024-09-21T09:00:00"
    },
    {
      businessId: "2", 
      title: "Alba Mingán - 301245789", 
      email: "felipe@gmail.com", 
      start: "2024-09-28T09:00:00", 
      end: "2024-09-21T10:00:00"
    },
  ];

  try {
    // Conectarse a BD
    await connectDB();

    // Inserta los datos 
    await eventsModel.insertMany(data);
    console.log("Seeders de Eventos: OK");
  } catch (error) {
    console.log("Seeders de Eventos: FAILED: ", error);
  } finally {
    // Cierra la conexión correctamente
    mongoose.connection.close();
    process.exit();  // Asegura que el proceso finalice
  }
}

seedDataBase();
