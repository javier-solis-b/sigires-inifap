import { PasswordService } from "../Services/PasswordService.js";
import { User } from "../../Users/Models/User.js";
import jwt from 'jsonwebtoken'; 

export const loginController = async (request, response) => {
    const { name, password } = request.body;
    const user = await User.findOne({
        where: { name: name }
    });
    if (!user) {
        return response.status(401).json({ message: 'Usuario no existe' });
    }
    const userExist = await PasswordService.check(password, user.password);
    if (!userExist) {
        return response.status(401).json({ message: 'La contraseña es incorrecta' });
    }

    const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY);

    const jsonResponse = {
        message: "¡Usuario logueado correctamente!",
        data: {
            token,
            isAdmin: user.isAdmin // Incluye isAdmin en la respuesta
        }
    };  

    return response.json(jsonResponse);
};
