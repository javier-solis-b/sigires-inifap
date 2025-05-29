//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\Users\Controllers\createSolucionStockController.js
import { SolucionesStock } from '../Models/SolucionesStock.js';
import { SolucionRecursos } from '../Models/SolucionRecursos.js';
import { sequelize } from '../../database.js';

export const createSolucionStockController = async (request, response) => {
    const { nombre_solucion, medios_cultivo, recursos } = request.body;
    const t = await sequelize.transaction();
    
    try {
        const solucion = await SolucionesStock.create({
            nombre_solucion,
            medios_cultivo: medios_cultivo || null  // Si no se proporciona, será null
        }, { transaction: t });

        const solucion_id = solucion.id;

        for (const recurso of recursos) {
            await SolucionRecursos.create({
                solucion_id: solucion_id,
                recurso_id: recurso.recurso_id,
                cantidad_usada: recurso.cantidad_usada
            }, { transaction: t });
        }

        await t.commit();
        return response.status(201).json({
            message: 'Solución stock creada exitosamente',
            solucion: {
                id: solucion.id,
                nombre_solucion: solucion.nombre_solucion,
                medios_cultivo: solucion.medios_cultivo
            }
        });
    } catch (error) {
        console.error('Error al crear la solución:', error);
        await t.rollback();
        return response.status(500).json({ 
            error: 'Error al crear la solución stock',
            detalles: error.message
        });
    }
};