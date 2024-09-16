import { IsEmail } from 'class-validator';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePaswwordHelper } from '@/helpers/ulti';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
@Injectable()
export class AuthService {

  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService
  ){}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.UsersService.findByEmail(username)
    const isValidPassword = await comparePaswwordHelper(pass, user.password)
    if(!user || !isValidPassword) return null;
    return user
  }

  async login (user: any) {
     const payload = {sub: user._id, username: user.email}

    return {
      data : {
        user:{
          isVerify: user.isActive,
          type: user.accountType,
          email: user.email,
          _id: user._id,
          username: user.name,
          active: user.isActive,
          role: user.role
        },

        access_token: await this.jwtService.signAsync(payload)
      }
    }
  }
  
  
   handleRegister = async (registerDto: CreateAuthDto) => {

   return await this.UsersService.handleRegister(registerDto)
 }
  
}
