import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePaswwordHelper } from '@/helpers/ulti';
import { JwtService } from '@nestjs/jwt';
import { changePasswordDto, CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {

  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ){}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.UsersService.findByEmail(username)
    if(!user) return null
    const isValidPassword = await comparePaswwordHelper(pass, user.password)
    if(!isValidPassword) return null;
    return user
  }

  private getAuthPayload(user: any) {
    return {sub: user._id, 
      username: user.email,  
      role: user.role,
      accountType: user.accountType,
      restaurantId: user.restaurantId, 
      isActive: user.isActive}
  }

  private getUserResponse(user: any) {
    return {
      email: user.email,
      _id: user._id,
      name: user.name,
      role: user.role,
      accountType: user.accountType,
      restaurantId: user.restaurantId,
      isActive: user.isActive
    }
  }

  private async signAccessToken(payload: any) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED') || '15m',
    })
  }

  private async signRefreshToken(payload: any) {
    return this.jwtService.signAsync({...payload, tokenType: 'refresh'}, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED') || '7d',
    })
  }

  async login (user: any) {
    const payload = this.getAuthPayload(user)
    const data = {
      user: this.getUserResponse(user),
      access_token: await this.signAccessToken(payload),
      refresh_token: await this.signRefreshToken(payload)
    }
    return {
      ...data
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || this.configService.get<string>('JWT_SECRET_KEY'),
      })

      if(decoded?.tokenType !== 'refresh'){
        throw new UnauthorizedException("refresh token invalid")
      }

      const user = await this.UsersService.findByIdForAuth(decoded.sub)
      if(!user || !user.isActive){
        throw new UnauthorizedException("refresh token invalid")
      }

      const payload = this.getAuthPayload(user)
      return {
        access_token: await this.signAccessToken(payload),
        refresh_token: await this.signRefreshToken(payload)
      }
    } catch {
      throw new UnauthorizedException("refresh token invalid")
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
