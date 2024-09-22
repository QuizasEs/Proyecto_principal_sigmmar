// Importa las dependencias necesarias
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connection } from "./db.js"; // Asegúrate de tener la conexión de la base de datos
import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as authorization } from "./middlewares/authorization.js";

// Soluciona el problema de __dirname en ES6
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Crea una instancia de la aplicación Express
const app = express();
app.set("port", process.env.PORT || 4000); // Configura el puerto a partir de las variables de entorno o por defecto 4000

// Configuración de middleware
app.use(express.static(__dirname + "/public")); // Sirve archivos estáticos desde el directorio "public"
app.use(express.json()); // Permite el manejo de datos JSON en las solicitudes
app.use(cookieParser()); // Permite el manejo de cookies en las solicitudes

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
    res.clearCookie('jwt', { path: '/' }); // Elimina la cookie 'jwt'
    res.status(200).send({ message: "Sesión cerrada con éxito", redirect: "/" });
});

// Rutas
app.get("/", authorization.SoloPublico, (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", authorization.SoloPublico, (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin", authorization.SoloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin.html"));
app.get("/index", authorization.SoloAdmin, (req, res) => res.sendFile(__dirname + "/pages/index.html"));
app.get("/service", authorization.SoloAdmin, (req, res) => res.sendFile(__dirname + "/pages/servicio.html"));

/* app.get("/sigmmar", authorization.SoloAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "website", "index.html"));
});*/
app.get("/sigmar-servicio", authorization.SoloAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "website", "servicio.html"));
});


// Rutas de autenticación
app.post("/api/register", authentication.register);
app.post("/api/login", authentication.login);

