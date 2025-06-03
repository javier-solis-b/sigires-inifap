import jwt from 'jsonwebtoken';

export class TokenService {
  static isValid(token) {
    if (!token) {
      return false;
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY); // Usar process.env directamente
    } catch (error) {
      return false;
    }
    return true;
  }

  // Nuevo método para decodificar el token y extraer el payload
  static decode(token) {
    if (!token) return null;
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return null;
    }
  }
}
