import businessInfoModel from "../models/businessInfoModel.js"
import generateTimeSlots from "../tools/generateTimeSlots.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import firebaseConfig from "../firebaseConfig.js";

import transporter from "../nodemailerTransporter.js"
import "dotenv/config";

const BASE_URL = process.env.BASE_URL
const NODEMAILER_USER = process.env.NODEMAILER_USER

//ininitialize a firebase app
initializeApp(firebaseConfig)
// initialize Firebase Cloud Storage
const storage = getStorage()


const businessInfoController = {


  createBusiness: async (req, res) => {
    try {
      const newBusiness = new businessInfoModel(req.body)

      const createdBusiness = await newBusiness.save();

      const { _id, email, businessName } = createdBusiness

      const emailForBusiness = {
        from: NODEMAILER_USER, // Correo del remitente
        to: email, // Correo del destinatario
        subject: 'Página de reservas creada.',
        html: `
          <div style="margin: 0; padding: 0; box-sizing: border-box; display: flex; justify-content: center; align-items: center; flex-direction: column; font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; color: #0f172a; background-color: #f3f4f6; margin: 0 auto; height: 100vh; padding: 0 20px; ">
    <div style="background-color: #fff; max-width: 800px; border-radius: 10px; margin-top: 50px; padding: 50px 40px; box-shadow: 0px 0px 20px  rgba(0, 0, 0, .2);">
      <h4 style="text-align: center; font-size: 20px;">¡Felicidades ${businessName}!</h4>
      <div style="margin-top: 40px; font-size: 18px;">
        <h4 style="font-size: 70px; text-align: center;">🎉</h4>
        <h4 style="text-align: center;">Ahora tus clientes ya pueden agendar citas.</h4>
  
        <p style="font-weight: 500; margin-top: 20px;">  👇 Este es el enlace para tus clientes. </p>
        
        <a href="${BASE_URL}/booking/${_id}" style="text-decoration: none; padding: 5px 10px; background-color: #0f172a; color: #fff; border-radius: 10px; font-size: 15px; align-self: start;"> RESERVAR </a>
  
        <p style="font-weight: 500; margin-top: 20px;">  👇 Crea tu cuenta de administrador aquí. </p>
        
        <a href="${BASE_URL}/signup/${_id}" style="text-decoration: none; padding: 5px 10px; background-color: #0f172a; color: #fff; border-radius: 10px; font-size: 15px; align-self: start;"> CREAR ADMINISTRADOR </a>
      </div>
      <h1 style="text-align: center; font-style: italic; font-size: 25px; margin-top: 50px" >Colombia<span style="color: #0e7490;">Reserva</span></h1>
    </div>
  </div>
        `,
      };

      transporter.sendMail(emailForBusiness, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ message: 'Error al enviar el correo de confirmación.' });
        } else {

          console.log('Correo enviado:', info.response);
          res.status(201).json({ message: 'Business created successfully', createdBusiness });
        }

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
      res.setHeader('Content-Type', 'application/json');
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
      res.setHeader('Content-Type', 'application/json');
      res.json(business);
    } catch (error) {
      res.json({ message: "Error. Make sure the business ID is correct" });
    }
  },


  updateBusiness: async (req, res) => {

    const currentInfo = await businessInfoModel.findById(req.params.id)

    try {
      // CASE: 1 In case it is the first time creating a logo
      if(!currentInfo.banner){
        const storageRef = ref(storage, `businessLogos/${req.file.originalname}`)
        // Create file metadata
        const metadata = {
          contentType: req.file.mimetype
        }
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
        const downloadURL = await getDownloadURL(snapshot.ref)
        
        // Continue with the business update after the file is uploaded
        let newInfo = {
          ...req.body,
          schedule: JSON.parse(req.body.schedule),
          sessionTime: JSON.parse(req.body.sessionTime),
          banner: downloadURL,
        };
        newInfo.timeSlots = generateTimeSlots(newInfo.schedule, newInfo.sessionTime)
        const newBusinessInfo = await businessInfoModel.findByIdAndUpdate(req.params.id, newInfo)
        
        return res.json({
          message: "Logo and SessionTime were created correctly",
          downloadURL: downloadURL
        })
      } 

      // CASE 2: In case user wants to update ONLY general info
      else if(currentInfo.banner && !req.file){
        let newInfo = req.body
        newInfo.timeSlots = generateTimeSlots(newInfo.schedule, newInfo.sessionTime)
        await businessInfoModel.findByIdAndUpdate(req.params.id, newInfo)
        return res.json({
          message: "Business general info was updated correctly",
          newInfo
        })
      }

      // CASE: 3  user wants to update ONLY the logo
      else {

        // deleting old logo from firebase
        const url = currentInfo.banner
        const picToBeDeletedFromFirebase = ref(storage, url)
        deleteObject(picToBeDeletedFromFirebase)

        // creating a new logo in Firebase
        const storageRef = ref(storage, `businessLogos/${req.file.originalname}`)
        const metadata = {
          contentType: req.file.mimetype
        }
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
        const downloadURL = await getDownloadURL(snapshot.ref)

        let newInfo = {
          ...req.body,
          schedule: JSON.parse(req.body.schedule),
          sessionTime: JSON.parse(req.body.sessionTime),
          banner: downloadURL,
        };
        newInfo.timeSlots = generateTimeSlots(newInfo.schedule, newInfo.sessionTime)
        const newBusinessInfo = await businessInfoModel.findByIdAndUpdate(req.params.id, newInfo)
        
        return res.json({
          message: "Logo was updated correctly",
          downloadURL: downloadURL
        })
      }
      
    } catch (error) {
      res.status(500).json({
        message:
          "Error. Make sure the business ID is correct and you include all the required fields.",
          error: error.message
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
