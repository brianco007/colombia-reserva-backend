import eventsModel from "../models/eventsModel.js"
import businessInfoModel from "../models/businessInfoModel.js"
import transporter from "../nodemailerTransporter.js"
import "dotenv/config";


import confirmationNumberGenerator from "../tools/confirmationNumberGenerator.js";


const BASE_URL = process.env.BASE_URL


const eventsModelController = {
  createEvent: async (req, res) => {
    try {

      const newEvent = new eventsModel(req.body);
      newEvent.confirmationNumber = confirmationNumberGenerator()     
      const createdEvent = await newEvent.save();
      res.status(201).json({ message: "Event created successfully", createdEvent });

      const { businessName, email } = await businessInfoModel.findById(newEvent.businessId);

      // Configurar los detalles del correo electrónico
      const emailForClient = {
        from: 'briancormin@gmail.com', // Correo del remitente
        to: newEvent.email, // Correo del destinatario
        subject: 'Confirmación de Reserva',
        html: `
          <div style="margin: 0; padding: 0; box-sizing: border-box;">
            <h1 style="text-align: center">¡Hola, ${newEvent.title.split(" ")[0].trim()}!</h1>
            <div style="margin-top: 50px; font-size: 18px"; display: flex; flex-direction: column; align-items: center; justify-content: center;>
              <h2>Gracias por confiar en ${businessName}.</h2>
              <p>Aquí abajo te dejamos la información de tu reserva</p>
              <p><span style:"font-weight: 500;">Fecha:</span>  ${newEvent.start.split("T")[0]}</p>
              <p><span style:"font-weight: 500;">Hora:</span>  ${(newEvent.start.split("T")[1]).slice(0, 5)}</p>
              <p><span style:"font-weight: 500;">N° de confirmación:</span>  ${newEvent.confirmationNumber}</p>
              <a href="${BASE_URL}/cancel/${newEvent._id}" style="text-decoration: none; padding: 5px 10px; background-color: rgb(203, 213, 225); color: #000; border-radius: 10px;">Cancelar Reserva</a>
            </div>
          </div>
        `,
      };

      const emailForBusiness = {
        from: 'briancormin@gmail.com', // Correo del remitente
        to: email, // Correo del destinatario
        subject: 'Tienes una nueva reserva',
        html: `
          <div style="margin: 0; padding: 0; box-sizing: border-box;">
            <h1 style="text-align: center">¡Hola, ${businessName}!</h1>
            <div style="margin-top: 50px; font-size: 18px"; display: flex; flex-direction: column; align-items: center; justify-content: center;>
              <h4>Aquí abajo te dejamos la información de tu reserva</h4>

              <p><span style:"font-weight: 500;">Datos del cliente:</span>  ${newEvent.title}</p>
              <p><span style:"font-weight: 500;">Fecha:</span>  ${newEvent.start.split("T")[0]}</p>
              <p><span style:"font-weight: 500;">Hora:</span>  ${newEvent.start.split("T")[1]}</p>


              <a href="${BASE_URL}/fullcalendar/${newEvent.businessId}" style="text-decoration: none; padding: 5px 10px; background-color: rgb(17, 24, 39); color: #fff; border-radius: 10px;">Ver todas las reservas</a>
            </div>
          </div>
        `,
      };

      // Enviar el correo
      transporter.sendMail(emailForClient, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ message: 'Error al enviar el correo de confirmación.' });
        }
        console.log('Correo enviado:', info.response);
        res.status(201).json({ message: 'Usuario creado. Se ha enviado un correo de confirmación.' });
      });

      transporter.sendMail(emailForBusiness, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ message: 'Error al enviar el correo de confirmación.' });
        }
        console.log('Correo enviado:', info.response);
        res.status(201).json({ message: 'Usuario creado. Se ha enviado un correo de confirmación.' });
      });

      

    } catch (error) {
      if (error.name === 'ValidationError') {
        // Extract validation error messages
        const errorMessages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ message: "Validation failed", errors: errorMessages });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
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
      const newInfo  = await eventsModel.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.json({ message: "Event info has been updated."});
    } catch (error) {
      res.json({
        message:
          "Error. Make sure the event ID is correct and you include all the required fields.",
      });
    }
  },


  deleteEvent: async (req, res) => {
    try {
      const eventToBeDeleted = await eventsModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Event has been removed." });
    } catch (error) {
      res.json({ message: "Error. Make sure the event ID is correct" });
    }
  },
};


export default eventsModelController;
