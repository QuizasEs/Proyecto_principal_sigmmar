// Importa las dependencias necesarias
import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import { connection } from '../db.js';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Función middleware para permitir acceso solo a administradores
async function SoloAdmin(req, res, next) {
    const logueado = await revisarcookie(req);
    if (!logueado) { 
        return res.redirect("/"); // Si no está logueado, redirige a la página principal
    }
    next(); // Si está logueado, continúa
}

// Función middleware para permitir acceso solo a usuarios no logueados
async function SoloPublico(req, res, next) {
    const logueado = await revisarcookie(req);
    if (logueado) { 
        return res.redirect("/admin"); // Si ya está logueado, redirige a /admin
    }
    next(); // Si no está logueado, continúa
}

// Función para revisar si el usuario está logueado mediante cookies
async function revisarcookie(req) {
    try {
        // Obtiene las cookies de la cabecera de la solicitud
        const cookies = req.headers.cookie || ""; // Asegura que sea una cadena
        const cookieJWT = cookies.split("; ").find(cookie => cookie.startsWith("jwt=")); // Busca el token JWT

        if (!cookieJWT) {
            return false; // No se encontró el token JWT
        }

        // Verifica y decodifica el token JWT
        const decodificada = jsonwebtoken.verify(cookieJWT.slice(4), process.env.JWT_SECRET);
        //console.log(decodificada);

        // Busca el usuario en la base de datos
        const [rows] = await connection.query("SELECT * FROM user WHERE us_username = ?", [decodificada.user]);
        const usuarioARevisar = rows[0];
        //console.log(usuarioARevisar);
        
        if (!usuarioARevisar) {
            return false; // No se encontró el usuario
        }

        return true; // El usuario está logueado
    } catch (error) {
        return false; // Ocurrió un error al verificar el token
    }
}

// Exporta las funciones como métodos
export const methods = {
    SoloAdmin,
    SoloPublico,
};
