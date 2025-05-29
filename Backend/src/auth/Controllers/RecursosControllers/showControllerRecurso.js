// C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\auth\Controllers\RecursosControllers\showControllerRecurso.js

import { Recurso } from "../../../Users/Models/Recursos.js";

export const showControllerRecurso = async (request, response) => {
    const recursoId = request.params.id;

    const recurso = await Recurso.findOne({
        where: {
            id: recursoId
        }
    });

    return response.json(recurso);
}

export const updateCapacidad = async (request, response) => {
    const { cantidad, accion } = request.body;
    const recursoId = request.params.id;

    const recurso = await Recurso.findByPk(recursoId);

    if (accion === 'agregar') {
        recurso.capacidad_r += cantidad;
    } else if (accion === 'quitar') {
        recurso.capacidad_r -= cantidad;
    }

    await recurso.save();

    return response.status(200).json({ message: 'Capacidad actualizada exitosamente' });
}

export const updateRecipientes = async (request, response) => {
    const { accion } = request.body;
    const recursoId = request.params.id;

    const recurso = await Recurso.findByPk(recursoId);

    if (accion === 'agregar') {
        recurso.recipientes_actuales++;
    } else if (accion === 'quitar' && recurso.recipientes_actuales > 0) {
        recurso.recipientes_actuales--;
    }

    await recurso.save();

    return response.status(200).json({ message: 'Recipientes actualizados exitosamente' });
}
