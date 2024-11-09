import adsModel from "../models/adsModel.js"
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import firebaseConfig from "../firebaseConfig.js";


//ininitialize a firebase app
initializeApp(firebaseConfig)
// initialize Firebase Cloud Storage
const storage = getStorage()

const adsController = {
  createAd: async (req, res) => {
    try {
      const { businessId } = req.body

      // Firebase upload
      const storageRef = ref(storage, `businessAds/${businessId}-${req.file.originalname}`)
      const metadata = {
        contentType: req.file.mimetype
      }
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      const downloadURL = await getDownloadURL(snapshot.ref)
      


      let newAd = new adsModel(req.body);  
      newAd.adPicture = downloadURL   
      const createdAd = await newAd.save();
      res.status(201).json({ message: "Ad created successfully", createdAd });
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


  getAllAds: async (req, res) => {
    try {
      const allAds = await adsModel.find();
      res.status(200).json(allAds);
    } catch (error) {
      res.json({
        message:
          "Error. Make sure your server is running and that the APIs url is typed correctly",
      });
    }
  },


  getOneAd: async (req, res) => {
    try {
      const ad = await adsModel.findById(req.params.id);
      res.json(ad);
    } catch (error) {
      res.json({ message: "Error. Make sure the ad ID is correct" });
    }
  },


  updateAd: async (req, res) => {
    try {
      // delete previous pic from Firebase
      const previousPic = await adsModel.findById(req.params.id)
      console.log(previousPic) 
      if(previousPic){
        const url = previousPic.adPicture
        const picToBeDeletedFromFirebase = ref(storage, url)
        deleteObject(picToBeDeletedFromFirebase)
      }

      // Firebase new picture upload
      const storageRef = ref(storage, `businessAds/${req.body.businessId}-${req.file.originalname}`)
      const metadata = {
        contentType: req.file.mimetype
      }
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Update in MongoDB
      let newInfo = req.body; 
      newInfo.adPicture = downloadURL 

      let updatedAd  = await adsModel.findByIdAndUpdate(
        req.params.id,
        newInfo
      );
      res.json({ message: "Offer info has been updated.", updatedAd});
    } catch (error) {
      res.json({
        message:
          "Error. Make sure the offer ID is correct and you include all the required fields.",
        errorMessage: error.message
      });
    }
  },


  deleteAd: async (req, res) => {
    try {
      // delete from Firebase
      const previousPic = await adsModel.findById(req.params.id)

      if(previousPic){
        const url = previousPic.adPicture
        const picToBeDeletedFromFirebase = ref(storage, url)
        deleteObject(picToBeDeletedFromFirebase)
      }

      // delete from MongoDB
      const adToBeDeleted = await adsModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Ad has been removed." });
    } catch (error) {
      res.json({ message: "Error. Make sure the ad ID is correct" });
    }
  },
};


export default adsController;
