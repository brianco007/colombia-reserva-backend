import axios from "axios";
import { Router } from "express";

const whatsappRouter = Router();

whatsappRouter.post("/", async (req, res) => {
  const { phone, message } = req.body;

  if (phone && message) {
    axios
      .post("http://34.136.118.146:3000/send-message", {
        phone,
        message,
      })
      .then((response) => {
        console.log("Mensaje enviado correctamente", response.data);
        res.json({ message: "Mensaje enviado correctamente" });
      })
      .catch((error) => {
        console.error(
          "Error al enviar mensaje:",
          error.response ? error.response.data : error.message
        );
        res.json({ error: "Error al enviar mensaje", error: error.message });
      });
  }
});

export default whatsappRouter;
