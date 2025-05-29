import { Recurso } from '../Models/Recursos.js';

export const indexRecursoController = async (request, response) => {
    try {
        const recursos = await Recurso.findAll();
        response.json(recursos);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener los recursos.' });
    }
};
