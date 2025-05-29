import { TokenService } from "../Services/TokenService";
import backend from "@/backend.js";


export const verifyTokenMiddleware = async (to, from, next) => {
    console.log('🟣Ejecutando autenticación');
    
    if (!to.meta.requireAuth) {
      return next();
    }
  
    const token = TokenService.get();
  
    if (!token) {
      return next({ name: 'login' });
    }

    const response = await backend.get('token/verify');
    console.log("🟢 response", response);

    if (!response.data.data.response) {
      return next({ name: 'NoPermisos' });
    }

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (to.meta.requireAdmin && !isAdmin) {
      return next({ name: 'NoPermisos' });
    }
  
    next();
}