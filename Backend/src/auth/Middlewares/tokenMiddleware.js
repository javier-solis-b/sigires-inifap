import { TokenService } from '../../auth/Services/TokenService.js';

export const tokenMiddleware = (request, response, next) => {
    const token = request.headers.authorization;

    if(!TokenService.isValid(token)){
        return response.status(403).json({
            message: ' Datos incorrectos :('
        })
    }

    // Decodificar el token y asignar el usuario autenticado a request.user
    const payload = TokenService.decode(token);
    if (payload) {
        request.user = {
            id: payload.userId,
            isAdmin: payload.isAdmin
        };
    } else {
        return response.status(403).json({ message: 'Token inválido' });
    }

    next();
}