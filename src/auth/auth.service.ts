import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePaswwordHelper } from '@/helpers/ulti';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService
  ){}

  async SignIn (username: string, pass : string) : Promise<any>{
    const user = await this.UsersService.findByEmail(username)
    const isValidPassword = await comparePaswwordHelper(pass, user.password)
    if(!isValidPassword){
      throw new UnauthorizedException()
    } 
    const payload = {sub: user._id, username: user.email}
    return {
      access_token: await this.jwtService.signAsync(payload)
    }

  }
}
