import { Almacen } from "../Models/Almacenes.js";
export const createAlmacenController = async (request, response) => {
    const {  nombre_almacen } = request.body;

    if(!nombre_almacen ) {
        return response.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const almacen = await Almacen.create({
        nombre_almacen: nombre_almacen,
       

    });

    console.log("¡Almacen creado exitosamente!");

    // Serializar manualmente el recurso para incluir todos los campos necesarios
    const serializedResource = {
        nombre_almacen: almacen.nombre_almacen,
    };

    response.status(201).json(serializedResource); // Usar .json() en lugar de .send() para enviar objetos directamente
}
