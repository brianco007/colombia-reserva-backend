import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import connectDB from "./config.js";
import businessInfoRouter from "../routers/businessInfoRouter.js";
import eventsRouter from "../routers/eventsRouter.js";
import reviewsRouter from "../routers/reviewsRouter.js";
import galleryRouter from "../routers/galleryRouter.js";
import offerRouter from "../routers/offerRouter.js"
import signupRouter from "../routers/signupRouter.js";
import loginRouter from "../routers/loginRouter.js"
import adsRouter from "../routers/adsRouter.js";
import employeesRouter from "../routers/employeesRouter.js"
import whatsappRouter from "../routers/whatsappRouter.js";

connectDB()
const app = express();
const PORT = process.env.PORT

app.get("/", (req, res) => {
  res.send(`Server is up at port ${PORT}`)
})

// Middlewares
const corsOptions = {
  origin: 'https://colombiareservatodo.web.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Permitir cookies, si es necesario
};

app.use(cors());
app.use(express.json())


//routes
app.use("/businessInfo", businessInfoRouter)
app.use("/events", eventsRouter)
app.use("/reviews", reviewsRouter)
app.use("/gallery", galleryRouter)
app.use("/offer", offerRouter)
app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/ads", adsRouter)
app.use("/employees", employeesRouter)
app.use("/whatsapp", whatsappRouter)


app.use('/businessBanners', express.static(path.resolve(`businessBanners`)));//ruta para que las imagnes queden publicas//




app.listen(PORT, ()=>{
  console.log(`Listening from port ${PORT}`)
})


export default app;
