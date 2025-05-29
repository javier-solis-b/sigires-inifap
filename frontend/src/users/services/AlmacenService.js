import backend from '@/backend';

export class AlmacenService {
    static async all(){
        const response = await backend.get('/almacenes');
        return response.data ?? [];
    }
}
