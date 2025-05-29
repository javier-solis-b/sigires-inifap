//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\frontend\src\users\services\RecursoService.js
import backend from '@/backend';
import { AlmacenService } from './AlmacenService'; // Asegúrate de importar correctamente

export class RecursoService {
    static async all(){
        try {
            const recursosResponse = await backend.get('/recursos');
            const almacenesResponse = await AlmacenService.all();

            // Crea un objeto para mapear IDs de almacenes a nombres
            const almacenesMap = new Map(almacenesResponse.map(almacen => [almacen.id, almacen.nombre_almacen]));

            // Mapear la respuesta para incluir el nombre del almacen
            return recursosResponse.data.map(resource => ({
                ...resource,
                almacen: almacenesMap.has(resource.catalogo_id) 
                    ? almacenesMap.get(resource.catalogo_id)
                    : '-'
            }));
        } catch (error) {
            console.error('Error al cargar recursos:', error);
            throw error;
        }
    }

    static async updateCapacidad(id, cantidad, accion) {
        try {
          const response = await backend.post(`/recursos/${id}/update-capacity`, { cantidad, accion });
          if (response.status === 200) {
            return response.data;
          } else {
            throw new Error(`Error al actualizar capacidad: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error al actualizar capacidad:', error);
          throw error;
        }
      }
    
      static async updateRecipientes(id, accion) {
        try {
          const response = await backend.post(`/recursos/${id}/update-recipientes`, { accion });
          if (response.status === 200) {
            return response.data;
          } else {
            throw new Error(`Error al actualizar recipientes: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error al actualizar recipientes:', error);
          throw error;
        }
      }
    
}
