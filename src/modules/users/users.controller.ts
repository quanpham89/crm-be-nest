import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { query } from 'express';
import { Public, Roles } from '@/decorator/customize';

@Controller('users')
@Roles('ADMINS', 'ADMIN', "BUSINESSMAN", "CUSTOMER")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMINS', 'ADMIN')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMINS', 'ADMIN')
  findAll(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get("/get-all-users")
  @Roles('ADMINS', 'ADMIN')
  @Public()
  findAllIdUser() {
    return this.usersService.findAllIdUser();
  }

  @Get("/get-user-by-id")
  @Roles('ADMINS', 'ADMIN', "BUSINESSMAN")
  findOne(@Query("_id") _id: string) {
    return this.usersService.findOne(_id);
  }

  @Patch("update")
  update( @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }


  @Patch('/soft-delete')
  softDelete( 
    @Query("_id") _id:string
  ) {
    return this.usersService.softDelete(_id);
  }

  @Delete('/remove-user')
  @Roles('ADMINS', 'ADMIN')
  remove(@Query("_id") _id:string) {
    return this.usersService.remove(_id);
  }

}
