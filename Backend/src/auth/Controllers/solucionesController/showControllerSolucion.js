//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\auth\Controllers\solucionesController\showControllerSolucion.js
import { SolucionesStock } from "../../../Users/Models/SolucionesStock.js";
import { SolucionRecursos } from "../../../Users/Models/SolucionRecursos.js";
import { Recurso } from "../../../Users/Models/Recursos.js";

export const showControllerSolucion = async (request, response) => {
    const solucionId = request.params.id;

    const solucion = await SolucionesStock.findOne({
        where: {
            id: solucionId
        },
        include: [{
            model: SolucionRecursos,
            include: [{
                model: Recurso
            }]
        }]
    });

    if (!solucion) {
        return response.status(404).json({ message: 'Solución no encontrada' });
    }

    return response.json(solucion);
}