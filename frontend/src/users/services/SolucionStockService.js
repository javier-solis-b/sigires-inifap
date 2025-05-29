// C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\frontend\src\users\services\SolucionStockService.js
import backend from '@/backend';

export class SolucionStockService {
  // Obtener todas las soluciones
  static async all() {
    const response = await backend.get('/soluciones');
    return response.data ?? [];
  }

  // Obtener una solución específica por su ID con sus recursos
  static async getWithResources(id) {
    const response = await backend.get(`/soluciones/${id}/recursos`);
    return response.data;
  }

  // Crear una nueva solución
  static async create(data) {
    const response = await backend.post('/soluciones', data);
    return response.data;
  }

  // Actualizar una solución existente
  static async update(id, data) {
    const response = await backend.put(`/soluciones/${id}`, data);
    return response.data;
  }

  // Eliminar una solución
  static async delete(id) {
    const response = await backend.delete(`/soluciones/${id}`);
    return response.data;
  }

  //Usar solucion
  static async usarSolucion(solucion_id) {
    try {
      const response = await backend.post(`/soluciones/${solucion_id}/usar`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Esto es para el caso de recursos insuficientes
        throw error.response.data;
      }
      throw error;
    }
  }
}