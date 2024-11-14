import employeesModel from "../models/employeesModel.js"
import generateTimeSlots from "../tools/generateTimeSlots.js"

// firebase imports
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import firebaseConfig from "../firebaseConfig.js";


//ininitialize a firebase app
initializeApp(firebaseConfig)
// initialize Firebase Cloud Storage
const storage = getStorage()

const employeesController = {
  createEmployee: async (req, res) => {
    try {
      let { businessId } = req.body
      // businessId = JSON.parse(businessId)

      // Firebase upload
      const storageRef = ref(storage, `businessEmployees/${businessId}-${req.file.originalname}`)
      const metadata = {
        contentType: req.file.mimetype
      }
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Construct the schedule array from the flattened keys
      const schedule = [];
      // Loop through the received schedule data and build the array of schedule objects
      let i = 0;
      while (req.body[`schedule[${i}].day`] !== undefined) {
        schedule.push({
          day: req.body[`schedule[${i}].day`],
          openTime: req.body[`schedule[${i}].openTime`],
          closeTime: req.body[`schedule[${i}].closeTime`],
          breakStart: req.body[`schedule[${i}].breakStart`],
          breakFinish: req.body[`schedule[${i}].breakFinish`],
        });
        i++;
      }
      
      let newEmployee = {
        businessId: businessId,
        picture: downloadURL, 
        fullName: (req.body.fullName), 
        services: (req.body.services),
        schedule: schedule,
        sessionTime: (req.body.sessionTime),
        active: (req.body.active)
      }
      newEmployee.timeSlots = generateTimeSlots(newEmployee.schedule, newEmployee.sessionTime)
      const x  = new employeesModel(newEmployee)

      const createdEmployee = await x.save();
      res.status(201).json({ message: "Employee created successfully", createdEmployee });
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Extract validation error messages
        const errorMessages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ message: "Validation failed", errors: errorMessages });
      } else {
        res.status(500).json({ message: "An unexpected error occurred", error: error.message });
      }
    }
  },


  getAllEmployees: async (req, res) => {
    try {
      const allEmployees = await employeesModel.find();
      res.status(200).json(allEmployees);
    } catch (error) {
      res.json({
        message:
          "Error. Make sure your server is running and that the APIs url is typed correctly",
      });
    }
  },


  getOneEmployee: async (req, res) => {
    try {
      const employee = await employeesModel.findById(req.params.id);
      res.json(employee);
    } catch (error) {
      res.json({ message: "Error. Make sure the ad ID is correct" });
    }
  },


  updateEmployee: async (req, res) => {
    try {
      // delete previous pic from Firebase
      const previousPic = await employeesModel.findById(req.params.id)
      console.log(previousPic)
      if(previousPic){
        const url = previousPic.picture
        console.log(url)
        const picToBeDeletedFromFirebase = ref(storage, url)
        deleteObject(picToBeDeletedFromFirebase)
      }

      // Firebase new picture upload
      let { businessId } = req.body
      // businessId = JSON.parse(businessId) 
      const storageRef = ref(storage, `businessEmployees/${businessId}-${req.file.originalname}`)
      const metadata = {
        contentType: req.file.mimetype
      }
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      const downloadURL = await getDownloadURL(snapshot.ref)

       // Construct the schedule array from the flattened keys
       const schedule = [];
       // Loop through the received schedule data and build the array of schedule objects
       let i = 0;
       while (req.body[`schedule[${i}].day`] !== undefined) {
         schedule.push({
           day: req.body[`schedule[${i}].day`],
           openTime: req.body[`schedule[${i}].openTime`],
           closeTime: req.body[`schedule[${i}].closeTime`],
           breakStart: req.body[`schedule[${i}].breakStart`],
           breakFinish: req.body[`schedule[${i}].breakFinish`],
         });
         i++;
       }

      // Update in MongoDB
      let updatedInfo = {
        businessId: (businessId),
        picture: downloadURL, 
        fullName: (req.body.fullName), 
        services: (req.body.services),
        schedule: schedule,
        sessionTime: (req.body.sessionTime),
        active: (req.body.active)
      }
      updatedInfo.timeSlots = generateTimeSlots(updatedInfo.schedule, updatedInfo.sessionTime)

      let updatedAd  = await employeesModel.findByIdAndUpdate(
        req.params.id,
        updatedInfo
      );
      res.json({ message: "Employee info has been updated.", updatedAd});
    } catch (error) {
      res.json({
        message:
          "Error. Make sure the employee's ID is correct and you include all the required fields.",
        errorMessage: error.message
      });
    }
  },


  deleteEmployee: async (req, res) => {
    try {
      // delete from Firebase
      const previousPic = await employeesModel.findById(req.params.id)

      if(previousPic){
        const url = previousPic.picture
        const picToBeDeletedFromFirebase = ref(storage, url)
        deleteObject(picToBeDeletedFromFirebase)
      }

      // delete from MongoDB
      const adToBeDeleted = await employeesModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Ad has been removed." });
    } catch (error) {
      res.json({ message: "Error. Make sure the ad ID is correct", error: error.message });
    }
  },
};


export default employeesController;
