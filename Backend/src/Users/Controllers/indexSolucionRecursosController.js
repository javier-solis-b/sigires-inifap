//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\Users\Controllers\indexSolucionRecursosController.js
import { SolucionRecursos } from '../../Users/Models/SolucionRecursos.js';

export const indexSolucionRecursosController = async (request, response) => {
    response.json(await SolucionRecursos.findAll());
}
