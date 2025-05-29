//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\auth\Controllers\solucionesController\updateSolucionController.js
import { SolucionesStock } from '../../../Users/Models/SolucionesStock.js';
import { SolucionRecursos } from '../../../Users/Models/SolucionRecursos.js';
import { sequelize } from '../../../database.js';

export const updateSolucionController = async (req, res) => {
  const { id } = req.params; // ID de la solución a actualizar
  const { medios_cultivo, nombre_solucion, recursos } = req.body; // Datos de la solución y recursos

  // Iniciar una transacción para asegurar la atomicidad de las operaciones
  const t = await sequelize.transaction();

  try {
    // 1. Actualizar la solución en la tabla `solucionesstocks`
    await SolucionesStock.update(
      {
        medios_cultivo,
        nombre_solucion,
      },
      {
        where: { id },
        transaction: t, // Usar la transacción
      }
    );

    // 2. Eliminar los recursos asociados actuales en la tabla `solucionesrecursos`
    await SolucionRecursos.destroy({
      where: { solucion_id: id },
      transaction: t, // Usar la transacción
    });

    // 3. Insertar los nuevos recursos asociados en la tabla `solucionesrecursos`
    for (const recurso of recursos) {
      await SolucionRecursos.create(
        {
          solucion_id: id,
          recurso_id: recurso.recurso_id,
          cantidad_usada: recurso.cantidad_usada,
        },
        { transaction: t } // Usar la transacción
      );
    }

    // Confirmar la transacción si todo está bien
    await t.commit();

    // Respuesta exitosa
    res.status(200).json({
      message: 'Solución y recursos actualizados correctamente',
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await t.rollback();

    console.error('Error actualizando la solución y sus recursos:', error);
    res.status(500).json({
      message: 'Error al actualizar la solución y sus recursos',
      error: error.message,
    });
  }
};