import * as bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPaswwordHelper = async (plainPassword: string) => {
    try{
        return await bcrypt.hash(plainPassword, saltRounds)
    }catch(e){
        console.log(e)
    }
}

export const comparePaswwordHelper = async (plainPassword: string, hashPassword : string) => {
    try{
        return await bcrypt.compare(plainPassword, hashPassword)
    }catch(e){
        console.log(e)
    }
}