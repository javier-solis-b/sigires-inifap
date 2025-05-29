import { Almacen } from '../Models/Almacenes.js';

export const indexAlmacenController = async (request, response) => {
    try {
        const catalogos = await Almacen.findAll();
        response.json(catalogos);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener los recursos.' });
    }
};
