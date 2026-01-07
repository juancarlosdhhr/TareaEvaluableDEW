
// IMPORTACIÓN DE MÓDULOS
const express = require("express");
const path = require("path");
const fs = require("fs");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const dayjs = require("dayjs");
require("dayjs/locale/es");
dayjs.locale("es");

const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: "clave sesiones sueños valenti",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 30
  }
}));

// Middleware para proteger rutas
function requiereAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Middleware global para todas las vistas
app.use((req, res, next) => {
  res.locals.tema = req.cookies.tema || "claro"; 
  next();
});


// --- RUTAS ---

// Página de inicio
app.get("/", (req, res) => {
  const tema = req.cookies.tema || "claro"; 
  res.render("index", { tema });            
});


// Registro
app.get("/registro", (req, res) => {
  res.render("registro", {
    nombre: "",
    email: "",
    edad: "",
    ciudad: "",
    intereses: [],
    errores: [],
    tema: req.cookies.tema || "claro" 
  });
});



app.post("/registro", (req, res) => {
  let { nombre, email, edad, ciudad, intereses } = req.body;
  let errores = [];

  if (!Array.isArray(intereses)) intereses = intereses ? [intereses] : [];

  if (!nombre || nombre.trim().length < 2) errores.push("Nombre incorrecto");
  if (!email || !email.includes("@")) errores.push("Email no válido");
  if (!edad || edad <= 0) errores.push("Edad incorrecta");

  if (errores.length) {
    return res.status(400).render("registro", {
      nombre, email, edad, ciudad, intereses, errores,
      tema: req.cookies.tema || "claro" 
    });
  }

  const usuarios = JSON.parse(fs.readFileSync("./data/usuarios.json"));
  usuarios.push({ nombre, email, edad, ciudad, intereses });
  fs.writeFileSync("./data/usuarios.json", JSON.stringify(usuarios, null, 2));

  res.redirect("/login");
});


// Login
app.get("/login", (req, res) => {
  const tema = req.cookies.tema || "claro";
  res.render("login", { error: null, tema });
});



app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const usuarios = JSON.parse(fs.readFileSync("./data/usuarios.json"));

  const user = usuarios.find(u => u.email === email);

  if (user && password === "1234") {
    req.session.user = user;
    fs.appendFileSync(
      "./data/accesos.log",
      `${dayjs().format("DD/MM/YYYY HH:mm")} - Login de ${email}\n`
    );
    return res.redirect("/perfil");
  }

 res.status(401).render("login", { error: "Credenciales incorrectas", tema: req.cookies.tema || "claro" });

});

// Perfil y carrito espiritual
app.get("/perfil", requiereAuth, (req, res) => {
  res.render("perfil", {
    user: req.session.user,
    carrito: req.session.carrito || [],
    tema: req.cookies.tema || "claro"
  });
});

app.get("/add-sesion/:nombre", requiereAuth, (req, res) => {
  if (!req.session.carrito) req.session.carrito = [];
  req.session.carrito.push(req.params.nombre);
  res.redirect("/perfil");
});

app.post("/vaciar-carrito", requiereAuth, (req, res) => {
  req.session.carrito = [];
  res.redirect("/perfil");
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// Preferencias
app.get("/preferencias", (req, res) => {
  const tema = req.cookies.tema || "claro";
  res.render("preferencias", { tema });
});

app.get("/tema/:modo", (req, res) => {
  const modo = req.params.modo;
  if (modo === "claro" || modo === "oscuro") {
   res.cookie("tema", modo, { maxAge: 1000*60*60*24*7, path: "/" });

  }
  res.redirect("/preferencias");
});

//  INICIO DEL SERVIDOR 
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
