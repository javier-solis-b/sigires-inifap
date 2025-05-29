import { Recurso } from "../../../Users/Models/Recursos.js";

export const recursoUpdateController = async (request, response) => {
    const recursoId = request.params.id;

    const recurso = await Recurso.findByPk(recursoId);

    const updateData = {
        nombre: request.body.nombre,
        catalogo_id: request.body.catalogo_id,
        no_inventario: request.body.no_inventario,
        tipo_recurso: request.body.tipo_recurso,
        marca: request.body.marca,
        pm: request.body.pm,
        formula: request.body.formula,
        capacidad_r: request.body.capacidad_r,
        lote: request.body.lote,
        recipientes_actuales: request.body.recipientes_actuales,
        unidad_medida: request.body.unidad_medida,
        fecha_caducidad: request.body.fecha_caducidad
    };

    recurso.update(updateData)
        .then(() => {
            return response.status(200).json(recurso);
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({ message: 'Error al actualizar el recurso' });
        });
};
