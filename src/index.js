const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "willana_token_2024";
const WA_TOKEN = process.env.WA_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

const userState = {};

const MSGS = {
  bienvenida: `¡Hola! 👋 Soy Anto Lamberti.\n\nGracias por escribirme. Para ayudarte mejor, contame: ¿el motivo de tu mensaje es por trabajo o algo personal?\n\nRespondé con:\n1️⃣ para *Trabajo*\n2️⃣ para *Personal*`,
  trabajo: `¡Genial! Esto es lo que ofrecemos desde Willana Comunicación Integral:\n\n1️⃣ Gestión de Redes Sociales / Publicidad\n2️⃣ Diseño Gráfico\n3️⃣ Anuncios (Ads)\n\n¿Sobre cuál te gustaría saber más? Respondé con el número 😊`,
  contacto: `¡Perfecto! 🙌 Enseguida me pongo en contacto con vos para contarte todos los detalles.\n\n¡Gracias por esperar! 🤗`,
  personal: `¡Hola! 😊 Recibí tu mensaje. Este número lo uso principalmente para trabajo, así que es posible que tarde un poco en responder mensajes personales.\n\n¡Gracias por entender! 🙏`,
  noEntiendo: `No entendí tu respuesta 😅 Por favor respondé con el número correspondiente a tu opción.`,
};

async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`,
      { messaging_product: "whatsapp", to, type: "text", text: { body: text } },
      { headers: { Authorization: `Bearer ${WA_TOKEN}`, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

async function handleMessage(from, text) {
  const msg = text.trim().toLowerCase();
  const state = userState[from] || "nuevo";

  if (state === "nuevo") {
    userState[from] = "esperando_tipo";
    await sendMessage(from, MSGS.bienvenida);
    return;
  }
  if (state === "esperando_tipo") {
    if (msg === "1" || msg.includes("trabajo")) {
      userState[from] = "esperando_servicio";
      await sendMessage(from, MSGS.trabajo);
    } else if (msg === "2" || msg.includes("personal")) {
      userState[from] = "finalizado";
      await sendMessage(from, MSGS.personal);
    } else {
      await sendMessage(from, MSGS.noEntiendo);
    }
    return;
  }
  if (state === "esperando_servicio") {
    if (["1", "2", "3"].includes(msg)) {
      userState[from] = "finalizado";
      await sendMessage(from, MSGS.contacto);
    } else {
      await sendMessage(from, MSGS.noEntiendo);
    }
    return;
  }
}

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  try {
    const messages = req.body?.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages || messages.length === 0) return;
    const message = messages[0];
    if (message.type === "text") {
      await handleMessage(message.from, message.text.body);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
});

app.get("/", (req, res) => {
  res.json({ status: "🟢 Willana Bot activo" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Bot corriendo en puerto ${PORT}`));
