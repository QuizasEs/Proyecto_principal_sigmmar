import { connection } from "../db.js";
//obtener todos lo areas
export const getServices = async (req, res) => {
    try {
        const [areas] = await db.query('SELECT * FROM areas WHERE estado = 1'); // Suponiendo que el estado 1 significa activo
        res.json(areas);
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        res.status(500).json({ message: 'Error al obtener áreas' });
    }
}