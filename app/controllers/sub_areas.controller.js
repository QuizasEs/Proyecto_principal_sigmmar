import { connection } from '../db.js';

export const methods = {
    getSubAreas: async (req, res) => {
        try {
            const [rows] = await connection.query(`
                SELECT sub_area.*, area.area_nombre 
                FROM sub_area
                JOIN area ON sub_area.area_id = area.area_id
                WHERE sub_area.sub_estado = 1
            `);
            res.json(rows); // Retorna todas las sub áreas activas
        } catch (error) {
            console.error("Error al obtener las sub áreas:", error);
            res.status(500).json({ message: "Error al obtener las sub áreas." });
        }
    },

    createSubArea: async (req, res) => {
        try {
            const { sub_nombre, sub_descripcion, area_id } = req.body;
            const sub_directorio_img = req.file ? `/media/${req.file.filename}` : null;
            const [result] = await connection.query(
                'INSERT INTO sub_area (sub_nombre, sub_descripcion, area_id, sub_directorio_img, sub_estado) VALUES (?, ?, ?, ?, 1)',
                [sub_nombre, sub_descripcion, area_id, sub_directorio_img]
            );
            res.json({ id: result.insertId, message: "Sub área creada exitosamente" });
        } catch (error) {
            console.error("Error al crear la sub área:", error);
            res.status(500).json({ message: "Error al crear la sub área: " + error.message });
        }
    },

    updateSubArea: async (req, res) => {
        try {
            const { id } = req.params;
            const { sub_nombre, sub_descripcion, area_id } = req.body;

            if (!sub_nombre || !sub_descripcion || !area_id) {
                return res.status(400).json({ message: "Todos los datos son obligatorios" });
            }

            const [subArea] = await connection.query('SELECT * FROM sub_area WHERE sub_id = ?', [id]);
            if (subArea.length === 0) {
                return res.status(404).json({ message: "Sub área no encontrada" });
            }

            const sub_directorio_img = req.file ? `/media/${req.file.filename}` : subArea[0].sub_directorio_img;

            await connection.query(
                'UPDATE sub_area SET sub_nombre = ?, sub_descripcion = ?, area_id = ?, sub_directorio_img = ? WHERE sub_id = ?',
                [sub_nombre, sub_descripcion, area_id, sub_directorio_img, id]
            );
            res.json({ message: "Sub área actualizada exitosamente" });
        } catch (error) {
            console.error("Error al actualizar la sub área:", error);
            res.status(500).json({ message: "Error al actualizar la sub área: " + error.message });
        }
    },

    deleteSubArea: async (req, res) => {
        try {
            const { id } = req.params;
            await connection.query('UPDATE sub_area SET sub_estado = 0 WHERE sub_id = ?', [id]);
            res.json({ message: "Sub área eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la sub área:", error);
            res.status(500).json({ message: "Error al eliminar la sub área: " + error.message });
        }
    },

    getSubAreaById: async (req, res) => {
        try {
            const { id } = req.params;
            const [subArea] = await connection.query('SELECT * FROM sub_area WHERE sub_id = ?', [id]);
            if (subArea.length === 0) {
                return res.status(404).json({ message: "Sub área no encontrada" });
            }
            res.json(subArea[0]);
        } catch (error) {
            console.error("Error al obtener la sub área:", error);
            res.status(500).json({ message: "Error al obtener la sub área: " + error.message });
        }
    }
};
