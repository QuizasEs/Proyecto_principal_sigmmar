import { connection } from '../db.js';

export const methods = {
    // Obtener usuarios
    getUsers: async (req, res) => {
        try {
            const [rows] = await connection.query('SELECT * FROM user WHERE us_estado = 1');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener los usuarios" });
        }
    },

    // Actualizar un usuario
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const [userData] = await connection.query('SELECT * FROM user WHERE us_id = ?', [id]);
            
            if (userData.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            
            const updatedUser = req.body;
            await connection.query(
                'UPDATE user SET us_username = ?, us_last_login = ?, us_nombres = ?, us_ap_paterno = ?, us_ap_materno = ?, us_correo = ?, us_telefono = ? WHERE us_id = ?',
                [updatedUser.us_username, updatedUser.us_last_login, updatedUser.us_nombres, updatedUser.us_ap_paterno, updatedUser.us_ap_materno, updatedUser.us_correo, updatedUser.us_telefono, id]
            );
            
            res.json({ message: "Usuario actualizado exitosamente", redirect: "/usuarios" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el usuario" });
        }
    },

    // Eliminar un usuario
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params; // Corregido
            await connection.query('UPDATE user SET us_estado = 0 WHERE us_id = ?', [id]);
            res.json({ message: "Usuario eliminado exitosamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al eliminar el usuario" });
        }
    }
};
