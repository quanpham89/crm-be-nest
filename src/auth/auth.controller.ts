import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request } from '@nestjs/common';
import { LocalAuthGuard } from '@/auth/passport/local.auth.gaurd';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { privateDecrypt } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService : MailerService
  ) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @Public()
  handleLogin(@Request() req){
    console.log(req.user)
    return this.authService.login(req.user)
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req){
    return req.user
  }

  @Post("register")
  @Public()
  @UseGuards(JwtAuthGuard)
  register(@Body() registerDto : CreateAuthDto){
    return this.authService.handleRegister(registerDto)
  }

  @Get("mail")
  @Public()
  @UseGuards(JwtAuthGuard)
  testMail(){
    this.mailerService
      .sendMail({
        to: 'phamdinhquan202@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {})
      .catch(() => {});
  
    return "ok"
  }
}
