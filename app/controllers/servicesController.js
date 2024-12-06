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
            const { area_id } = req.params;
    
            // Obtiene la información del área principal
            const [areaResult] = await connection.query(
                'SELECT area_nombre, area_descripcion, area_directorio_img, area_requisitos, area_sanciones FROM area WHERE area_id = ? AND area_estado = 1',
                [area_id]
            );
            
            if (areaResult.length === 0) {
                return res.status(404).json({ message: "Área no encontrada" });
            }
    
            const area = areaResult[0];
    
            // Obtiene los sub servicios de dicha área
            const [subAreasResult] = await connection.query(
                'SELECT sub_nombre, sub_descripcion, sub_directorio_img FROM sub_area WHERE area_id = ? AND sub_estado = 1',
                [area_id]
            );
    
            res.json({ area, subAreas: subAreasResult });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las sub áreas" });
        }
    },
    
    

}
