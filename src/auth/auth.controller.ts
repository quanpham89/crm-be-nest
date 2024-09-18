import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request } from '@nestjs/common';
import { LocalAuthGuard } from '@/auth/passport/local.auth.gaurd';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { CreateAuthDto, CodeAuthDto, changePasswordDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService : MailerService
  ) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Fetch login")
  @Public()
  handleLogin(@Request() req){
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

  @Post("verify")
  @Public()
  @UseGuards(JwtAuthGuard)
  verify(@Body() verifyDto : CodeAuthDto){
    return this.authService.handleVerify(verifyDto)
  }

  @Post("re-active")
  @Public()
  @UseGuards(JwtAuthGuard)
  reActive(@Body("email") email : string){
    return this.authService.reActiveAccount(email)
  }

  @Post("re-password")
  @Public()
  @UseGuards(JwtAuthGuard)
  rePassword(@Body("email") email : string){
    return this.authService.resendPassword(email)
  }
  @Post("change-password")
  @Public()
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() data : changePasswordDto){
    return this.authService.changePassword(data)
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
        template: "register",
        context: {
          name: "Peter",
          activationCode: 123456,
          
        }
      })
      .then(() => {})
      .catch(() => {});
  
    return "ok"
  }
}
