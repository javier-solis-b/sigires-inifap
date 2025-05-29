import {Almacen} from '../../../Users/Models/Almacenes.js'

export const almacenDeleteController = async (request, response) => {
    const almacenId = request.params.id;

    await Almacen.destroy({
        where: {
            id: almacenId
        }
    })
    response.status(204).json({});
}