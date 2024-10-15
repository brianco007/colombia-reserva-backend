import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import connectDB from "./config.js";
import businessInfoRouter from "../routers/businessInfoRouter.js";
import eventsRouter from "../routers/eventsRouter.js";
import reviewsRouter from "../routers/reviewsRouter.js";
import galleryRouter from "../routers/galleryRouter.js";


connectDB()
const app = express();
const PORT = process.env.PORT

app.get("/", (req, res) => {
  res.send(`Server is up at port ${PORT}`)
})

// Middlewares
app.use(cors())
app.use(express.json())

//routes
app.use("/businessInfo", businessInfoRouter)
app.use("/events", eventsRouter)
app.use("/reviews", reviewsRouter)
app.use("/gallery", galleryRouter)
app.use('/businessBanners', express.static(path.resolve(`businessBanners`)));//ruta para que las imagnes queden publicas//




app.listen(PORT, ()=>{
  console.log(`Listening from port ${PORT}`)
})

