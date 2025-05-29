import jwt from 'jsonwebtoken';
import { env } from '../../Shared/env.js';

export class TokenService {
  static isValid(token) {
    if (!token) {
      return false;
    }
    try {
      jwt.verify(token, env('JWT_SECRET_KEY')); // Usé process.env para acceder a la variable de entorno
    } catch (error) {
      return false;
    }
    return true;
  }

  // Nuevo método para decodificar el token y extraer el payload
  static decode(token) {
    if (!token) return null;
    try {
      return jwt.verify(token, env('JWT_SECRET_KEY'));
    } catch (error) {
      return null;
    }
  }
}
