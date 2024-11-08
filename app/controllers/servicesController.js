import { connection } from '../db.js';

//obtener todos lo areas
export const methods ={

    getServices : async (req, res) => {
        try {
            const [rows] = await connection.query('SELECT * FROM area WHERE area_estado = 1');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las áreas" });
        }
    },
    getSubservices: async (req, res) => {
        try {
            const { area_id } = req.params; // Suponiendo que area_id viene de los parámetros de la solicitud
            const [rows] = await connection.query(
                'SELECT * FROM sub_area JOIN area ON sub_area.area_id = area.area_id WHERE area.area_id = ? AND sub_Estado = 1',
                [area_id]
            );
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las sub áreas" });
        }
    },
    

}
