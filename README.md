# 🌙 Sueños Valenti

Aplicación web desarrollada con **Node.js**, **Express** y **EJS** para la gestión de usuarios, registro, login y una zona privada espiritual, con soporte de **tema claro y oscuro** persistente mediante cookies.

---

## ✨ Características principales

- 📝 Registro de usuarios con validaciones
- 🔐 Login con sesiones (`express-session`)
- 👤 Zona privada (perfil)
- 🛒 Carrito espiritual de sesiones
- 🌗 Tema claro / oscuro persistente con cookies
- 🎨 Estilos CSS con soporte para ambos temas
- 📄 Motor de plantillas EJS
- 📁 Persistencia básica con archivos JSON
- 🕒 Registro de accesos con fecha y hora

---

## 🛠️ Tecnologías usadas

- Node.js
- Express
- EJS
- CSS
- express-session
- cookie-parser
- dayjs
- fs (File System)

---

## 📂 Estructura del proyecto

/
├── app.js
├── package.json
├── data/
│ ├── usuarios.json
│ └── accesos.log
├── public/
│ └── style.css
├── views/
│ ├── index.ejs
│ ├── login.ejs
│ ├── registro.ejs
│ ├── perfil.ejs
│ └── preferencias.ejs


---

🚀 Instalación y puesta en marcha

1️⃣ Clona o descarga el proyecto
2️⃣ Entra en la carpeta del proyecto
3️⃣ Instala las dependencias:

npm install


4️⃣ Inicia el servidor:

node app.js


5️⃣ Abre el navegador y accede a:

http://localhost:4000


