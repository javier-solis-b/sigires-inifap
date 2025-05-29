import backend from '@/backend.js';
import { TokenService } from './TokenService.js';

export class AuthService {
  static async login(name, password) {
    const response = await backend.post("login", {
      name,
      password
    });

    const token = response.data.data.token;
    const isAdmin = response.data.data.isAdmin; // Suponiendo que el backend devuelve esta información
    TokenService.set(token);
    localStorage.setItem('username', name);
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false'); // Guarda el estado de administrador en localStorage
    return response.data.data;
  }
}
