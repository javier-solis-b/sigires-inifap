import { User } from "../../Users/Models/User.js";

export const deleteController = async (request, response) => {
    // Verifica si el usuario autenticado es admin
    if (!request.user || !request.user.isAdmin) {
        return response.status(403).json({ error: 'No autorizado, solo administradores pueden eliminar usuarios.' });
    }
    const userId = request.params.id;

    await User.destroy({
        where: {
            id: userId
        }
    })
    response.status(204).json({});
}