import { User } from '../Models/User.js';

export const indexUserController = async (request, response) => {
    response.json(await User.findAll());
}
