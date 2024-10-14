import { UsersModule } from '@/modules/users/users.module';
import { IsEmail } from 'class-validator';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePaswwordHelper } from '@/helpers/ulti';
import { JwtService } from '@nestjs/jwt';
import { changePasswordDto, CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
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
     const payload = {sub: user._id, username: user.email,  role: user.role, accountType: user.accountType, restaurantId: user.restaurantId}

    return {
      user:{
        email: user.email,
        _id: user._id,
        name: user.name,
        role: user.role,
        accountType: user.accountType,
        restaurantId: user.restaurantId
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

  reActiveAccount = async (email : string) =>{
    return await this.UsersService.reActiveAccount(email)

  }

  resendPassword = async (email : string) =>{
    return await this.UsersService.resendPassword(email)

  }

  changePassword = async (data : changePasswordDto) =>{
    return await this.UsersService.changePassword(data)

  }

  
}
