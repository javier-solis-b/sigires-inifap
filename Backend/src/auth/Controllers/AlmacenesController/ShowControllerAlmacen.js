import { Almacen } from "../../../Users/Models/Almacenes";

export const showControllerAlmacen = async (request, response) => {
    const almacenId = request.params.id;

    const almacen =  await Almacen.findOne({
        where:{
            id: almacenId
        }
    });

    return response.json(almacen);
}