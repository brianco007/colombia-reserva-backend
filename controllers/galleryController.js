import galleryModel from "../models/galleryModel.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref,getDownloadURL, uploadBytesResumable, deleteObject} from "firebase/storage";
import firebaseConfig from "../firebaseConfig.js";


//ininitialize a firebase app
initializeApp(firebaseConfig)
// initialize Cloud Storage
const storage = getStorage()


const galleryController =  {
  uploadNewGallery: async (req, res) => {

    const { businessId } = req.body

    try {
      const uploadedFiles = [];
  
      // Loop through the array of files
      for (const file of req.files) {
        const storageRef = ref(storage, `businessGallery/${businessId}-${uploadedFiles.length+1}`);
  
        // Create file metadata jpeg/pdf/png
        const metadata = {
          contentType: file.mimetype
        };
  
        // Upload each file
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
  
        // Get download URL for each file
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Store the information of uploaded file
        uploadedFiles.push({
          name: file.originalname,
          type: file.mimetype,
          downloadURL: downloadURL
        });
      }
  
      // Delete previous gallery.
      const allGalleries = await galleryModel.find()
      const existingGallery = allGalleries.filter(gallery => gallery.businessId === businessId)[0]


      if(existingGallery !== undefined){
        // Delete pics from MongoBD
        await galleryModel.findByIdAndDelete(existingGallery._id)

        // Delete pics from Firebase
        // const urls = existingGallery.pics.map(pic => pic)
        // for(const url of urls){
        //   const picToBeDeletedFromFirebase = ref(storage, url)
        //   deleteObject(picToBeDeletedFromFirebase)
        // }
      }

      // Create new gallery in database
      const picsUrls = uploadedFiles.map(file => file.downloadURL)
      const newGallery = new galleryModel({
        businessId,
        pics: picsUrls
      })
      await newGallery.save()
      
      // Send the response with the list of uploaded files
      return res.json({
        firebaseMessage: "Files uploaded to Firebase storage",
        message: "Gallery successfully created.",
        newGallery
      });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }, 

  getAllGalleries: async (req, res) => {
    try {
      const allPics = await galleryModel.find()
      return res.status(200).send(allPics)
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  getOneGallery: async (req, res) => {
    try {
      const gallery = await galleryModel.findById(req.params.id)
      return res.status(200).send(gallery)
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  deleteGallery: async (req, res) => {
    try {
      // Delete pics from Firebase
      const gallery = await galleryModel.findById(req.params.id)
      const urls = gallery.pics.map(pic => pic)
      for(const url of urls){
        const picToBeDeletedFromFirebase = ref(storage, url)
        deleteObject(picToBeDeletedFromFirebase)
      }

      // Delete Gallery from MongoDB
      const galleryToBeDeleted = await galleryModel.findByIdAndDelete(req.params.id)
      return res.status(200).send({firebase: "Pictures have been deleted!", mongodb: "Gallery was removed!"})
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}
  
export default galleryController