//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\auth\Controllers\solucionesController\solucionDeleteController.js
import { SolucionesStock } from "../../../Users/Models/SolucionesStock.js";
import { SolucionRecursos } from "../../../Users/Models/SolucionRecursos.js";
import { sequelize } from "../../../database.js";

export const solucionDeleteController = async (request, response) => {
    const solucionId = request.params.id;

    // Iniciar una transacción para asegurar la atomicidad de las operaciones
    const t = await sequelize.transaction();

    try {
        // Eliminar los registros relacionados en la tabla solucionesrecursos
        await SolucionRecursos.destroy({
            where: {
                solucion_id: solucionId
            },
            transaction: t
        });

        // Eliminar la solución en la tabla solucionesstocks
        await SolucionesStock.destroy({
            where: {
                id: solucionId
            },
            transaction: t
        });

        // Confirmar la transacción
        await t.commit();

        // Responder con un código 204 (No Content) indicando que la operación fue exitosa
        response.status(204).json({});
    } catch (error) {
        // Si hay un error, revertir la transacción
        await t.rollback();

        console.error('Error al eliminar la solución:', error);
        response.status(500).json({
            message: 'Ha ocurrido un error al intentar eliminar la solución.',
            detalles: error.message
        });
    }
};