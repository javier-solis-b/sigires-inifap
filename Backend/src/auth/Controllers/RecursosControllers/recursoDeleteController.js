//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\auth\Controllers\RecursosControllers\recursoDeleteController.js
import { Recurso } from "../../../Users/Models/Recursos.js";

export const recursoDeleteController = async (request, response) => {
    const recursoId = request.params.id;

    try {
        await Recurso.destroy({
            where: {
                id: recursoId
            }
        });
        response.status(204).json({});
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            // Maneja el error de clave foránea
            response.status(400).json({
                message: 'No se puede eliminar el recurso porque esta siendo usado en una solucion stock.   se recomienda eliminar la solucion o editar este recurso con los nuevos parametros'
                
            });
        } else {
            console.error('Error al eliminar recurso:', error);
            response.status(500).json({
                message: 'Ha ocurrido un error al intentar eliminar el recurso.'
            });
        }
    }
}
