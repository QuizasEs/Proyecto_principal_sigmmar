import { connection } from '../db.js';

export const methods = {
    getMessages: async (req, res) => {
        try {
            const [rows] = await connection.query('SELECT * FROM mensaje WHERE mensaje_estado = 1');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener los mensajes" });
        }
    },

    createMessage: async (req, res) => {
        try {
            const { mensaje_texto } = req.body;
            const [result] = await connection.query(
                'INSERT INTO mensaje (mensaje_texto, mensaje_estado) VALUES (?, 1)',
                [mensaje_texto]
            );
            res.json({ id: result.insertId, message: "Mensaje creado exitosamente", redirect: "/mensajes" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al crear el mensaje" });
        }
    },

    updateMessage: async (req, res) => {
        try {
            const { id } = req.params;
            const { mensaje_texto } = req.body;
    
            const [result] = await connection.query(
                'UPDATE mensaje SET mensaje_texto = ? WHERE mensaje_id = ?',
                [mensaje_texto, id]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Mensaje no encontrado o no se realizaron cambios" });
            }
    
            res.json({ message: "Mensaje actualizado exitosamente", redirect: `/ver_mensaje?id=${id}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el mensaje" });
        }
    },

    deleteMessage: async (req, res) => {
        try {
            const { id } = req.params;
            await connection.query('UPDATE mensaje SET mensaje_estado = 0 WHERE mensaje_id = ?', [id]);
            res.json({ message: "Mensaje eliminado exitosamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al eliminar el mensaje" });
        }
    },

    getMessageById: async (req, res) => {
        const mensajeId = req.params.id;
        try {
            const [results] = await connection.query('SELECT * FROM mensaje WHERE mensaje_id = ?', [mensajeId]);
            if (results.length === 0) {
                return res.status(404).json({ message: 'Mensaje no encontrado' });
            }
            res.json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener el mensaje' });
        }
    },
};
