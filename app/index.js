// Importa las dependencias necesarias
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import multer from "multer";
import { connection } from "./db.js"; // Asegúrate de tener la conexión de la base de datos
import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as authorization } from "./middlewares/authorization.js";
import { methods as areasController } from "./controllers/areas.controller.js";
import { methods as userMethods } from "./controllers/usuarios.controller.js";
import { methods as subAreasController } from "./controllers/sub_areas.controller.js";
import { methods as servicesController } from "./controllers/servicesController.js";


// Soluciona el problema de __dirname en ES6
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mediaDir = path.join(__dirname, "media");
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir);
    }
    cb(null, mediaDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Crea una instancia de la aplicación Express
const app = express();
app.set("port", process.env.PORT || 5000); // Configura el puerto a partir de las variables de entorno o por defecto 4000

// Configuración de middleware
app.use(express.static(path.join(__dirname, "public"))); // Sirve archivos estáticos desde el directorio "public"
app.use(express.json()); // Permite el manejo de datos JSON en las solicitudes
app.use(cookieParser()); // Permite el manejo de cookies en las solicitudes
app.use("/media", express.static(path.join(__dirname, "media")));

// Inicia el servidor y conexión a la base de datos
app.listen(app.get("port"), () => {
  console.log(`Servidor corriendo en el puerto ${app.get("port")}`);
  connection.connect((err) => {
    if (err) {
      console.error("Error al conectar con la base de datos:", err);
    } else {
      console.log("Conectado a la base de datos");
    }
  });
});

// Ruta para eliminar la cookie de sesión
app.post("/api/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" }); // Elimina la cookie 'jwt'
  res.status(200).send({ message: "Sesión cerrada con éxito", redirect: "/" });
});

// Rutas
app.get("/", authorization.SoloPublico, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/login.html"))
);
app.get("/register", authorization.SoloPublico, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/register.html"))
);
app.get("/admin", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin.html"))
);
app.get("/index", (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/index.html"))
);
app.get("/service", (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/servicio.html"))
);

app.get("/sigmar-servicio", authorization.SoloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "website", "servicio.html"));
});

// Rutas de autenticación
app.post("/api/register", authentication.register);
app.post("/api/login", authentication.login);

// Rutas para áreas
app.get("/area", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/areas.html"))
);
app.get("/crear_area", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/crear_areas.html"))
);
app.get("/modificar_area", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/modificar_areas.html"))
);

app.get("/api/areas", areasController.getAreas);
app.post(
  "/api/areas",
  upload.single("area_directorio_img"),
  authorization.SoloAdmin,
  areasController.createArea
);
app.put(
  "/api/areas/:id",
  upload.single("area_directorio_img"),
  areasController.updateArea
);
app.delete("/api/areas/:id", areasController.deleteArea);
app.get("/api/areas/:id", areasController.getAreaById);

// Rutas para las páginas usuario
app.get("/usuarios", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/usuarios.html"))
);
app.get("/modificar_usuario", authorization.SoloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/admin/modificar_usuarios.html"));
});

// Rutas de la API para la gestión de usuarios
app.get("/api/users", authorization.SoloAdmin, userMethods.getUsers);
app.put("/api/users/:id", authorization.SoloAdmin, userMethods.updateUser);
app.delete("/api/users/:id", authorization.SoloAdmin, userMethods.deleteUser);

// Rutas para las páginas sub_área HTML
app.get("/crear_sub_areas", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/crear_sub_areas.html"))
);
app.get("/sub_areas", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/sub_areas.html"))
);
app.get("/modificar_sub_areas", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/modificar_sub_areas.html"))
);

app.get("/api/sub_areas", subAreasController.getSubAreas);
app.get("/api/sub_areas/:id", subAreasController.getSubAreaById);
app.post(
  "/api/sub_areas",
  upload.single("sub_directorio_img"),
  authorization.SoloAdmin,
  subAreasController.createSubArea
);
app.put(
  "/api/sub_areas/:id",
  upload.single("sub_directorio_img"),
  authorization.SoloAdmin,
  subAreasController.updateSubArea
);
app.delete(
  "/api/sub_areas/:id",
  authorization.SoloAdmin,
  subAreasController.deleteSubArea
);

// Rutas para mensajes
app.get("/mensajes", authorization.SoloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/mensajes.html"))
);
//rutas para sevicios controller
app.get("/api/services", servicesController.getServices);

//ruta de redireccion desde el cuadro grid a la página de detalle
app.get("/api/services/:id", servicesController.getServiceById);