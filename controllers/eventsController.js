import eventsModel from "../models/eventsModel.js";
import businessInfoModel from "../models/businessInfoModel.js";
import transporter from "../nodemailerTransporter.js";
import "dotenv/config";

import confirmationNumberGenerator from "../tools/confirmationNumberGenerator.js";

const BASE_URL = process.env.BASE_URL;
const NODEMAILER_USER = process.env.NODEMAILER_USER

const eventsModelController = {
  createEvent: async (req, res) => {
    try {
      const newEvent = new eventsModel(req.body);
      newEvent.confirmationNumber = confirmationNumberGenerator();
      const createdEvent = await newEvent.save();


      const { businessName, email, _id, banner } = await businessInfoModel.findById(
        newEvent.businessId
      );

      // Configurar los detalles del correo electrónico
      const emailForClient = {
        from: NODEMAILER_USER, // Correo del remitente
        to: newEvent.email, // Correo del destinatario
        subject: "Confirmación de Reserva",
        html: `
              <div style="margin: 0; padding: 0; box-sizing: border-box; display: flex; justify-content: center; align-items: center; flex-direction: column; font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; color: #0f172a; background-color: #f3f4f6; margin: 0 auto; height: 100vh; padding: 0 20px; ">
    <div style="background-color: #fff; max-width: 800px; border-radius: 10px; margin-top: 50px; padding: 50px 40px; box-shadow: 0px 0px 20px  rgba(0, 0, 0, .2);">
      <div style="display: flex; justify-content: center;">
        <img src="${banner}" alt="Business logo" style="width: 100px;">
      </div>
      <h2 style="text-align: center; margin-top: 20px; font-size: 15px;">${businessName}</h2>
      <h4 style="text-align: center; margin: 30px 0; color: #0e7490; font-size: 20px;">¡Hola, ${newEvent.title.split(" ")[0].trim()}!</h4>
      <div style="margin-top: 30px; font-size: 18px;">
        <p style="text-align: center;">Aquí abajo te dejamos la información de tu reserva</p>
        <p><span style="font-weight: 500; color: #0e7490;">Fecha:</span>  ${
          newEvent.start.split("T")[0]
        }</p>
        <p><span style="font-weight: 500; color: #0e7490;">Hora:</span>  ${newEvent.start
          .split("T")[1]
          .slice(0, 5)}</p>
        <p><span style="font-weight: 500; color: #0e7490;">N° de confirmación:</span>  ${
          newEvent.confirmationNumber
        }</p>
        <a href="${BASE_URL}/cancel/${
  newEvent._id
  }" style="text-decoration: none; padding: 5px 10px; background-color: #0f172a; color: #fff; border-radius: 10px; align-self: start;">Cancelar Reserva</a>
      </div>
    </div>
            `,
      };

      const emailForBusiness = {
        from: NODEMAILER_USER, // Correo del remitente
        to: email, // Correo del destinatario
        subject: "Tienes una nueva reserva",
        html: `
              <div style="margin: 0; padding: 0; box-sizing: border-box; display: flex; justify-content: center; align-items: center; flex-direction: column; font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; color: #0f172a; background-color: #f3f4f6; margin: 0 auto; height: 100vh; padding: 0 20px; ">
      <div style="background-color: #fff; max-width: 800px; border-radius: 10px; margin-top: 50px; padding: 50px 40px; box-shadow: 0px 0px 20px  rgba(0, 0, 0, .2);">
        <h5 style="text-align: center; font-style: italic;">Colombia<span style="color: #0e7490;">Reserva</span></h5>
        <h3 style="text-align: center">${businessName}</h3>
        <div style="margin-top: 30px; font-size: 18px"; display: flex; flex-direction: column; align-items: center; justify-content: center;>
          <h4 style="font-size: 20px; text-align: center;">Aquí abajo te dejamos la información de tu reserva</h4>

          <div style="margin-top: 30px;">

            <p><span style="color: #0e7490;">Datos del cliente:</span>  ${
              newEvent.title
            }</p>
            <p><span style="color: #0e7490;">Fecha:</span>  ${
              newEvent.start.split("T")[0]
            }</p>
            <p><span style="color: #0e7490;">Hora:</span>  ${
              newEvent.start.split("T")[1]
            }</p>
          </div>
          <a href="${BASE_URL}/dashboard/${_id}" style="text-decoration: none; padding: 5px 10px; background-color: rgb(17, 24, 39); color: #fff; border-radius: 10px;">Ir al dashboard</a>
        </div>
      </div>
    </div>
            `,
      };


      // Use Promise.all to handle both email sending
      await Promise.all([
        transporter.sendMail(emailForClient),
        transporter.sendMail(emailForBusiness),
      ]);

      // Send the success response only once after emails are sent
      res
        .status(201)
        .json({ message: "Event created successfully", createdEvent });
    } catch (error) {
      if (error.name === "ValidationError") {
        // Extract validation error messages
        const errorMessages = Object.values(error.errors).map(
          (err) => err.message
        );
        res
          .status(400)
          .json({ message: "Validation failed", errors: errorMessages });
      } else {
        res.status(500).json({ message: "An unexpected error occurred", error: error.message }); // Include error messag
      }
    }
  },

  getAllEvents: async (req, res) => {
    try {
      const allEvents = await eventsModel.find();
      res.status(200).json(allEvents);
    } catch (error) {
      res.json({
        message:
          "Error. Make sure your server is running and that the APIs url is typed correctly",
      });
    }
  },

  getOneEvent: async (req, res) => {
    try {
      const event = await eventsModel.findById(req.params.id);
      res.json(event);
    } catch (error) {
      res.json({ message: "Error. Make sure the event ID is correct" });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const newInfo = await eventsModel.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.json({ message: "Event info has been updated." });
    } catch (error) {
      res.json({
        message:
          "Error. Make sure the event ID is correct and you include all the required fields.",
      });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const eventToBeDeleted = await eventsModel.findByIdAndDelete(
        req.params.id
      );
      res.json({ message: "Event has been removed." });
    } catch (error) {
      res.json({ message: "Error. Make sure the event ID is correct" });
    }
  },
};

export default eventsModelController;
