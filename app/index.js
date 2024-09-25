// Importa las dependencias necesarias
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import multer from 'multer';
import { connection } from "./db.js"; // Asegúrate de tener la conexión de la base de datos
import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as authorization } from "./middlewares/authorization.js";
import { methods as areasController } from "./controllers/areas.controller.js";
/* import { methods as subAreasController } from "./controllers/sub_areas.controller.js";
import { methods as mensajesController } from "./controllers/mensajes.controller.js";
 */
// Soluciona el problema de __dirname en ES6
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carga las variables de entorno desde el archivo .env
dotenv.config();

//configuaracion de multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const mediaDir = path.join(__dirname, 'media');
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir);
        }
        cb(null, mediaDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }); 

// Crea una instancia de la aplicación Express
const app = express();
app.set("port", process.env.PORT || 4000); // Configura el puerto a partir de las variables de entorno o por defecto 4000

// Configuración de middleware
app.use(express.static(path.join(__dirname, "public"))); // Sirve archivos estáticos desde el directorio "public"
app.use(express.json()); // Permite el manejo de datos JSON en las solicitudes
app.use(cookieParser()); // Permite el manejo de cookies en las solicitudes
app.use('/media', express.static(path.join(__dirname, 'media')));


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
app.get("/", authorization.SoloPublico, (req, res) => res.sendFile(path.join(__dirname, "/pages/login.html")));
app.get("/register", authorization.SoloPublico, (req, res) => res.sendFile(path.join(__dirname, "/pages/register.html")));
app.get("/admin", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin.html")));
app.get("/index", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/index.html")));
app.get("/service", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/servicio.html")));

app.get("/sigmar-servicio", authorization.SoloAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "website", "servicio.html"));
});

// Rutas de autenticación
app.post("/api/register", authentication.register);
app.post("/api/login", authentication.login);

// Rutas para áreas
app.get("/area", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/areas.html")));
app.get("/crear_area", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/crear_areas.html")));
app.get("/modificar_area", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/modificar_areas.html")));

app.get('/api/areas', areasController.getAreas);
app.post('/api/areas', upload.single('area_directorio_img'), areasController.createArea);
app.put('/api/areas/:id', upload.single('area_directorio_img'), areasController.updateArea);
app.delete('/api/areas/:id', areasController.deleteArea);
app.get('/api/areas/:id', areasController.getAreaById);


/* // Rutas para sub-áreas
app.get("/sub_area", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/sub_areas.html")));
app.get("/crear_sub_area", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/crear_sub_areas.html")));
app.get("/modificar_sub_area", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/modificar_sub_areas.html")));

app.get("/api/sub-areas", subAreasController.getSubAreas);
app.post("/api/sub-areas", upload.single('sub_directorio_img'), subAreasController.createSubArea);
app.get("/api/sub-areas/:id", subAreasController.getSubArea);
app.put("/api/sub-areas/:id", upload.single('area_directorio_img'), subAreasController.updateSubArea);
app.delete("/api/sub-areas/:id", subAreasController.deleteSubArea);

// Rutas para mensajes
app.get("/mensajes", authorization.SoloAdmin, (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/mensajes.html")));

app.get("/api/mensajes", mensajesController.getMensajes);
app.post("/api/mensajes", mensajesController.createMensaje); */
