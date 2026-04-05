# 🤖 Willana Bot – WhatsApp Business API

Bot de WhatsApp para **Willana Comunicación Integral** que responde automáticamente el primer mensaje de cada contacto.

---

## 📋 Flujo del bot

```
Usuario escribe por primera vez
        ↓
Bot saluda → pregunta: ¿Trabajo o Personal?
        ↓
  ┌─────────────────────┐
  │                     │
Trabajo             Personal
  ↓                     ↓
Lista servicios     Mensaje cortesía
  ↓                     (fin)
Usuario elige servicio (1, 2 o 3)
  ↓
Bot confirma que se pone en contacto
(fin del flujo automático)
```

---

## 🚀 Cómo deployar en Render (gratis)

### PASO 1 – Subir el código a GitHub

1. Creá una cuenta en [github.com](https://github.com) si no tenés
2. Creá un repositorio nuevo llamado `willana-bot`
3. Subí estos archivos al repositorio

### PASO 2 – Crear el servicio en Render

1. Entrá a [render.com](https://render.com) y creá una cuenta gratuita
2. Hacé clic en **New → Web Service**
3. Conectá tu repositorio de GitHub `willana-bot`
4. Configurá:
   - **Name:** willana-bot
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. En **Environment Variables** agregá:

| Key | Value |
|-----|-------|
| `VERIFY_TOKEN` | `willana_token_2024` |
| `WA_TOKEN` | *(lo obtenés en el Paso 3)* |
| `PHONE_ID` | *(lo obtenés en el Paso 3)* |

6. Hacé clic en **Create Web Service**
7. Render te da una URL tipo: `https://willana-bot.onrender.com`

---

### PASO 3 – Configurar Meta for Developers

1. Entrá a [developers.facebook.com](https://developers.facebook.com)
2. Creá una nueva App → tipo **Business**
3. Agregá el producto **WhatsApp**
4. En **WhatsApp → API Setup**:
   - Copiá el **Phone Number ID** → pegalo en Render como `PHONE_ID`
   - Generá un **Temporary Access Token** → pegalo en Render como `WA_TOKEN`
5. En **WhatsApp → Configuration → Webhook**:
   - **Callback URL:** `https://willana-bot.onrender.com/webhook`
   - **Verify Token:** `willana_token_2024`
   - Hacé clic en **Verify and Save**
   - Activá el campo **messages** en los suscription fields

---

### PASO 4 – Probar

1. Mandá un WhatsApp al número de prueba que te da Meta
2. El bot debería responder automáticamente con el saludo
3. Seguí el flujo eligiendo 1 o 2, luego el servicio

---

## 📁 Estructura del proyecto

```
willana-bot/
├── src/
│   └── index.js        # Código principal del bot
├── .env.example        # Variables de entorno de ejemplo
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VERIFY_TOKEN` | Token para verificar el webhook con Meta |
| `WA_TOKEN` | Token de acceso a la API de WhatsApp Cloud |
| `PHONE_ID` | ID del número de teléfono en Meta |
| `PORT` | Puerto del servidor (Render lo asigna solo) |

---

## 💬 Mensajes del bot

Los mensajes se editan directamente en `src/index.js` en el objeto `MSGS`:

```js
const MSGS = {
  bienvenida: `...`,   // Primer mensaje automático
  trabajo: `...`,      // Lista de servicios
  contacto: `...`,     // Confirmación de contacto
  personal: `...`,     // Respuesta para mensajes personales
};
```

---

## ⚠️ Notas importantes

- El **plan gratuito de Render** puede tardar ~30 segundos en "despertar" si estuvo inactivo
- El estado de cada usuario se guarda **en memoria** — si el servidor se reinicia, se reinicia el flujo
- Para producción real, reemplazar la memoria por una base de datos (ej: MongoDB Atlas, también gratis)
