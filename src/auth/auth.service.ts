import { IsEmail } from 'class-validator';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePaswwordHelper } from '@/helpers/ulti';
import { JwtService } from '@nestjs/jwt';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
@Injectable()
export class AuthService {

  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService
  ){}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.UsersService.findByEmail(username)
    if(!user) return null
    const isValidPassword = await comparePaswwordHelper(pass, user.password)
    if(!isValidPassword) return null;
    return user
  }

  async login (user: any) {
     const payload = {sub: user._id, username: user.email}

    return {
      user:{
        
        email: user.email,
        _id: user._id,
        username: user.name,

      },
      access_token: await this.jwtService.signAsync(payload)
    }
  }
  
  
  handleRegister = async (registerDto: CreateAuthDto) => {

    return await this.UsersService.handleRegister(registerDto)
  }

  handleVerify = async (data : CodeAuthDto) =>{

    return await this.UsersService.handleVerify(data)

  }
  
}
