// Importa las dependencias necesarias
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import { connection } from '../db.js';
import jsonwebtoken from 'jsonwebtoken';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Función para manejar el inicio de sesión
async function login(req, res) {
    console.log(req.body); // Imprime el cuerpo de la solicitud para depuración
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).send({ 
            status: "Error", 
            message: "Los campos están incompletos" 
        });
    }

    // Busca el usuario en la base de datos
    const [rows] = await connection.query("SELECT * FROM user WHERE us_username = ?", [user]);
    const usuarioARevisar = rows[0];
    
    if (!usuarioARevisar) {  // Usuario no encontrado
        return res.status(400).send({ 
            status: "Error", 
            message: "Inicio de sesión fallido" 
        });
    }

    // Compara la contraseña ingresada con la encriptada
    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.us_password);
    
    if (!loginCorrecto) {
        return res.status(400).send({ 
            status: "Error", 
            message: "Inicio de sesión fallido" 
        });
    }

    // Si el login es correcto, genera el token y configura la cookie
    const token = jsonwebtoken.sign(
        { user: usuarioARevisar.us_username }, // Datos a incluir en el token
        process.env.JWT_SECRET, // Clave secreta
        { expiresIn: process.env.JWT_EXPIRATION } // Tiempo de expiración
    );
    
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/"
    };

    res.cookie('jwt', token, cookieOptions);
    res.status(200).send({
        status: "ok", 
        message: "Login exitoso", 
        redirect: "/admin" // Redirige al usuario
    });
}

// Función para manejar el registro de nuevos usuarios
async function register(req, res) {
    console.log(req.body); // Depuración
    const { user, email, password, username, lastnamefather, lastnamemother, telefono } = req.body;

    if (!user || !email || !password || !username || !lastnamefather || !lastnamemother || !telefono) {
        return res.status(400).send({ 
            status: "Error", 
            message: "Los campos están incompletos" 
        });
    }

    // Verifica si el usuario ya existe
    const [rows] = await connection.query("SELECT * FROM user WHERE us_username = ?", [user]);
    const usuarioARevisar = rows[0];
    console.log(usuarioARevisar);
    
    if (usuarioARevisar) {
        return res.status(400).send({ 
            status: "Error", 
            message: "Este usuario ya existe" 
        });
    }
    // Genera una sal para encriptar la contraseña
    const salt = await bcryptjs.genSalt(3);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Inserta el nuevo usuario en la base de datos
    const nuevoUsuario = await connection.query(
        "INSERT INTO user (us_username, us_password, us_correo, us_nombres, us_ap_paterno, us_ap_materno, us_telefono, us_estado) VALUES (?, ?, ?, ?, ?, ?, ?, 1)", 
        [user, hashPassword, email, username, lastnamefather, lastnamemother, telefono]
    );

    return res.status(201).send({
        status: "ok", 
        message: `Usuario ${user} agregado`, 
        redirect: "/usuarios" // Redirige a la página principal
    });
}

// Exporta las funciones como métodos
export const methods = {
    login, 
    register
};
