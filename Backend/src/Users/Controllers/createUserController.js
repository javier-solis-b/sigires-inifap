import { User } from '../Models/User.js';
import { PasswordService } from '../../auth/Services/PasswordService.js';

export const createUserController = async (request, response) => {
    // Depuración: mostrar datos recibidos
    console.log('Datos recibidos para crear usuario:', request.body);

    // Depuración: mostrar usuario autenticado y su isAdmin
    console.log('Usuario autenticado:', request.user);
    console.log('Valor de isAdmin en usuario autenticado:', request.user ? request.user.isAdmin : undefined);

    // Verifica si el usuario autenticado es admin
    if (!request.user || request.user.isAdmin !== 1) {
        return response.status(403).json({ error: 'No autorizado, solo administradores pueden crear usuarios.' });
    }
    const { name, password, isAdmin } = request.body;

    if(!name){
        return response.status(401).json({message: 'Es necesario ingresar un nombre de usuario'})
    }
    if(!password){
        return response.status(401).json({message: 'Es necesario ingresar una contraseña'})
    }

    // Convertir isAdmin a un entero. Asumimos que isAdmin viene como '0' o '1'.
    const isAdminInt = parseInt(isAdmin, 10);

    // Verificar si la conversión fue exitosa y si el valor es válido (0 o 1).
    if (isNaN(isAdminInt) || (isAdminInt !== 0 && isAdminInt !== 1)) {
        return response.status(400).send('Valor inválido para isAdmin. Debe ser 0 o 1.');
    }

    const user = await User.create({
        name: name,        password: await PasswordService.encrypt(password),
        isAdmin: isAdminInt
    });

    console.log("¡Usuario creado exitosamente!");

    // Serializar manualmente el usuario para incluir todos los campos necesarios
    const serializedUser = {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
        // Incluir cualquier otro campo relevante aquí
    };

    response.status(201).json(serializedUser); // Usar .json() en lugar de .send() para enviar objetos directamente
}
