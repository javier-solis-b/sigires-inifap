import { User } from "../../Users/Models/User.js";


export const showController = async (request, response) => {
    const userId = request.params.id;

    const user =  await User.findOne({
        where:{
            id: userId
        }
    });

    return response.json(user);
}