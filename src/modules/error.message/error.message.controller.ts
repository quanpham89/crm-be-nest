import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ErrorMessageService } from './error.message.service';
import { CreateErrorMessageDto } from './dto/create-error.message.dto';
import { UpdateErrorMessageDto } from './dto/update-error.message.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('error-message')
export class ErrorMessageController {
  constructor(private readonly errorMessageService: ErrorMessageService) {}

  @Post()
  @Public()
  create(@Body() createErrorMessageDto: CreateErrorMessageDto) {
    return this.errorMessageService.create(createErrorMessageDto);
  }

  @Get()
  @Roles('ADMINS')
  findAll() {
    return this.errorMessageService.findAll();
  }


  @Patch()
  @Roles('ADMINS')
  changeStatusError(@Query("_id") _id: string) {
    return this.errorMessageService.changeStatusError(_id);
  }
 
}
