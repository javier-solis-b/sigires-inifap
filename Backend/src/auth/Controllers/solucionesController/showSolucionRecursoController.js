// C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\auth\Controllers\solucionesController\showSolucionRecursoController.js
import { SolucionesStock } from '../../../Users/Models/SolucionesStock.js';
import { SolucionRecursos } from '../../../Users/Models/SolucionRecursos.js';

export const showSolucionRecursoController = async (request, response) => {
    const solucionId = request.params.id;

    try {
        const solucion = await SolucionesStock.findOne({
            where: { id: solucionId },
            include: [{
                model: SolucionRecursos,
                as: 'SolucionesRecursos', // Asegúrate de que este alias coincida con la asociación
                include: ['recurso'] // Incluir el recurso asociado
            }]
        });

        if (!solucion) {
            return response.status(404).json({ error: 'Solución no encontrada' });
        }

        // Cambiar el nombre de la clave "SolucionesRecursos" a "recursos"
        const solucionFormateada = {
            ...solucion.toJSON(),
            recursos: solucion.SolucionesRecursos
        };
        delete solucionFormateada.SolucionesRecursos;

        return response.json(solucionFormateada);
    } catch (error) {
        console.error("Error fetching solucion with recursos:", error);
        return response.status(500).json({ error: 'Error al obtener la solución y sus recursos' });
    }
};