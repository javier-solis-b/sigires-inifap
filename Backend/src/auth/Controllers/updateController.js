import { User } from "../../Users/Models/User.js";

export const updateController = async (request, response) => {
    const userId = request.params.id;

    const user = await User.findByPk(userId);

    const { name, isAdmin } = request.body;

    user.name = name;
    user.isAdmin = isAdmin; // Asigna el nuevo valor de isAdmin
    await user.save(); // Guarda los cambios

    return response.status(200).json(user);
};
