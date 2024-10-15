import businessInfoModel from "../models/businessInfoModel.js"
import generateTimeSlots from "../tools/generateTimeSlots.js";
import multer from "multer"

import transporter from "../nodemailerTransporter.js"
import "dotenv/config";

const BASE_URL = process.env.BASE_URL

const businessInfoController = {


  createBusiness: async (req, res) => {
    try {
      const newBusiness = new businessInfoModel(req.body)

      const createdBusiness = await newBusiness.save();
      res.status(201).json({ message: 'Business created successfully', createdBusiness });

      const { _id, email, businessName } = createdBusiness

      const emailForBusiness = {
        from: 'briancormin@gmail.com', // Correo del remitente
        to: email, // Correo del destinatario
        subject: 'Enlace para tus clientes.',
        html: `
          <div style="margin: 0; padding: 0; box-sizing: border-box;">
            <h1 style="text-align: center">¡Hola, ${businessName}!</h1>
            <div style="margin-top: 50px; font-size: 18px"; display: flex; flex-direction: column; align-items: center; justify-content: center;>
              <h4>🥳 Ahora tus clientes están a solo unos clicks de agendar citas. 🥳</h4>

              <p><span style:"font-weight: 500;"> 👇 Este es el enlace para tus clientes. </p>
              
              <a href="${BASE_URL}/booking/${_id}" style="text-decoration: none; padding: 5px 10px; background-color: rgb(17, 24, 39); color: #fff; border-radius: 10px;"> RESERVAR </a>

              <p><span style:"font-weight: 500;"> 👇 Este es el enlace para ti. </p>
              
              <a href="${BASE_URL}/dashboard/${_id}" style="text-decoration: none; padding: 5px 10px; background-color: rgb(17, 24, 39); color: #fff; border-radius: 10px;"> VER MIS RESERVAS </a>
            </div>
          </div>
        `,
      };

      transporter.sendMail(emailForBusiness, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ message: 'Error al enviar el correo de confirmación.' });
        }
        console.log('Correo enviado:', info.response);
        res.status(201).json({ message: 'Usuario creado. Se ha enviado un correo de confirmación.' });
      });
      
    } catch (err) {
      res.status(500).json({
        message: 'Ocurrió un error al crear el negocio.',
        error: err.message,
      });
    }
  },


  getAllBusinesses: async (req, res) => {
    try {
      const allBusinesses = await businessInfoModel.find();
      res.status(200).json(allBusinesses);
    } catch (error) {
      res.json({
        message:
          "Error. Make sure your server is running and that the APIs url is typed correctly",
      });
    }
  },


  getOneBusiness: async (req, res) => {
    try {
      const business = await businessInfoModel.findById(req.params.id);
      res.json(business);
    } catch (error) {
      res.json({ message: "Error. Make sure the business ID is correct" });
    }
  },


  updateBusiness: async (req, res) => {
    try {

      // If user wants to update only general info
      if(typeof(req.body.banner) === "string"){
        let newInfo = req.body
        newInfo.timeSlots = generateTimeSlots(newInfo.schedule, newInfo.sessionTime)
        newInfo = await businessInfoModel.findByIdAndUpdate(req.params.id, req.body)
        res.json({ message: "Review info has been updated."});

      } else {    // if user wants to update picture

        // Multer storage configuration
        const myStorage = multer.diskStorage({
          destination: "businessBanners",
          filename: (req, file, cb) => {
            cb(null, file.originalname); 
          },
        });
    
        const upload = multer({ storage: myStorage }).single('banner');
    
        // Handle the file upload
        upload(req, res, async (error) => {
          if (error) {
            return res.json({
              mensaje: 'Ocurrió un error al subir la imagen.',
              datos: null,
            });
          }
    
          // Check if the file was uploaded
          if (!req.file) {
            return res.status(400).json({
              message: 'No image uploaded',
            });
          }
          
          
          // Continue with the business update after the file is uploaded
          let newInfo = {
            ...req.body,
            schedule: JSON.parse(req.body.schedule),
            sessionTime: JSON.parse(req.body.sessionTime),
            banner: req.file.filename,
          };
          newInfo.timeSlots = generateTimeSlots(newInfo.schedule, newInfo.sessionTime)
  
          try {
            const updatedInfo = await businessInfoModel.findByIdAndUpdate(
              req.params.id,
              newInfo,
              { new: true } // This returns the updated document
            );
            if (!updatedInfo) {
              return res.status(404).json({ message: "Business not found" });
            }
            res.json({ message: "Business info has been updated.", data: updatedInfo });
          } catch (error) {
            res.status(500).json({
              message: "Error updating business information",
            });
          }
        });
      }
      
    } catch (error) {
      res.status(500).json({
        message:
          "Error. Make sure the business ID is correct and you include all the required fields.",
      });
    }
  },


  deleteBusiness: async (req, res) => {
    try {
      const businessToBeDeleted = await businessInfoModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Business has been removed." });
    } catch (error) {
      res.json({ message: "Error. Make sure the business ID is correct" });
    }
  },
};


export default businessInfoController;
