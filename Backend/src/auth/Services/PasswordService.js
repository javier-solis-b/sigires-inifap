import bcrypt from 'bcrypt'
export class PasswordService {

    static saltRounds = 10;

    //cifrar
    static async encrypt(password) {
        const salt = await bcrypt.genSalt(PasswordService.saltRounds);
        return bcrypt.hash(password, salt);
    }
    //verificar
    static check(password, hashedPassword) {

        return bcrypt.compare(password, hashedPassword)

    }

}