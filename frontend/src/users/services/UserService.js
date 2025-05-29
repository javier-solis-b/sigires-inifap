import backend from '@/backend'

export class UserService{

    static async all(){
       return ((await backend.get('usuarios'))).data ?? [];
    }

}

