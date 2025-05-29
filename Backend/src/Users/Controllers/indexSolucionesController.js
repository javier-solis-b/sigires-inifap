//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\Users\Controllers\indexSolucionesController.js
import { SolucionesStock } from "../../Users/Models/SolucionesStock.js";

export const indexSolucionesController = async (request, response) => {
  try {
    const soluciones = await SolucionesStock.findAll();
    response.json(soluciones);
  } catch (error) {
    console.error("Error fetching soluciones:", error);
    response.status(500).json({ error: 'Error al obtener las soluciones' });
  }
};
