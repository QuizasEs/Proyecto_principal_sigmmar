import { connection } from '../db.js';

export const methods = {
    getAreas: async (req, res) => {
        try {
            const [rows] = await connection.query('SELECT * FROM area WHERE area_estado = 1');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las áreas" });
        }
    },

    createArea: async (req, res) => {
        try {
            const { area_nombre, area_descripcion } = req.body;
            const area_directorio_img = req.file ? `/media/${req.file.filename}` : null;
            const [result] = await connection.query(
                'INSERT INTO area (area_nombre, area_descripcion, area_directorio_img, area_estado) VALUES (?, ?, ?, 1)',
                [area_nombre, area_descripcion, area_directorio_img]
            );
            res.json({ id: result.insertId, message: "Área creada exitosamente", redirect: "/area" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al crear el área" });
        }
    },

    updateArea: async (req, res) => {
        try {
            const { id } = req.params; // Obtener el ID desde los parámetros de la solicitud
            const { area_nombre, area_descripcion } = req.body;
    
            // Validar que se reciban los datos necesarios
            if (!area_nombre || !area_descripcion) {
                return res.status(400).json({ message: "Nombre y descripción son requeridos" });
            }
    
            // Manejar la imagen si es necesaria
            const area_directorio_img = req.file ? `/media/${req.file.filename}` : req.body.area_directorio_img;
    
            const [result] = await connection.query(
                'UPDATE area SET area_nombre = ?, area_descripcion = ?, area_directorio_img = ? WHERE area_id = ?',
                [area_nombre, area_descripcion, area_directorio_img, id]
            );
    
            // Verificar si se actualizó algún registro
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Área no encontrada o no se realizaron cambios" });
            }
    
            // Respuesta exitosa
            res.json({ message: "Área actualizada exitosamente", redirect: `/modificar_area?id=${id}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el área" });
        }
    },
    
    deleteArea: async (req, res) => {
        try {
            const { id } = req.params;
            await connection.query('UPDATE area SET area_estado = 0 WHERE area_id = ?', [id]);
            res.json({ message: "Área eliminada exitosamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al eliminar el área" });
        }
    },

    getAreaById: async (req, res) => {
        const areaId = req.params.id; // Obtener el ID desde los parámetros de la solicitud
        try {
            const [results] = await connection.query('SELECT * FROM area WHERE area_id = ?', [areaId]);
            if (results.length === 0) {
                return res.status(404).json({ message: 'Área no encontrada' });
            }
            res.json(results[0]); // Devolver el área encontrada
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener el área' });
        }
    },
}
