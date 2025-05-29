// src/auth/Controllers/solucionesController/usarSolucionController.js
import { sequelize } from "../../database.js";
import { SolucionRecursos } from "../../Users/Models/SolucionRecursos.js";
import { Recurso } from "../../Users/Models/Recursos.js";

export const usarSolucionController = async (request, response) => {
  const { solucion_id } = request.params;

  try {
    // Obtener todos los recursos asociados a esta solución
    const recursosSolucion = await SolucionRecursos.findAll({
      where: { solucion_id }
    });

    // Verificar disponibilidad de cada recurso
    for (const recursoSol of recursosSolucion) {
      const recurso = await Recurso.findByPk(recursoSol.recurso_id);
      
      if (recurso.capacidad_r < recursoSol.cantidad_usada) {
        return response.status(400).json({
          message: `No hay suficiente cantidad del recurso ${recurso.nombre}`,
          recurso: recurso.nombre,
          disponible: recurso.capacidad_r,
          requerido: recursoSol.cantidad_usada
        });
      }
    }

    // Si todos los recursos están disponibles, proceder con la actualización
    await sequelize.query(
      `CALL actualizar_inventario(:solucion_id);`,
      {
        replacements: {
          solucion_id,
        },
      }
    );

    response.status(200).json({
      message: "Inventario actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar el inventario:", error);
    response.status(500).json({
      message: "Error al actualizar el inventario",
      detalles: error.message,
    });
  }
};