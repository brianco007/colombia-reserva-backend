import businessInfoModel from "../models/businessInfoModel.js"
import generateTimeSlots from "../tools/generateTimeSlots.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import firebaseConfig from "../firebaseConfig.js";

import transporter from "../nodemailerTransporter.js"
import "dotenv/config";

const BASE_URL = process.env.BASE_URL


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
        from: 'briancormin@gmail.com', // Correo del remitente
        to: email, // Correo del destinatario
        subject: 'Página de reservas creada.',
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
