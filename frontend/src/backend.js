import axios from "axios";
import { API_BASE_URL } from "./config";
import { TokenService } from "./auth/Services/TokenService";

const backend  = axios.create({
    baseURL: API_BASE_URL
});

backend.interceptors.request.use((config) => {
    const token = TokenService.get();

    if(token){
        config.headers.Authorization = token;
    }

    return config; 
});

export const fetchUsers = async () => {
    try {
        const response = await backend.get('users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export default backend;
