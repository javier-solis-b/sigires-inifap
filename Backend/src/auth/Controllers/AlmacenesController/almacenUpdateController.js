import { Almacen } from "../../../Users/Models/Almacenes.js";

export const almacenUpdateController = async (request, response) => {
    const almacenId = request.params.id;

    const almacen = await Almacen.findByPk(almacenId);

    const updateData = {
        nombre_almacen: request.body.nombre_almacen
    };

    almacen.update(updateData)
        .then(() => {
            return response.status(200).json(almacen);
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({ message: 'Error al actualizar el recurso' });
        });
};
