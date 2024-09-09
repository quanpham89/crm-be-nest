import * as bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPaswwordHelper = async (plainPassword: string) => {
    try{
        return await bcrypt.hash(plainPassword, saltRounds)
    }catch(e){
        console.log(e)
    }
}