//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\frontend\src\users\services\SolucionRecursosService.js
import backend from '@/backend';
import { RecursoService } from './RecursoService.js';

export class SolucionRecursosService {
    static async all() {
        try {
            const solucionesRecursosResponse = await backend.get('/soluciones-recursos');
            const recursosResponse = await RecursoService.all();

            // Crear un map de recursos para acceder fácilmente a los nombres
            const recursosMap = new Map(recursosResponse.map(recurso => [recurso.id, recurso.nombre]));

            // Mapear la respuesta para incluir el nombre del recurso
            return solucionesRecursosResponse.data.map(solucionRecurso => ({
                ...solucionRecurso,
                nombre: recursosMap.get(solucionRecurso.recurso_id) || 'Recurso no encontrado'
            }));
        } catch (error) {
            console.error('Error al cargar soluciones y recursos:', error);
            throw error;
        }
    }
}
